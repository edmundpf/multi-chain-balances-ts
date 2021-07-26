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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const config_json_1 = __importDefault(require("./config.json"));
const values_1 = require("./values");
// Init
dotenv_1.default.config();
const ADDRESS = process.env.ADDRESS || '';
/**
 * MultiChain Class
 */
class MultiChain {
    /**
     * Constructor
     */
    constructor() {
        // Properties
        this.address = ADDRESS;
        this.totalValue = 0;
        this.totalTokenValue = 0;
        this.totalVaultValue = 0;
        this.chains = values_1.initChains();
        this.assets = {};
        this.tokenNames = [];
        this.chainNames = Object.keys(this.chains);
    }
    /**
     * Driver
     */
    driver() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield this.getTokenList();
            const protocolData = yield this.getProtocolList();
            // const beefyApyData: BeefyVaults = await this.getBeefyApy()
            this.parseTokenData(tokenData);
            this.parseProtocolData(protocolData);
            // this.parseBeefyApyData(beefyApyData)
            this.parseChainData();
            // console.log(this)
            console.log(this);
        });
    }
    /**
     * Parse Token Data
     */
    parseTokenData(data) {
        for (const record of data) {
            const { chain, symbol, price: recPrice, amount: recAmount } = record;
            const price = recPrice || 0;
            const amount = recAmount || 0;
            const value = price * amount;
            if (value >= config_json_1.default.minimumValue && this.chainNames.includes(chain)) {
                const chainInfo = this.chains[chain];
                const tokenData = {
                    symbol,
                    amount,
                    value,
                };
                chainInfo.tokens.push(tokenData);
                if (symbol == values_1.NATIVE_TOKENS[chain]) {
                    chainInfo.nativeToken = tokenData;
                }
                chainInfo.totalTokenValue += value;
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
            const { chain, name: platform, site_url: platformUrl, portfolio_item_list: vaults } = record;
            if (this.chainNames.includes(chain)) {
                const chainInfo = this.chains[chain];
                // Vault Info
                for (const vault of vaults) {
                    const value = ((_a = vault === null || vault === void 0 ? void 0 : vault.stats) === null || _a === void 0 ? void 0 : _a.net_usd_value) || 0;
                    if (value >= config_json_1.default.minimumValue) {
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
                                    value
                                });
                            }
                        }
                        if (vaultSymbol)
                            vaultSymbol += '-Pool';
                        chainInfo.vaults.push({
                            symbol: vaultSymbol,
                            value,
                            platform,
                            platformUrl,
                            tokens: tokenData
                        });
                        chainInfo.totalVaultValue += value;
                    }
                }
            }
        }
    }
    /**
     * Parse Beefy APY Data
     */
    parseBeefyApyData(data) {
        return 0;
    }
    /**
     * Parse Chain Data
     */
    parseChainData() {
        const assetCounts = {};
        const assetIndexes = {};
        // Add Asset
        const addAsset = (record, chainName) => {
            const { symbol, value } = record;
            let symbolStr = symbol;
            if (assetCounts[symbol] > 1) {
                const symbolIndex = assetIndexes[symbol] != null
                    ? assetIndexes[symbol] + 1
                    : 0;
                symbolStr += `-${symbolIndex}`;
                assetIndexes[symbol] = symbolIndex;
            }
            symbolStr += ` (${chainName.toUpperCase()})`;
            this.assets[symbolStr] = value;
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
        for (const chainName in this.chains) {
            const chain = this.chains[chainName];
            // Get Total Value
            chain.totalValue = chain.totalTokenValue + chain.totalVaultValue;
            // Simplify Assets and Tokens
            for (const record of chain.tokens) {
                addAsset(record, chainName);
                addToken(record);
            }
            for (const record of chain.vaults) {
                addAsset(record, chainName);
                for (const token of record.tokens) {
                    addToken(token);
                }
            }
            // Get Totals between Chains
            this.totalTokenValue += chain.totalTokenValue;
            this.totalVaultValue += chain.totalVaultValue;
        }
        this.totalValue = this.totalTokenValue + this.totalVaultValue;
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
    /**
     * Get Endpoint
     */
    getEndpoint(api, endpoint, params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = values_1.APIS[api];
                const stub = values_1.ENDPOINTS[endpoint];
                let paramStr = params ? new URLSearchParams(params).toString() : '';
                if (paramStr)
                    paramStr = '?' + paramStr;
                const fullUrl = `${apiUrl}/${stub}${paramStr}`;
                return ((_a = (yield axios_1.default.get(fullUrl))) === null || _a === void 0 ? void 0 : _a.data) || {};
            }
            catch (err) {
                return ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || {};
            }
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
     * Get Beefy Endpoint
     */
    getBeefyEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('beefy', endpoint);
        });
    }
}
exports.default = MultiChain;
