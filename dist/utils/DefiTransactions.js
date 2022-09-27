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
const DefiBalances_1 = __importDefault(require("./DefiBalances"));
const localData_1 = require("./localData");
const envValues_1 = require("./envValues");
const values_1 = require("./values");
const utils_1 = require("./utils");
/**
 * DefiTransactions Class
 */
class DefiTransactions extends DefiBalances_1.default {
    /**
     * Get Transactions
     */
    getTransactions(showAll = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const historyInfo = [];
            // Get Info from Debank
            for (const index in this.chainNames) {
                const chainName = this.chainNames[index];
                const isIncluded = !envValues_1.ENV_GET_TRANS_FROM_CHAINS.length || envValues_1.ENV_GET_TRANS_FROM_CHAINS.includes(chainName) ? true : false;
                historyInfo.push(isIncluded ? yield utils_1.getHistory(this.address, chainName, !showAll) : { history: [], tokens: {} });
            }
            // Get Existing Token Addresses
            const existingAddresses = yield this.getExistingTokenAddresses();
            // Iterate Chain Results
            for (const index in historyInfo) {
                const chainName = this.chainNames[index];
                const records = historyInfo[index].history;
                const tokens = historyInfo[index].tokens;
                const transactionHashes = [];
                let historyRecords = this.chains[chainName].transactions;
                // Get Token Addresses
                const tokenAddresses = this.getTokenAddresses(records, tokens, existingAddresses[chainName]);
                // Get existing hashes from imported history records
                if (historyRecords.length) {
                    for (const record of historyRecords) {
                        const { id } = record;
                        if (!transactionHashes.includes(id))
                            transactionHashes.push(id);
                    }
                }
                // Iterate Records
                for (const record of records) {
                    // Skip existing hashes
                    if (transactionHashes.length &&
                        transactionHashes.includes(this.getTransactionID(record))) {
                        continue;
                    }
                    // Sterilize Records
                    const { nestedRecord, dustTokens } = this.sterilizeHistoryRecord(record, chainName, tokens, tokenAddresses);
                    const splitRecords = this.splitHistoryRecord(nestedRecord);
                    let dustRecords = [];
                    if (Object.keys(dustTokens).length) {
                        const { nestedRecord: nestedDustRecord } = this.sterilizeHistoryRecord(record, chainName, tokens, tokenAddresses, dustTokens);
                        dustRecords = this.splitHistoryRecord(nestedDustRecord);
                    }
                    historyRecords = [...historyRecords, ...splitRecords, ...dustRecords];
                }
                this.chains[chainName].transactions = historyRecords.sort((a, b) => a.time < b.time ? 1 : -1);
            }
            // Sync Contract Addresses
            yield this.syncContractAddresses();
        });
    }
    /**
     * Get Unknown Tokens
     */
    getUnknownTokens() {
        const initInfo = {
            firstTransIsReceive: false,
            hasSwapOrSend: false,
            price: 0,
        };
        const tokenInfo = {};
        for (const chainNm in this.chains) {
            const chainName = chainNm;
            const chain = this.chains[chainName];
            for (let i = chain.transactions.length - 1; i >= 0; i--) {
                const transaction = chain.transactions[i];
                const { quoteSymbol, quotePriceUSD, baseSymbol, type } = transaction;
                const quoteName = utils_1.sterilizeTokenNameNoStub(quoteSymbol);
                const baseName = utils_1.sterilizeTokenNameNoStub(baseSymbol);
                const quoteIsNative = utils_1.isNativeToken(quoteName);
                const isReceive = type == 'receive';
                const isSwapOrSend = ['swap', 'send'].includes(type);
                if (!quoteIsNative && !tokenInfo[quoteName]) {
                    tokenInfo[quoteName] = Object.assign(Object.assign({}, initInfo), { firstTransIsReceive: isReceive, price: quotePriceUSD });
                }
                if (tokenInfo[quoteName] &&
                    tokenInfo[quoteName].firstTransIsReceive &&
                    isSwapOrSend &&
                    !tokenInfo[quoteName].hasSwapOrSend) {
                    tokenInfo[quoteName].hasSwapOrSend = true;
                }
                else if (tokenInfo[baseName] &&
                    tokenInfo[baseName].firstTransIsReceive &&
                    isSwapOrSend &&
                    !tokenInfo[baseName].hasSwapOrSend) {
                    tokenInfo[baseName].hasSwapOrSend = true;
                }
            }
        }
        for (const tokenName in tokenInfo) {
            const token = tokenInfo[tokenName];
            if (token.firstTransIsReceive && !token.hasSwapOrSend) {
                const isStable = utils_1.isStableCoin(tokenName, token.price || 1);
                if (!isStable)
                    this.unknownTokens.push(tokenName);
            }
        }
    }
    /**
     * Get Existing Token Addresses
     */
    getExistingTokenAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            const chainSymbols = {};
            const localRecords = yield localData_1.selectContracts();
            // Iterate Records
            for (const record of localRecords) {
                const { blockchain, symbol, address } = record;
                const chainName = blockchain;
                if (!chainSymbols[chainName])
                    chainSymbols[chainName] = {};
                utils_1.addContract(chainSymbols[chainName], symbol, address);
            }
            return chainSymbols;
        });
    }
    /**
     * Sync Contract Addresses
     */
    syncContractAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [];
            for (const blockchain of this.chainNames) {
                const addresses = this.chains[blockchain].tokenAddresses;
                for (const symbolWithStub in addresses) {
                    const address = addresses[symbolWithStub];
                    const symbol = utils_1.sterilizeTokenNameNoStub(symbolWithStub).toUpperCase();
                    requests.push(localData_1.insertContract({ blockchain, symbol, address }));
                }
            }
            yield Promise.all(requests);
        });
    }
    /**
     * Sterilize History Record
     */
    sterilizeHistoryRecord(record, chainName, tokenSymbols, tokenAddresses, dustInfo) {
        var _a, _b, _c, _d, _e, _f;
        const debankRec = record;
        const tokens = Object.assign({}, dustInfo);
        const dustTokens = {};
        // Add Token
        const addToken = (info) => {
            var _a, _b;
            const { token, quantity } = info;
            if (quantity != 0 && quantity != ((_a = tokens[token]) === null || _a === void 0 ? void 0 : _a.quantity)) {
                const tokenQuantity = (((_b = tokens[token]) === null || _b === void 0 ? void 0 : _b.quantity) || 0) + quantity;
                tokens[token] = {
                    amount: 0,
                    quantity: tokenQuantity,
                    price: 0,
                };
            }
        };
        // Get Universal Info
        const hash = this.getTransactionID(record);
        const date = new Date(debankRec.time_at * 1000).toISOString();
        const feeSymbol = values_1.NATIVE_TOKENS[chainName];
        const hasError = ((_a = debankRec.tx) === null || _a === void 0 ? void 0 : _a.status) == 0;
        let type = debankRec.cate_id ||
            ((_b = debankRec.tx) === null || _b === void 0 ? void 0 : _b.name) ||
            '';
        let toAddress = (((_c = debankRec.tx) === null || _c === void 0 ? void 0 : _c.to_addr) ||
            this.address).toLowerCase();
        let fromAddress = (((_d = debankRec.tx) === null || _d === void 0 ? void 0 : _d.from_addr) ||
            debankRec.other_addr ||
            this.address).toLowerCase();
        let feeQuantity = ((_e = debankRec.tx) === null || _e === void 0 ? void 0 : _e.eth_gas_fee) || 0;
        let feeValueUSD = ((_f = debankRec.tx) === null || _f === void 0 ? void 0 : _f.usd_gas_fee) || 0;
        let feePriceUSD = 0;
        // Dust Info
        if (dustInfo) {
            if (toAddress != this.address) {
                fromAddress = toAddress;
                toAddress = this.address;
            }
            feeQuantity = feePriceUSD = feeValueUSD = 0;
        }
        // Normal Records
        else {
            feePriceUSD = feeValueUSD / feeQuantity || 0;
            feeValueUSD = feeValueUSD || feeQuantity * feePriceUSD || 0;
            // Get Tokens Info
            for (const record of debankRec.sends) {
                const tokenInfo = this.sterilizeDebankTransfer(record, chainName, true, tokenSymbols, tokenAddresses);
                addToken(tokenInfo);
            }
            for (const record of debankRec.receives) {
                const tokenInfo = this.sterilizeDebankTransfer(record, chainName, false, tokenSymbols, tokenAddresses);
                addToken(tokenInfo);
            }
        }
        // Sterilize Type
        type = this.sterilizeTransactionType(type, hasError, tokens);
        // Merge Wrapped/Unwrapped Token Dust from Swaps
        const tokenNames = Object.keys(tokens);
        if (type == 'swap' && tokenNames.length > 2) {
            for (const wrappedTokenName in tokens) {
                if (wrappedTokenName[0] == 'W') {
                    const unwrappedTokenName = wrappedTokenName.substring(1);
                    if (tokenNames.includes(unwrappedTokenName)) {
                        const { quantity: wrappedQuantity } = tokens[wrappedTokenName];
                        const { quantity: unwrappedQuantity } = tokens[unwrappedTokenName];
                        if (Math.abs(unwrappedQuantity) >= Math.abs(wrappedQuantity)) {
                            dustTokens[wrappedTokenName] = Object.assign({}, tokens[wrappedTokenName]);
                            delete tokens[wrappedTokenName];
                        }
                        else {
                            dustTokens[unwrappedTokenName] = Object.assign({}, tokens[unwrappedTokenName]);
                            delete tokens[unwrappedTokenName];
                        }
                    }
                }
            }
        }
        // Get Direction
        const direction = ['receive', 'swap'].includes(type) ? 'credit' : 'debit';
        // Format Result
        return {
            dustTokens,
            nestedRecord: Object.assign(Object.assign({}, values_1.defaultHistoryRecord), { id: hash, time: date, feeSymbol,
                type,
                direction,
                feeQuantity,
                feeValueUSD,
                feePriceUSD, blockchain: chainName, fromAddress,
                toAddress,
                tokens }),
        };
    }
    /**
     * Split History Record
     */
    splitHistoryRecord(record) {
        const splitRecords = [];
        // Get Quantity
        const getQuantity = (oldQuantity, numRecords) => oldQuantity / numRecords;
        // Get Fees
        const getFees = (feeQuantity, feePrice) => feeQuantity * feePrice;
        // Get Ticker
        const getTicker = (quote, base) => {
            const hasDashes = quote.includes('-') || base.includes('-');
            return hasDashes ? `${quote}/${base}` : `${quote}-${base}`;
        };
        if (record.tokens) {
            // Swaps
            if (record.type == 'swap') {
                const debitTokens = [];
                const creditTokens = [];
                let iterTokens = creditTokens;
                let compareToken = '';
                let compareIsBase = true;
                // Get Debit & Credit Tokens
                for (const tokenName in record.tokens) {
                    const token = record.tokens[tokenName];
                    const isDebit = token.quantity < 0;
                    if (isDebit)
                        debitTokens.push(tokenName);
                    else
                        creditTokens.push(tokenName);
                }
                // Multiple Buy Tokens or 1-1 Swap
                if (creditTokens.length >= debitTokens.length) {
                    compareToken = debitTokens[0];
                }
                // Multiple Sell Tokens
                else if (debitTokens.length > creditTokens.length) {
                    compareToken = creditTokens[0];
                    iterTokens = debitTokens;
                    compareIsBase = false;
                }
                // Iterate Tokens
                for (const tokenName of iterTokens) {
                    const quote = compareIsBase ? tokenName : compareToken;
                    const base = compareIsBase ? compareToken : tokenName;
                    const quoteQuantity = compareIsBase
                        ? record.tokens[quote].quantity
                        : getQuantity(record.tokens[quote].quantity, iterTokens.length);
                    const baseQuantity = compareIsBase
                        ? getQuantity(record.tokens[base].quantity, iterTokens.length)
                        : record.tokens[base].quantity;
                    const feeQuantity = getQuantity(record.feeQuantity, iterTokens.length);
                    const feeValueUSD = getFees(feeQuantity, record.feePriceUSD);
                    const ticker = getTicker(quote, base);
                    const splitRecord = Object.assign(Object.assign({}, record), { ticker, quoteSymbol: quote, baseSymbol: base, quoteQuantity,
                        baseQuantity, basePriceUSD: base == values_1.FIAT_CURRENCY ? 1 : 0, feeValueUSD,
                        feeQuantity });
                    delete splitRecord.tokens;
                    splitRecords.push(splitRecord);
                }
            }
            // Sends/Receives
            else if (['send', 'receive'].includes(record.type)) {
                const numTokens = Object.keys(record.tokens).length;
                for (const tokenName in record.tokens) {
                    const curToken = record.tokens[tokenName];
                    const quote = tokenName;
                    const base = record.baseSymbol;
                    const quoteQuantity = curToken.quantity;
                    const feeQuantity = getQuantity(record.feeQuantity, numTokens);
                    const feeValueUSD = getFees(feeQuantity, record.feePriceUSD);
                    const ticker = getTicker(quote, base);
                    const splitRecord = Object.assign(Object.assign({}, record), { ticker, quoteSymbol: quote, quoteQuantity,
                        feeQuantity,
                        feeValueUSD });
                    delete splitRecord.tokens;
                    splitRecords.push(splitRecord);
                }
            }
            // Failures & Approvals
            else {
                const splitRecord = record;
                delete splitRecord.tokens;
                splitRecords.push(splitRecord);
            }
        }
        return splitRecords;
    }
    /**
     * Get Token Addresses
     */
    getTokenAddresses(records, tokenSymbols, existingAddresses = {}) {
        var _a, _b, _c, _d;
        const symbols = Object.assign({}, existingAddresses);
        const addNewContract = utils_1.addContract.bind(null, symbols);
        // Iterate Records
        for (const record of records) {
            const debankRec = record;
            if ((_a = debankRec === null || debankRec === void 0 ? void 0 : debankRec.sends) === null || _a === void 0 ? void 0 : _a.length) {
                for (const transfer of debankRec.sends) {
                    const address = transfer.token_id || '';
                    const symbol = ((_b = tokenSymbols[address]) === null || _b === void 0 ? void 0 : _b.symbol) || '';
                    addNewContract(symbol, address);
                }
            }
            if ((_c = debankRec === null || debankRec === void 0 ? void 0 : debankRec.receives) === null || _c === void 0 ? void 0 : _c.length) {
                for (const transfer of debankRec.sends) {
                    const address = transfer.token_id || '';
                    const symbol = ((_d = tokenSymbols[address]) === null || _d === void 0 ? void 0 : _d.symbol) || '';
                    addNewContract(symbol, address);
                }
            }
        }
        return symbols;
    }
    /**
     * Get Token Name
     */
    getTokenName(symbol, address, chainName, tokenAddresses) {
        let newSymbol = utils_1.symbolWithDashes(symbol);
        const upperSymbol = newSymbol.toUpperCase();
        const upperChain = chainName.toUpperCase();
        const lowerAddress = (address || '').toLowerCase();
        // Capitalize Native Tokens
        const isNative = utils_1.isNativeToken(upperSymbol);
        if (isNative)
            newSymbol = upperSymbol;
        // Rename Duplicate Symbols
        if (tokenAddresses[upperSymbol] && tokenAddresses[upperSymbol].length > 1) {
            const addressStub = utils_1.getAddressStub(lowerAddress);
            newSymbol = `${newSymbol}-${upperChain}-0x${addressStub}`;
        }
        // Add New Token Addresses
        if (this.chains[chainName].tokenAddresses[newSymbol] == null) {
            this.chains[chainName].tokenAddresses[newSymbol] = utils_1.isContract(lowerAddress)
                ? lowerAddress
                : '';
        }
        return newSymbol || lowerAddress;
    }
    /**
     * Sterilize Debank Transfer
     */
    sterilizeDebankTransfer(record, chainName, isSend = true, tokenSymbols, tokenAddresses) {
        var _a;
        const { amount, token_id: tokenId } = record;
        const symbol = ((_a = tokenSymbols[tokenId]) === null || _a === void 0 ? void 0 : _a.symbol)
            ? tokenSymbols[tokenId].symbol
            : tokenId.substring(0, 6);
        const token = this.getTokenName(symbol, tokenId, chainName, tokenAddresses);
        const quantity = isSend ? amount * -1 : amount;
        return {
            token,
            quantity,
        };
    }
    /**
     * Sterilize Transaction Type
     */
    sterilizeTransactionType(type, hasError, tokens) {
        let newType = type;
        const tokenKeys = Object.keys(tokens);
        const numTokens = tokenKeys.length;
        // Check for Debits & Credits
        let hasDebit = false;
        let hasCredit = false;
        for (const tokenKey in tokens) {
            const token = tokens[tokenKey];
            if (token.quantity > 0)
                hasCredit = true;
            else if (token.quantity < 0)
                hasDebit = true;
            if (hasDebit && hasCredit)
                break;
        }
        // Receive
        if (numTokens >= 1 && hasCredit && !hasDebit) {
            newType = 'receive';
        }
        // Send
        else if (numTokens >= 1 && hasDebit && !hasCredit) {
            newType = 'send';
        }
        // Swap
        else if (numTokens > 1 && hasDebit && hasCredit) {
            newType = 'swap';
        }
        // Failure
        else if (!numTokens) {
            if (hasError)
                newType = 'failure';
            else
                newType = 'approve';
        }
        return newType;
    }
    /**
     * Get Transaction ID
     */
    getTransactionID(record) {
        return (record.id ||
            '').toLowerCase();
    }
}
exports.default = DefiTransactions;
