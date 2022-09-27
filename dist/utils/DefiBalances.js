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
    getBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = [
                this.isEVM ? yield utils_1.getTokenList(this.address, this.chainNames) : [],
                this.isEVM ? yield utils_1.getProtocolList(this.address) : [],
                this.isEVM ? yield utils_1.getBeefyApy() : {},
                this.isEVM ? yield utils_1.getBeefyVaults() : {},
            ];
            const tokenData = res[0];
            const protocolData = res[1];
            const apyData = res[2];
            const vaultData = res[3];
            this.parseTokenData(tokenData);
            this.parseProtocolData(protocolData, vaultData);
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
    parseTokenData(data) {
        // Iterate All Tokens
        for (const record of data) {
            // Token Info
            const { chain, symbol, price: recPrice, amount: decAmount, balance, decimals } = record;
            const recAmount = decAmount ? decAmount : utils_1.nativeToDecimal(balance || 0, decimals);
            const price = recPrice || 0;
            const amount = recAmount || 0;
            const value = price * amount;
            // Check if Chain exists
            if (this.chainNames.includes(chain)) {
                // Check for minimum value
                if (value >= envValues_1.ENV_MIN_VALUE) {
                    const chainInfo = this.chains[chain];
                    const tokenData = {
                        symbol,
                        amount,
                        value,
                    };
                    const isNativeToken = symbol == values_1.NATIVE_TOKENS[chain];
                    const shouldDisplay = !symbol.startsWith('0x');
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
    parseProtocolData(data, vaultData) {
        var _a, _b, _c, _d, _e;
        // Get Vaults by Address
        const vaultsByAddress = {};
        for (const vault of vaultData) {
            vaultsByAddress[vault.earnedTokenAddress.toLowerCase()] = vault;
        }
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
                        const receiptAddress = ((_c = vault === null || vault === void 0 ? void 0 : vault.pool) === null || _c === void 0 ? void 0 : _c.id) || '';
                        const receiptName = ((_d = vaultsByAddress[receiptAddress]) === null || _d === void 0 ? void 0 : _d.earnedToken) || '';
                        const vaultName = ((_e = vaultsByAddress[receiptAddress]) === null || _e === void 0 ? void 0 : _e.id) || '';
                        // Token Info
                        for (const token of tokens) {
                            const { symbol, price: recPrice, amount: decAmount, balance, decimals } = token;
                            const recAmount = decAmount ? decAmount : utils_1.nativeToDecimal(balance || 0, decimals);
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
                            receiptAddress,
                            receiptName,
                            vaultName
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
                const vaultName = vault.vaultName;
                for (const apyName in apyData) {
                    if (vaultName == apyName) {
                        vault.apy = apyData[apyName] * 100;
                        break;
                    }
                }
            }
        }
    }
}
exports.default = DefiBalances;
