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
const path_1 = require("path");
const fs_1 = require("fs");
const misc_1 = require("./misc");
const envValues_1 = require("./envValues");
const values_1 = require("./values");
const { readFile, writeFile } = fs_1.promises;
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
    getBalances(filterUnkownTokens = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [
                this.getTokenList(),
                filterUnkownTokens ? this.getKnownTokenList() : [],
                this.getProtocolList(),
                this.getBeefyApy(),
                this.getBeefyVaults(),
                this.getHarmonyTokensAndVaults(),
            ];
            const res = yield Promise.all(requests);
            const tokenData = res[0];
            const knownTokenData = res[1];
            const protocolData = res[2];
            const apyData = res[3];
            const vaultData = res[4];
            const harmonyTokenData = res[5];
            const allTokenData = [...tokenData, ...harmonyTokenData];
            this.parseTokenData(allTokenData, knownTokenData);
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
     * Remove Token Contract Stub
     */
    sterilizeTokenNameNoStub(tokenName) {
        let curName = tokenName;
        if (tokenName.includes('-')) {
            let dashParts = tokenName.split('-');
            const lastPart = dashParts[dashParts.length - 1];
            const isPool = lastPart == 'Pool';
            const hasStub = lastPart.startsWith('0x') && lastPart.length == 6;
            if (!isPool && hasStub) {
                dashParts = dashParts.slice(0, dashParts.length - 2);
                curName = dashParts.join('-');
            }
        }
        return this.sterilizeTokenName(curName);
    }
    /**
     * Add Contract
     */
    addContract(symbols, symbol, address) {
        const upperSymbol = this.symbolWithDashes(symbol).toUpperCase();
        const lowerAddress = address.toLowerCase();
        const isContract = this.isContract(lowerAddress);
        if (upperSymbol && isContract) {
            if (!symbols[upperSymbol]) {
                symbols[upperSymbol] = [lowerAddress];
            }
            else if (!symbols[upperSymbol].includes(lowerAddress)) {
                symbols[upperSymbol].push(lowerAddress);
            }
        }
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
     * Get Address Stub
     */
    getAddressStub(address) {
        return address.substring(2, 6).toUpperCase();
    }
    /**
     * Is Contract
     */
    isContract(address) {
        return address.startsWith('0x');
    }
    /**
     * Dashed Symbol
     */
    symbolWithDashes(symbol) {
        return (symbol || '').replace(/ /g, '-');
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
                        const tokenName = this.sterilizeTokenNameNoStub(symbol);
                        if (!this.unknownTokens.includes(tokenName)) {
                            this.unknownTokens.push(tokenName);
                        }
                    }
                    // Set Native Token Info
                    if (isNativeToken) {
                        chainInfo.nativeToken = tokenData;
                    }
                    // Exclude Unknown Token Totals
                    if (shouldDisplay && !this.isUnknownToken(symbol)) {
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
                let symbolsStr = misc_1.titleCase(tokens.join(' ').toLowerCase().replace(/\.e/g, 'e')).toLowerCase();
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
                    receiptStr = receiptStr.replace(/\.E/g, 'E').replace(/\.e/g, 'E');
                    receiptStr = misc_1.titleCase(receiptStr).toLowerCase();
                    const receiptStrNoSpaces = receiptStr.replace(/ /g, '');
                    const receiptWords = receiptStr.split(' ');
                    const receiptWordsEnd = receiptWords.slice(receiptWords.length - symbols.length);
                    // Add Alias Token Names
                    for (const word of receiptWordsEnd) {
                        if (values_1.TOKEN_ALIASES[word] &&
                            !receiptWordsEnd.includes(values_1.TOKEN_ALIASES[word])) {
                            receiptWordsEnd.push(values_1.TOKEN_ALIASES[word]);
                        }
                    }
                    const hasMultipleSymbols = symbols.length >= 2;
                    const tokensMatchReceiptTokens = symbols.every((sym) => receiptWordsEnd.some((receiptSym) => sym.includes(receiptSym)));
                    // Check if receipt has alias
                    let isReceiptAlias = false;
                    for (const part in values_1.RECEIPT_ALIASES) {
                        if (receiptStrNoSpaces.includes(part)) {
                            const aliasTokens = values_1.RECEIPT_ALIASES[part];
                            isReceiptAlias = symbols.every((sym) => aliasTokens.some((receiptSym) => sym.includes(receiptSym)));
                        }
                    }
                    // Check for Match comparing Symbols vs. Receipts
                    const isMatch = isPair
                        ? hasMultipleSymbols && tokensMatchReceiptTokens
                        : receiptStr.includes(symbolsStr) ||
                            receiptStrNoSpaces.includes(symbolsStr) ||
                            (!hasMultipleSymbols && tokensMatchReceiptTokens) ||
                            isReceiptAlias;
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
                    for (const unwrappedVaultReceipt in vaultData) {
                        const id = vaultData[unwrappedVaultReceipt];
                        const unwrappedReceipt = receiptMatch
                            .toLowerCase()
                            .replace(/w/g, '');
                        if (unwrappedReceipt == unwrappedVaultReceipt &&
                            apyData[id] != null) {
                            // Set Vault Info
                            vault.apy = apyData[id] * 100;
                            vault.beefyVaultName = id;
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
     * Get Beefy Vaults
     */
    getBeefyVaults() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let savedVaults = {};
            const vaultFile = path_1.resolve(values_1.SAVED_VAULTS_FILE);
            // Get Saved Vaults
            try {
                savedVaults = JSON.parse(yield readFile(vaultFile, 'utf-8'));
            }
            catch (err) {
                // Do Nothing
            }
            // Init Vaults
            const vaults = Object.assign({}, savedVaults);
            // Iterage URL's
            for (const key in values_1.BEEFY_VAULT_URLS) {
                // Get Plain Text
                const pool = values_1.BEEFY_VAULT_URLS[key];
                const jsText = ((_b = (_a = (yield axios_1.default.get(`${values_1.APIS.githubVaults}/${pool}_pools.js`, {
                    responseType: 'text',
                }))) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                // Parse Text
                if (jsText.includes('[')) {
                    try {
                        const data = eval(jsText.substring(jsText.indexOf('['), jsText.length - 1));
                        // Add Vault
                        for (const record of data) {
                            const { id, earnedToken } = record;
                            const formattedToken = earnedToken.toLowerCase().replace(/w/g, '');
                            vaults[formattedToken] = id;
                        }
                    }
                    catch (err) {
                        // Do Nothing
                    }
                }
            }
            // Write File
            writeFile(vaultFile, JSON.stringify(vaults, null, 2));
            return vaults;
        });
    }
    /**
     * Get Harmony Tokens and Vaults
     */
    getHarmonyTokensAndVaults() {
        return __awaiter(this, void 0, void 0, function* () {
            const responses = yield Promise.all([
                this.getHarmonyTokensInfo(),
                this.getHarmonyVaultsInfo(),
            ]);
            const tokensResponse = responses[0];
            const vaultsResponse = responses[1];
            const parsedTokens = this.parseHarmonyTokens(tokensResponse);
            this.parseHarmonyVaults(vaultsResponse);
            return parsedTokens;
        });
    }
    /**
     * Parse Harmony Tokens
     */
    parseHarmonyTokens(response) {
        const parsedTokens = [];
        const tokens = (response === null || response === void 0 ? void 0 : response.tokens) || [];
        for (const token of tokens) {
            const { symbol, amount, usd } = token;
            const price = usd / amount;
            parsedTokens.push({
                chain: 'one',
                symbol: symbol.toUpperCase(),
                price,
                amount,
            });
        }
        return parsedTokens;
    }
    /**
     * Parse Harmony Vaults
     */
    parseHarmonyVaults(response) {
        var _a, _b, _c;
        const vaults = ((_a = response === null || response === void 0 ? void 0 : response.hbeefy) === null || _a === void 0 ? void 0 : _a.farms) || [];
        const platformUrl = ((_b = response === null || response === void 0 ? void 0 : response.hbeefy) === null || _b === void 0 ? void 0 : _b.url) || '';
        // Iterate Vaults
        for (const vault of vaults) {
            const { deposit, farm } = vault;
            const symbol = `${farm.name.toUpperCase()}-Pool`;
            const value = deposit.usd || 0;
            const apy = ((_c = farm.yield) === null || _c === void 0 ? void 0 : _c.apy) || 0;
            const beefyVaultName = farm.id.split('_')[1] || '';
            const beefyReceiptName = `moo${beefyVaultName}`;
            const tokenNames = farm.token.split('-');
            const tokens = [];
            // Iterate Token Names
            for (const tokenName of tokenNames) {
                tokens.push({
                    symbol: tokenName.toUpperCase(),
                    value: 0,
                    amount: 0,
                });
            }
            // Push Vault
            this.chains.one.vaults.push({
                symbol,
                value,
                platform: 'Beefy',
                platformUrl,
                beefyVaultName,
                beefyReceiptName,
                apy,
                tokens,
            });
        }
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
    getDebankEndpoint(endpoint, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('debank', endpoint, Object.assign(Object.assign({}, args), { id: this.address }));
        });
    }
    /**
     * Get Farm.Army Endpoint
     */
    getFarmArmyEndpoint(endpoint, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = misc_1.getFormattedURL(values_1.ENDPOINTS[endpoint], { $address: this.address });
            return yield this.getEndpoint('farmArmy', url, params);
        });
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
     * Get Known Token List
     */
    getKnownTokenList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getDebankEndpoint('tokenList', { is_all: false });
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
     * Get Harmony Tokens Info
     */
    getHarmonyTokensInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getFarmArmyEndpoint('harmonyTokens');
        });
    }
    /**
     * Get Harmony Vaults Info
     */
    getHarmonyVaultsInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getFarmArmyEndpoint('harmonyVaults');
        });
    }
}
exports.default = DefiBalances;
