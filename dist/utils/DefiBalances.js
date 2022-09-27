"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const envValues_1 = require("./envValues");
const values_1 = require("./values");
const utils_1 = require("./utils");
/**
 * DefiBalances Class
 */
class DefiBalances {
    /**
     * Constructor
     */
    constructor(address) {
        var _a;
        // Properties
        this.address = '';
        this.isEVM = false;
        this.totalValue = 0;
        this.totalTokenValue = 0;
        this.totalVaultValue = 0;
        this.chains = values_1.initChains();
        this.assets = {};
        this.tokenNames = [];
        this.unknownTokens = [];
        if (address) {
            this.address = address; /* Address Argument */
        }
        else {
            // First Address from Environment Array
            if (envValues_1.ENV_ADDRESS.includes('[')) {
                try {
                    this.address = ((_a = JSON.parse(envValues_1.ENV_ADDRESS)) === null || _a === void 0 ? void 0 : _a[0]) || '';
                }
                catch (err) {
                    // Do Nothing
                }
            }
            else {
                this.address = envValues_1.ENV_ADDRESS; /* Single Environment Address */
            }
        }
        // Format Address
        const lowerAddress = this.address.toLowerCase();
        this.isEVM = lowerAddress.startsWith('0x');
        if (this.isEVM)
            this.address = lowerAddress;
        // Get Chain Names
        this.chainNames = Object.keys(this.chains);
    }
    /**
     * Get All Balances
     */
    getBalances(filterUnkownTokens = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [
                this.isEVM ? utils_1.getTokenList(this.address, this.chainNames) : [],
                this.isEVM && filterUnkownTokens ? utils_1.getKnownTokenList(this.address, this.chainNames) : [],
                this.isEVM ? utils_1.getProtocolList(this.address) : [],
                this.isEVM ? utils_1.getBeefyApy() : {},
                this.isEVM ? utils_1.getBeefyVaults() : {},
            ];
            const res = yield Promise.all(requests);
            const tokenData = res[0];
            const knownTokenData = res[1];
            const protocolData = res[2];
            const apyData = res[3];
            const vaultData = res[4];
            this.parseTokenData(tokenData, knownTokenData);
            this.parseProtocolData(protocolData);
            this.parseApyData(apyData, vaultData);
            this.getAssetsAndTotalValues();
        });
    }
    /**
     * Get Assets & Total Values
     */
    getAssetsAndTotalValues() {
        const assetCounts = {};
        const assetIndexes = {};
        // Add Asset
        const addAsset = (record, chainName, isVault = false) => {
            const { symbol, value } = record;
            const apy = record.apy || 0;
            const vaultName = record.vaultName || '';
            const url = record.platformUrl || values_1.DEFAULT_URLS[chainName];
            let symbolStr = isVault && vaultName ? vaultName.toUpperCase() : symbol;
            if (!vaultName || !isVault) {
                if (assetCounts[symbol] > 1) {
                    const symbolIndex = assetIndexes[symbol] != null ? assetIndexes[symbol] + 1 : 0;
                    symbolStr += `-${symbolIndex}`;
                    assetIndexes[symbol] = symbolIndex;
                }
            }
            symbolStr += ` (${chainName.toUpperCase()})`;
            this.assets[symbolStr] = {
                desc: symbol,
                value,
                apy,
                url,
            };
        };
        // Add Token
        const addToken = (token) => {
            const { symbol } = token;
            if (!this.tokenNames.includes(symbol)) {
                this.tokenNames.push(symbol);
            }
        };
        // Update Asset Count
        const updateAssetCount = (record) => {
            const symbol = record.symbol;
            if (!assetCounts[symbol])
                assetCounts[symbol] = 1;
            else
                assetCounts[symbol] += 1;
        };
        // Get Duplicate Assets Counts
        for (const chainName in this.chains) {
            const chain = this.chains[chainName];
            for (const record of chain.tokens) {
                updateAssetCount(record);
            }
            for (const record of chain.vaults) {
                updateAssetCount(record);
            }
        }
        // Parse Data
        for (const chainNm in this.chains) {
            const chainName = chainNm;
            const chain = this.chains[chainName];
            // Update Chain Total Value
            chain.totalValue = chain.totalTokenValue + chain.totalVaultValue;
            // Update simplified assets
            for (const record of chain.tokens) {
                if (utils_1.isUnknownToken(this.unknownTokens, record.symbol))
                    continue;
                addAsset(record, chainName);
                addToken(record);
            }
            for (const record of chain.vaults) {
                if (record.receiptName && record.vaultName) {
                    addAsset(record, chainName, true);
                }
                for (const token of record.tokens) {
                    if (utils_1.isUnknownToken(this.unknownTokens, record.symbol))
                        continue;
                    addToken(token);
                }
            }
            // Update Totals from all chains
            this.totalTokenValue += chain.totalTokenValue;
            this.totalVaultValue += chain.totalVaultValue;
        }
        this.totalValue = this.totalTokenValue + this.totalVaultValue;
    }
    /**
     * Parse Token Data
     */
    parseTokenData(data, knownData) {
        // Get Known Symbols
        const knownSymbols = [];
        for (const record of knownData) {
            knownSymbols.push(record.symbol);
        }
        // Iterate All Tokens
        for (const record of data) {
            // Token Info
            const { chain, symbol, price: recPrice, balance, decimals } = record;
            const recAmount = utils_1.nativeToDecimal(balance || 0, decimals);
            const price = recPrice || 0;
            const amount = recAmount || 0;
            const value = price * amount;
            // Check if Chain exists
            if (this.chainNames.includes(chain)) {
                // Check for Beefy Receipt
                if (symbol.toLowerCase().startsWith('moo')) {
                    const formattedSymbol = symbol.replace(/ /g, '');
                    this.chains[chain].receipts[formattedSymbol] = amount;
                }
                // Check for minimum value
                else if (value >= envValues_1.ENV_MIN_VALUE) {
                    const chainInfo = this.chains[chain];
                    const tokenData = {
                        symbol,
                        amount,
                        value,
                    };
                    const isNativeToken = symbol == values_1.NATIVE_TOKENS[chain];
                    const shouldDisplay = knownSymbols.length
                        ? knownSymbols.includes(symbol) || isNativeToken
                        : true;
                    // Update token data
                    if (shouldDisplay) {
                        chainInfo.tokens.push(tokenData);
                    }
                    // Add Unknown Tokens
                    else {
                        const tokenName = utils_1.sterilizeTokenNameNoStub(symbol);
                        if (!this.unknownTokens.includes(tokenName)) {
                            this.unknownTokens.push(tokenName);
                        }
                    }
                    // Set Native Token Info
                    if (isNativeToken) {
                        chainInfo.nativeToken = tokenData;
                    }
                    // Exclude Unknown Token Totals
                    if (shouldDisplay && !utils_1.isUnknownToken(this.unknownTokens, symbol)) {
                        chainInfo.totalTokenValue += value;
                    }
                }
            }
        }
    }
    /**
     * Parse Protocol Data
     */
    parseProtocolData(data) {
        var _a, _b;
        for (const record of data) {
            // Platform Info
            const { chain, name: platform, site_url: platformUrl, portfolio_list: vaults, } = record;
            // Check if Chain exists
            if (this.chainNames.includes(chain)) {
                const chainInfo = this.chains[chain];
                // Vault Info
                for (const vault of vaults) {
                    const value = ((_a = vault === null || vault === void 0 ? void 0 : vault.stats) === null || _a === void 0 ? void 0 : _a.net_usd_value) || 0;
                    // Check for minimum value
                    if (value >= envValues_1.ENV_MIN_VALUE) {
                        let vaultSymbol = '';
                        const tokens = ((_b = vault === null || vault === void 0 ? void 0 : vault.detail) === null || _b === void 0 ? void 0 : _b.supply_token_list) || [];
                        const tokenData = [];
                        // Token Info
                        for (const token of tokens) {
                            const { symbol, price: recPrice, balance, decimals } = token;
                            const recAmount = utils_1.nativeToDecimal(balance || 0, decimals);
                            if (symbol) {
                                const price = recPrice || 0;
                                const amount = recAmount || 0;
                                const value = price * amount;
                                if (vaultSymbol)
                                    vaultSymbol += '-';
                                vaultSymbol += symbol;
                                tokenData.push({
                                    symbol,
                                    amount,
                                    value,
                                });
                            }
                        }
                        // Update vault data
                        if (vaultSymbol)
                            vaultSymbol += '-Pool';
                        chainInfo.vaults.push({
                            symbol: vaultSymbol,
                            value,
                            platform,
                            platformUrl,
                            tokens: tokenData,
                        });
                        chainInfo.totalVaultValue += value;
                    }
                }
            }
        }
    }
    /**
     * Parse APY Data
     */
    parseApyData(apyData, vaultData) {
        // Iterate Chains
        for (const chainName in this.chains) {
            const chain = this.chains[chainName];
            // Iterate Vault Info
            for (const vault of chain.vaults) {
                const matches = {};
                const tokens = [];
                // Get Token Names in Vault
                for (const token of vault.tokens) {
                    tokens.push(token.symbol);
                }
                // Format Symbols for Parsing
                let symbolsStr = utils_1.titleCase(tokens.join(' ').toLowerCase().replace(/\.e/g, 'e')).toLowerCase();
                const numericSymbol = utils_1.hasNumber(symbolsStr);
                // Numeric Symbol Format
                if (numericSymbol) {
                    let numIndex = 0;
                    for (let i = 0; i < symbolsStr.length; i++) {
                        const curLetter = symbolsStr[i];
                        if (utils_1.hasNumber(curLetter)) {
                            numIndex = i;
                            break;
                        }
                    }
                    symbolsStr = symbolsStr.substring(numIndex);
                }
                let symbols = symbolsStr.split(' ');
                // Remove Numeric Symbols
                symbols = symbols.filter((sym) => isNaN(Number(sym)));
                // Iterate Beefy Receipts
                for (const receiptName in chain.receipts) {
                    const receiptAmount = chain.receipts[receiptName];
                    const isPair = receiptName.includes('-');
                    let receiptStr = receiptName;
                    // Format LP Pairs for Parsing
                    if (isPair) {
                        const dashIndex = receiptStr.indexOf('-');
                        receiptStr =
                            receiptStr.substring(0, dashIndex + 1) +
                                receiptStr.substring(dashIndex + 1).toUpperCase();
                    }
                    // Format Beefy Receipts for Parsing
                    receiptStr = receiptStr.replace(/\.E/g, 'E').replace(/\.e/g, 'E');
                    receiptStr = utils_1.titleCase(receiptStr).toLowerCase();
                    const receiptStrNoSpaces = receiptStr.replace(/ /g, '');
                    const receiptWords = receiptStr.split(' ');
                    const receiptWordsEnd = receiptWords.slice(receiptWords.length - symbols.length);
                    // Add Alias Token Names
                    for (const word of symbols) {
                        if (values_1.TOKEN_ALIASES[word] && !symbols.includes(values_1.TOKEN_ALIASES[word])) {
                            symbols.push(values_1.TOKEN_ALIASES[word]);
                        }
                    }
                    const tokensMatchReceiptTokens = receiptWordsEnd.every((receiptSym) => symbols.some((sym) => sym.includes(receiptSym) || receiptSym.includes(sym)));
                    // Check if receipt has alias
                    let isReceiptAlias = false;
                    for (const part in values_1.RECEIPT_ALIASES) {
                        if (receiptStrNoSpaces.includes(part)) {
                            const aliasTokens = values_1.RECEIPT_ALIASES[part];
                            isReceiptAlias = aliasTokens.every((aliasSym) => symbols.some((receiptSym) => receiptSym.includes(aliasSym) ||
                                aliasSym.includes(receiptSym)));
                            if (isReceiptAlias)
                                break;
                        }
                    }
                    // Check for Match comparing Symbols vs. Receipts
                    const isMatch = receiptStr.includes(symbolsStr) ||
                        receiptStrNoSpaces.includes(symbolsStr) ||
                        tokensMatchReceiptTokens ||
                        isReceiptAlias;
                    // Add Match to Compare Vault/Receipt Amounts
                    if (isMatch) {
                        const vaultAmount = vault.amount || 0;
                        matches[receiptName] =
                            isReceiptAlias || Math.abs(vaultAmount - receiptAmount);
                    }
                }
                // Get Closest Match using Vault/Receipt Amounts
                let receiptMatch = '';
                let currentDiff = 0;
                for (const receiptName in matches) {
                    const matchValue = matches[receiptName];
                    // Get Match by Alias
                    const isAlias = matchValue === true;
                    if (isAlias) {
                        receiptMatch = receiptName;
                        break;
                    }
                    // Get Match using receipt difference
                    const diff = isAlias ? 0 : matchValue;
                    if (!receiptMatch || diff < currentDiff) {
                        receiptMatch = receiptName;
                        currentDiff = diff;
                    }
                }
                // Get Matching APY Info
                if (receiptMatch) {
                    for (const unwrappedVaultReceipt in vaultData) {
                        const id = vaultData[unwrappedVaultReceipt];
                        const unwrappedReceipt = receiptMatch
                            .toLowerCase()
                            .replace(/w/g, '');
                        if (unwrappedReceipt == unwrappedVaultReceipt &&
                            apyData[id] != null) {
                            // Set Vault Info
                            vault.apy = apyData[id] * 100;
                            vault.vaultName = id;
                            vault.receiptName = receiptMatch;
                            vault.receiptAmount = chain.receipts[receiptMatch];
                            break;
                        }
                    }
                }
            }
        }
    }
}
exports.default = DefiBalances;
