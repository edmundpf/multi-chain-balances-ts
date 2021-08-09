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
const misc_1 = require("./misc");
const values_1 = require("./values");
// Init
dotenv_1.default.config();
const ADDRESS = process.env.ADDRESS || '';
const MIN_VALUE = Number(process.env.MIN_VALUE) || 0.05;
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
            const requests = [
                this.getTokenList(),
                this.getProtocolList(),
                this.getApeBoardPositions(),
                this.getBeefyApy(),
            ];
            const res = yield Promise.all(requests);
            const tokenData = res[0];
            const protocolData = res[1];
            const positionData = res[2];
            const apyData = res[3];
            this.parseTokenData(tokenData);
            this.parseProtocolData(protocolData);
            this.parseApyData(positionData, apyData);
            this.parseChainData();
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
            // Check if chain exists
            if (this.chainNames.includes(chain)) {
                // Check for Beefy Receipt
                if (symbol.startsWith('moo')) {
                    this.chains[chain].receipts[symbol] = amount;
                }
                // Check for minimum value
                else if (value >= MIN_VALUE) {
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
                    chainInfo.totalTokenValue += value;
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
            const { chain, name: platform, site_url: platformUrl, portfolio_item_list: vaults } = record;
            // Check if chain exists
            if (this.chainNames.includes(chain)) {
                const chainInfo = this.chains[chain];
                // Vault Info
                for (const vault of vaults) {
                    const value = ((_a = vault === null || vault === void 0 ? void 0 : vault.stats) === null || _a === void 0 ? void 0 : _a.net_usd_value) || 0;
                    // Check for minimum value
                    if (value >= MIN_VALUE) {
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
                        // Update vault data
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
     * Parse APY Data
     */
    parseApyData(positionData, apyData) {
        for (const chainName in this.chains) {
            const chain = this.chains[chainName];
            // Iterate positions
            for (const position of positionData[chainName]) {
                const matches = {};
                const symbolsStr = misc_1.titleCase(position.tokens
                    .join(' ')
                    .toLowerCase())
                    .toLowerCase();
                const symbols = symbolsStr.split(' ');
                // Iterate Receipts
                for (const receiptName in chain.receipts) {
                    const receiptAmount = chain.receipts[receiptName];
                    const isPair = receiptName.includes('-');
                    let receiptStr = receiptName;
                    if (isPair) {
                        const dashIndex = receiptStr.indexOf('-');
                        receiptStr = receiptStr.substring(0, dashIndex + 1) +
                            receiptStr.substring(dashIndex + 1).toUpperCase();
                    }
                    receiptStr = misc_1.titleCase(receiptStr).toLowerCase();
                    const receiptStrNoSpaces = receiptStr.replace(/ /g, '');
                    const receiptWords = receiptStr.split(' ');
                    const isMatch = isPair
                        ? symbols.every((sym) => (receiptWords.slice(receiptWords.length - symbols.length).some((receiptSym) => sym.includes(receiptSym))))
                        : receiptStr.includes(symbolsStr) ||
                            receiptStrNoSpaces.includes(symbolsStr);
                    if (isMatch) {
                        matches[receiptName] = Math.abs(position.amount - receiptAmount);
                    }
                }
                // Get Closest Match
                let receiptMatch = '';
                let currentDiff = 0;
                for (const receiptName in matches) {
                    const diff = matches[receiptName];
                    if (!receiptMatch || diff < currentDiff) {
                        receiptMatch = receiptName;
                    }
                }
                // Get Matching APY
                if (receiptMatch) {
                    const receiptStr = misc_1.titleCase(receiptMatch.replace('V2', 'v2'))
                        .toLowerCase();
                    let receiptWords = receiptStr.split(' ').slice(1);
                    // Check if Symbol has version and format receipt words
                    const symbolHasVersion = receiptWords.length == 2 &&
                        receiptWords[0].endsWith('v') &&
                        String(Number(receiptWords[1])) == receiptWords[1];
                    if (symbolHasVersion)
                        receiptWords = [receiptWords.join('')];
                    const receiptWordsSet = [receiptWords];
                    // Get Aliases
                    for (const key in values_1.exchangeAliases) {
                        if (receiptStr.includes(key)) {
                            for (const alias of values_1.exchangeAliases[key]) {
                                receiptWordsSet.push(receiptStr
                                    .replace(key, alias)
                                    .split(' ')
                                    .slice(1));
                            }
                        }
                    }
                    // Find Matching Vault
                    for (const vaultName in apyData) {
                        let vaultMatch = '';
                        for (const wordSet of receiptWordsSet) {
                            const isMatch = wordSet.length == 1
                                ? vaultName.endsWith(`-${wordSet[0]}`)
                                : wordSet.every((word) => (word == 'swap' || vaultName.includes(word)));
                            if (isMatch) {
                                vaultMatch = vaultName;
                                break;
                            }
                        }
                        if (vaultMatch) {
                            let currentDiff = -1;
                            let vaultIndexMatch = 0;
                            // Get Matching Vault
                            for (const vaultIndex in chain.vaults) {
                                const isMatch = position.tokens.every((token) => (chain.vaults[vaultIndex].symbol
                                    .toLowerCase()
                                    .includes(token.toLowerCase())));
                                const vault = chain.vaults[vaultIndex];
                                const diff = Math.abs(vault.value - position.value);
                                if (isMatch && (currentDiff == -1 || diff < currentDiff)) {
                                    vaultIndexMatch = Number(vaultIndex);
                                    currentDiff = diff;
                                }
                            }
                            // Set Vault Info
                            const vaultInfo = chain.vaults[vaultIndexMatch];
                            vaultInfo.apy = apyData[vaultName] * 100;
                            vaultInfo.beefyVaultName = vaultName;
                            vaultInfo.beefyReceiptName = receiptMatch;
                            vaultInfo.beefyReceiptAmount = chain.receipts[receiptMatch];
                            break;
                        }
                    }
                }
            }
        }
    }
    /**
     * Parse Chain Data
     */
    parseChainData() {
        const assetCounts = {};
        const assetIndexes = {};
        // Add Asset
        const addAsset = (record, chainName, useBeefyVaultName = false) => {
            const { symbol, value } = record;
            const apy = record.apy || 0;
            const beefyVaultName = record.beefyVaultName || '';
            const url = record.platformUrl || values_1.DEFAULT_URLS[chainName];
            let symbolStr = useBeefyVaultName && beefyVaultName
                ? beefyVaultName.toUpperCase()
                : symbol;
            if (!beefyVaultName || !useBeefyVaultName) {
                if (assetCounts[symbol] > 1) {
                    const symbolIndex = assetIndexes[symbol] != null
                        ? assetIndexes[symbol] + 1
                        : 0;
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
        for (const chainName in this.chains) {
            const chain = this.chains[chainName];
            // Update Chain Total Value
            chain.totalValue = chain.totalTokenValue + chain.totalVaultValue;
            // Update simplified assets
            for (const record of chain.tokens) {
                addAsset(record, chainName);
                addToken(record);
            }
            for (const record of chain.vaults) {
                if (record.beefyReceiptName && record.beefyVaultName) {
                    addAsset(record, chainName, true);
                }
                for (const token of record.tokens) {
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
     * Get Ape Board Positions
     */
    getApeBoardPositions() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [
                this.getApeBoardEndpoint('beefyBsc'),
                this.getApeBoardEndpoint('beefyPolygon')
            ];
            const res = yield Promise.all(requests);
            const bscInfo = ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.positions) || [];
            const maticInfo = ((_b = res[1]) === null || _b === void 0 ? void 0 : _b.positions) || [];
            const bscPositions = [];
            const maticPositions = [];
            // BSC Positions
            for (const record of bscInfo) {
                const tokens = [];
                let value = 0;
                for (const token of record.tokens) {
                    tokens.push(token.symbol);
                    value += Number(token.price) * token.balance;
                }
                bscPositions.push({
                    amount: record.balance,
                    value,
                    tokens,
                });
            }
            // Matic Positions
            for (const record of maticInfo) {
                const tokens = [];
                let value = 0;
                for (const token of record.tokens) {
                    tokens.push(token.symbol);
                    value += Number(token.price) * token.balance;
                }
                maticPositions.push({
                    amount: record.balance,
                    value,
                    tokens,
                });
            }
            return {
                bsc: bscPositions,
                eth: [],
                matic: maticPositions
            };
        });
    }
    /**
     * Get Endpoint
     */
    getEndpoint(api, endpoint, params, headers) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = values_1.APIS[api];
                const stub = values_1.ENDPOINTS[endpoint] || endpoint;
                let paramStr = params ? new URLSearchParams(params).toString() : '';
                if (paramStr)
                    paramStr = '?' + paramStr;
                const fullUrl = `${apiUrl}/${stub}${paramStr}`;
                return ((_a = (yield axios_1.default.get(fullUrl, headers ? { headers } : undefined))) === null || _a === void 0 ? void 0 : _a.data) || {};
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
}
exports.default = MultiChain;
