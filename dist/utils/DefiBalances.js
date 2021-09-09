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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const misc_1 = require("./misc");
const envValues_1 = require("./envValues");
const values_1 = require("./values");
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
        this.address = this.address.toLowerCase();
        this.chainNames = Object.keys(this.chains);
    }
    /**
     * Get All Balances
     */
    getBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [
                this.getTokenList(),
                this.getProtocolList(),
                this.getBeefyApy(),
            ];
            const res = yield Promise.all(requests);
            const tokenData = res[0];
            const protocolData = res[1];
            const apyData = res[2];
            this.parseTokenData(tokenData);
            this.parseProtocolData(protocolData);
            this.parseApyData(apyData);
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
            const beefyVaultName = record.beefyVaultName || '';
            const url = record.platformUrl || values_1.DEFAULT_URLS[chainName];
            let symbolStr = isVault && beefyVaultName ? beefyVaultName.toUpperCase() : symbol;
            if (!beefyVaultName || !isVault) {
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
                if (this.isUnknownToken(record.symbol))
                    continue;
                addAsset(record, chainName);
                addToken(record);
            }
            for (const record of chain.vaults) {
                if (record.beefyReceiptName && record.beefyVaultName) {
                    addAsset(record, chainName, true);
                }
                for (const token of record.tokens) {
                    if (this.isUnknownToken(record.symbol))
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
     * Get Endpoint
     */
    getEndpoint(api, endpoint, params, headers) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = values_1.APIS[api];
                const stub = values_1.ENDPOINTS[endpoint] || endpoint;
                let paramStr = params ? new URLSearchParams(params).toString() : '';
                if (paramStr)
                    paramStr = '?' + paramStr;
                const fullUrl = `${apiUrl}/${stub}${paramStr}`;
                return (((_a = (yield axios_1.default.get(fullUrl, headers ? { headers } : undefined))) === null || _a === void 0 ? void 0 : _a.data) ||
                    {});
            }
            catch (err) {
                return Object.assign(Object.assign({}, (((_c = (_b = err) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.data) || {})), { hasError: true });
            }
        });
    }
    /**
     * Get Ape Board Endpoint
     */
    getApeBoardEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('apeBoard', `${endpoint}/${this.address}`, undefined, {
                passcode: values_1.apeBoardCredentials.passCode,
                'ape-secret': values_1.apeBoardCredentials.secret,
            });
        });
    }
    /**
     * Is Stable Coin
     */
    isStableCoin(tokenName, price) {
        const upperToken = tokenName.toUpperCase();
        const isNormalStable = upperToken.includes(values_1.FIAT_CURRENCY);
        const isOtherStable = values_1.stableCoinConfig.otherCoins.includes(tokenName);
        const withinError = price >= 1 - values_1.stableCoinConfig.errorPercent &&
            price <= 1 + values_1.stableCoinConfig.errorPercent;
        return (isNormalStable || isOtherStable) && withinError;
    }
    /**
     * Is Native Token
     */
    isNativeToken(tokenName) {
        return Object.values(values_1.NATIVE_TOKENS).includes(tokenName);
    }
    /**
     * Is Unknown Token
     */
    isUnknownToken(symbol) {
        const sterileSymbol = this.sterilizeTokenNameNoStub(symbol);
        return this.unknownTokens.includes(sterileSymbol);
    }
    /**
     * Sterilize Token Name
     */
    sterilizeTokenName(token) {
        return (token || '').replace(/ /g, '-').toUpperCase();
    }
    /**
     * Remove Token Contract Stub
     */
    sterilizeTokenNameNoStub(tokenName) {
        let curName = tokenName;
        if (tokenName.includes('-')) {
            const dashParts = tokenName.split('-');
            const lastPart = dashParts[dashParts.length - 1];
            const isPool = lastPart == 'Pool';
            const hasStub = lastPart.startsWith('0x') && lastPart.length == 6;
            if (!isPool && hasStub) {
                dashParts.pop();
                curName = dashParts.join('-');
            }
        }
        return this.sterilizeTokenName(curName);
    }
    /**
     * Get Address Stub
     */
    getAddressStub(address) {
        return address.substring(2, 6).toUpperCase();
    }
    /**
     * Get Beefy Endpoint
     */
    getBeefyEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('beefy', endpoint);
        });
    }
    /**
     * Get Debank Endpoint
     */
    getDebankEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('debank', endpoint, { id: this.address });
        });
    }
    /**
     * Parse Token Data
     */
    parseTokenData(data) {
        for (const record of data) {
            // Token Info
            const { chain, symbol, price: recPrice, amount: recAmount } = record;
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
                    // Update token data
                    chainInfo.tokens.push(tokenData);
                    if (symbol == values_1.NATIVE_TOKENS[chain]) {
                        chainInfo.nativeToken = tokenData;
                    }
                    if (!this.isUnknownToken(symbol)) {
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
            const { chain, name: platform, site_url: platformUrl, portfolio_item_list: vaults, } = record;
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
                            const { symbol, price: recPrice, amount: recAmount } = token;
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
    parseApyData(apyData) {
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
                let symbolsStr = misc_1.titleCase(tokens.join(' ').toLowerCase()).toLowerCase();
                const numericSymbol = misc_1.hasNumber(symbolsStr);
                // Numeric Symbol Format
                if (numericSymbol) {
                    let numIndex = 0;
                    for (let i = 0; i < symbolsStr.length; i++) {
                        const curLetter = symbolsStr[i];
                        if (misc_1.hasNumber(curLetter)) {
                            numIndex = i;
                            break;
                        }
                    }
                    symbolsStr = symbolsStr.substring(numIndex);
                }
                const symbols = symbolsStr.split(' ');
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
                    receiptStr = misc_1.titleCase(receiptStr).toLowerCase();
                    const receiptStrNoSpaces = receiptStr.replace(/ /g, '');
                    const receiptWords = receiptStr.split(' ');
                    const receiptWordsEnd = receiptWords.slice(receiptWords.length - symbols.length);
                    const hasMultipleSymbols = symbols.length >= 2;
                    const tokensMatchReceiptTokens = symbols.every((sym) => receiptWordsEnd.some((receiptSym) => sym.includes(receiptSym)));
                    // Check for Match comparing Symbols vs. Receipts
                    const isMatch = isPair
                        ? hasMultipleSymbols && tokensMatchReceiptTokens
                        : receiptStr.includes(symbolsStr) ||
                            receiptStrNoSpaces.includes(symbolsStr) ||
                            (!hasMultipleSymbols && tokensMatchReceiptTokens);
                    // Add Match to Compare Vault/Receipt Amounts
                    if (isMatch) {
                        const vaultAmount = vault.amount || 0;
                        matches[receiptName] = Math.abs(vaultAmount - receiptAmount);
                    }
                }
                // Get Closest Match using Vault/Receipt Amounts
                let receiptMatch = '';
                let currentDiff = 0;
                for (const receiptName in matches) {
                    const diff = matches[receiptName];
                    if (!receiptMatch || diff < currentDiff) {
                        receiptMatch = receiptName;
                        currentDiff = diff;
                    }
                }
                // Get Matching APY Info
                if (receiptMatch) {
                    // Format Pancake-LP V2 Receipts
                    const receiptStr = misc_1.titleCase(receiptMatch.replace('V2', 'v2')).toLowerCase();
                    let receiptWords = receiptStr.split(' ').slice(1);
                    // Check if Symbol has Version and format Receipt Words
                    const symbolHasVersion = receiptWords.length == 2 &&
                        receiptWords[0].endsWith('v') &&
                        String(Number(receiptWords[1])) == receiptWords[1];
                    if (symbolHasVersion)
                        receiptWords = [receiptWords.join('')];
                    const receiptWordsSet = [receiptWords];
                    // Get APY Aliases
                    for (const key in values_1.EXCHANGE_ALIASES) {
                        if (receiptStr.includes(key)) {
                            for (const alias of values_1.EXCHANGE_ALIASES[key]) {
                                receiptWordsSet.push(receiptStr.replace(key, alias).split(' ').slice(1));
                            }
                        }
                    }
                    // Find Matching APY Info
                    for (const vaultName in apyData) {
                        let vaultMatch = '';
                        for (const wordSet of receiptWordsSet) {
                            const isMatch = wordSet.length == 1
                                ? vaultName.endsWith(`-${wordSet[0]}`)
                                : wordSet.every((word) => word == 'swap' || vaultName.includes(word));
                            if (isMatch) {
                                vaultMatch = vaultName;
                                break;
                            }
                        }
                        // Set Vault Info
                        if (vaultMatch) {
                            vault.apy = apyData[vaultName] * 100;
                            vault.beefyVaultName = vaultName;
                            vault.beefyReceiptName = receiptMatch;
                            vault.beefyReceiptAmount = chain.receipts[receiptMatch];
                            break;
                        }
                    }
                }
            }
        }
    }
    /**
     * Get Token List
     */
    getTokenList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getDebankEndpoint('tokenList');
        });
    }
    /**
     * Get Protocol List
     */
    getProtocolList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getDebankEndpoint('protocolList');
        });
    }
    /**
     * Get Beefy APY
     */
    getBeefyApy() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getBeefyEndpoint('beefyApy');
        });
    }
}
exports.default = DefiBalances;
