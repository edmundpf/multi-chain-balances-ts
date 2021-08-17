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
const fs_1 = require("fs");
const transactions_1 = require("./transactions");
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
        this.transactions = values_1.initTrans();
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
                // this.getTokenList(),
                // this.getProtocolList(),
                // this.getApeBoardPositions(),
                // this.getBeefyApy(),
                this.getAllTransactions(false),
            ];
            const res = yield Promise.all(requests);
            // const tokenData = res[0] as Token[]
            // const protocolData = res[1] as Protocol[]
            // const positionData = res[2] as ApeBoardPositions
            // const apyData = res[3] as NumDict
            // this.parseTokenData(tokenData)
            // this.parseProtocolData(protocolData)
            // this.parseApyData(positionData, apyData)
            // this.parseChainData()
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
        const hasNumber = (str) => /\d/.test(str);
        for (const chainName in this.chains) {
            const chain = this.chains[chainName];
            // Iterate positions
            for (const position of positionData[chainName]) {
                const matches = {};
                // Symbol Formatting
                let symbolsStr = misc_1.titleCase(position.tokens
                    .join(' ')
                    .toLowerCase())
                    .toLowerCase();
                const numericSymbol = hasNumber(symbolsStr);
                // Numeric Symbol Format
                if (numericSymbol) {
                    let numIndex = 0;
                    for (let i = 0; i < symbolsStr.length; i++) {
                        const curLetter = symbolsStr[i];
                        if (hasNumber(curLetter)) {
                            numIndex = i;
                            break;
                        }
                    }
                    symbolsStr = symbolsStr.substring(numIndex);
                }
                const symbols = symbolsStr.split(' ');
                // Iterate Receipts
                for (const receiptName in chain.receipts) {
                    const receiptAmount = chain.receipts[receiptName];
                    const isPair = receiptName.includes('-');
                    let receiptStr = receiptName;
                    // Pair Format
                    if (isPair) {
                        const dashIndex = receiptStr.indexOf('-');
                        receiptStr = receiptStr.substring(0, dashIndex + 1) +
                            receiptStr.substring(dashIndex + 1).toUpperCase();
                    }
                    // Receipt Formatting
                    receiptStr = misc_1.titleCase(receiptStr).toLowerCase();
                    const receiptStrNoSpaces = receiptStr.replace(/ /g, '');
                    const receiptWords = receiptStr.split(' ');
                    // Check for Match
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
     * Get All Transactions
     */
    getAllTransactions(useReq = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [];
            if (useReq) {
                // Defi Taxes Request
                const processRequest = this.getDefiTaxesEndpoint.bind(this, 'defiTaxesProcess');
                // Chain Aliases
                const chainAliases = {
                    bsc: 'BSC',
                    eth: 'ETH',
                    matic: 'Polygon'
                };
                // Send Requests
                for (const chainName of this.chainNames) {
                    requests.push(processRequest({ chain: chainAliases[chainName] || chainName }));
                }
            }
            // Resolve Requests
            const res = useReq
                ? yield Promise.all(requests)
                : JSON.parse(fs_1.readFileSync('./src/utils/trans.json', 'utf-8'));
            // Iterate Chains
            for (const index in res) {
                const result = res[index];
                const chainName = this.chainNames[index];
                for (const record of result) {
                    // Transaction Details
                    const { hash, rows, type: transType, ts: timeNum, } = record;
                    // Transaction Properties
                    const date = new Date(Number(timeNum) * 1000).toISOString();
                    const type = transType || '';
                    const transRec = Object.assign(Object.assign({}, values_1.defaultHistoryRecord), { id: hash, date,
                        type, chain: chainName });
                    // Addresses
                    let toAddress = '';
                    let fromAddress = '';
                    // Token Info
                    const tokens = {};
                    const tokenTypes = {
                        buys: [],
                        sells: [],
                    };
                    // Token Checks
                    for (const row of rows) {
                        const tokenName = transactions_1.getTokenName(row);
                        // Get Buy Tokens
                        if (transactions_1.checkBuy(row) && !tokenTypes.buys.includes(tokenName)) {
                            tokenTypes.buys.push(tokenName);
                        }
                        // Get Sell Tokens
                        else if (transactions_1.checkSell(row) && !tokenTypes.sells.includes(tokenName)) {
                            tokenTypes.sells.push(tokenName);
                        }
                    }
                    // Iterate Rows
                    for (const row of rows) {
                        // Row Details
                        const { to, from, value, rate, treatment } = row;
                        // Row Properties
                        const token = transactions_1.getTokenName(row);
                        const isFee = transactions_1.checkFee(row);
                        const hasBuys = tokenTypes.buys.includes(token);
                        const hasSells = tokenTypes.sells.includes(token);
                        const quantity = value || 0;
                        const price = rate || 0;
                        const amount = quantity * price;
                        // Swap
                        if (type == 'swap') {
                            transRec.type == 'swap';
                            transRec.direction == 'buy';
                            transRec.fills = 1;
                            // Quote Token
                            if (!isFee && hasBuys && !hasSells) {
                                tokens[token] = {
                                    quantity,
                                    amount,
                                    price,
                                    fills: 1,
                                    type: 'quote'
                                };
                            }
                            // Base Token
                            else if (!isFee && hasSells) {
                                const isBuy = transactions_1.checkBuy(row);
                                const adjQuantity = isBuy ? quantity * -1 : quantity;
                                const adjAmount = adjQuantity * price;
                                if (!isBuy) {
                                    toAddress = to || '';
                                    fromAddress = from || '';
                                }
                                if (!tokens[token]) {
                                    tokens[token] = {
                                        quantity: adjQuantity,
                                        amount: adjAmount,
                                        price,
                                        fills: 1,
                                        type: 'base'
                                    };
                                }
                                else {
                                    const { quantity: prevQuantity, amount: prevAmount, price: prevPrice, fills: prevFills, } = tokens[token];
                                    const newFills = prevFills + 1;
                                    tokens[token].fills = newFills;
                                    tokens[token].quantity = adjQuantity + prevQuantity;
                                    tokens[token].amount = adjAmount + prevAmount;
                                    tokens[token].price =
                                        ((prevPrice * prevFills) + price) / newFills;
                                }
                            }
                            // Fee Token
                            else if (isFee) {
                                transRec.feeToken = token;
                                transRec.fees = amount;
                                transRec.feeQuantity = quantity;
                                transRec.feePrice = price;
                            }
                        }
                        // Fees
                        else if (type == 'fee') {
                            transRec.type = 'fee';
                            transRec.direction = 'buy';
                            transRec.feeToken = token;
                            transRec.fees = amount;
                            transRec.feeQuantity = quantity;
                            transRec.feePrice = price;
                            transRec.fromAddress = from || '';
                            this.transactions[chainName].push(transRec);
                            break;
                        }
                        // Unknown
                        else if (!type) {
                            // Receive
                            if (treatment == 'gift' && rows.length == 1) {
                                transactions_1.setDeposit(transRec, {
                                    token,
                                    quantity,
                                    amount,
                                    price,
                                    from,
                                    to
                                });
                                this.transactions[chainName].push(transRec);
                                break;
                            }
                        }
                        // Deposits
                        else if (type.includes('deposit') && rows.length == 1) {
                            transactions_1.setDeposit(transRec, {
                                token,
                                quantity,
                                amount,
                                price,
                                from,
                                to
                            });
                            console.log('DEPOSIT');
                            this.transactions[chainName].push(transRec);
                            break;
                        }
                    }
                    // Convert tokens to transaction
                    if (Object.keys(tokens).length > 0) {
                        for (const tokenName in tokens) {
                            const { type, quantity, amount, price, } = tokens[tokenName];
                            if (type == 'quote') {
                                transRec.quote = tokenName;
                                transRec.quantity = quantity;
                                transRec.amount = amount;
                                transRec.price = price;
                            }
                            else if (type == 'base') {
                                transRec.base = tokenName;
                                transRec.baseQuantity = quantity;
                                transRec.baseAmount = amount;
                                transRec.basePrice = price;
                            }
                        }
                        const ticker = transRec.quote && transRec.base
                            ? transactions_1.getTicker(transRec.quote, transRec.base)
                            : (transRec.quote || '');
                        let curAmount = transRec.amount
                            ? transRec.amount
                            : transRec.baseAmount;
                        let baseAmount = transRec.baseAmount
                            ? transRec.baseAmount
                            : transRec.amount;
                        curAmount = curAmount > baseAmount ? baseAmount : curAmount;
                        baseAmount = curAmount;
                        const curPrice = transRec.price
                            ? transRec.price
                            : curAmount / transRec.quantity;
                        const basePrice = transRec.basePrice
                            ? transRec.basePrice
                            : baseAmount / transRec.baseQuantity;
                        // Update Transaction
                        transRec.ticker = ticker;
                        transRec.fromAddress = fromAddress;
                        transRec.toAddress = toAddress;
                        transRec.amount = curAmount;
                        transRec.price = curPrice;
                        transRec.baseAmount = baseAmount;
                        transRec.basePrice = basePrice;
                        this.transactions[chainName].push(transRec);
                    }
                }
            }
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
    /**
     * Get Defi Taxes Endpoint
     */
    getDefiTaxesEndpoint(endpoint, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('defiTaxes', endpoint, Object.assign({ address: this.address }, args));
        });
    }
    /**
     * Round Number
     */
    roundNumber(val, places = 2) {
        const res = Number(Number(val).toFixed(places));
        return res == 0 ? Math.abs(res) : res;
    }
}
exports.default = MultiChain;
