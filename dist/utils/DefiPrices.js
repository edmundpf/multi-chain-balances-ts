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
const DefiTransactions_1 = __importDefault(require("./DefiTransactions"));
const misc_1 = require("./misc");
const priceData_1 = require("./priceData");
const values_1 = require("./values");
/**
 * DefiPrices Class
 */
class DefiPrices extends DefiTransactions_1.default {
    constructor() {
        // Properties
        super(...arguments);
        this.nextApiCallMs = 0;
        this.recentApiCalls = [];
        this.filterUnknownTokens = false;
    }
    /**
     * Driver
     */
    driver(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { useDebank, getTransactions, getPrices, getBalances, filterUnknownTokens, priorTransactions, } = Object.assign(Object.assign({}, values_1.defaultDriverArgs), args);
            this.filterUnknownTokens = filterUnknownTokens ? true : false;
            if (priorTransactions === null || priorTransactions === void 0 ? void 0 : priorTransactions.length) {
                this.importPriorTransactions(priorTransactions);
            }
            // Get Transactions
            if (getTransactions || getPrices) {
                yield this.getTransactions(useDebank);
                if (this.filterUnknownTokens && !getPrices)
                    this.getUnknownTokens();
            }
            // Get Prices and Balances
            if (getPrices)
                yield this.getPriceData();
            if (getBalances)
                yield this.getBalances();
        });
    }
    /**
     * Get Price Data
     */
    getPriceData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield priceData_1.prepareDB();
            // Get Transaction Times for Supported Tokens
            const supportedTokens = yield this.getSupportedTokens();
            const supportedTokenNames = Object.keys(supportedTokens);
            const transTokenTimes = this.getTokenTransactionTimes(supportedTokenNames);
            const transTokenNames = Object.keys(transTokenTimes);
            // Find Times w/ Missing Prices
            const localPrices = yield this.getLocalPrices(transTokenNames);
            const { transPrices, missingTimes } = this.linkLocalPrices(transTokenTimes, localPrices);
            // Get Missing Prices from Coin Gecko API
            const daysOutLists = this.getAllDaysOutLists(missingTimes);
            const apiPrices = yield this.getAllTokenPrices(daysOutLists, supportedTokens);
            const insertRecords = this.getInsertRecords(localPrices, apiPrices);
            // Update Transactions w/ Prices
            const mergedPrices = this.mergeApiAndLocalPrices(localPrices, apiPrices);
            this.linkMergedPrices(transPrices, mergedPrices);
            this.updateTransactionData(transPrices);
            // Infer Missing Transaction Prices
            this.inferTransactionPrices();
            // Add Missing Prices to DB
            yield this.syncMissingPrices(insertRecords);
        });
    }
    /**
     * Import Prior Transactions
     */
    importPriorTransactions(records) {
        for (const record of records) {
            const chainName = record.chain;
            this.chains[chainName].transactions.push(record);
        }
    }
    /**
     * Get Supported Tokens
     */
    getSupportedTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedTokens = {};
            const tokenInfo = {};
            const res = yield this.getCoinGeckoEndpoint('coinGeckoList', undefined, { include_platform: true });
            if (res === null || res === void 0 ? void 0 : res.length) {
                // Iterate ID's
                for (const record of res) {
                    const { id, symbol, platforms } = record;
                    if (id && !tokenInfo[id]) {
                        const tokenName = this.sterilizeTokenName(symbol);
                        tokenInfo[id] = {
                            name: tokenName,
                            addresses: []
                        };
                    }
                    // Iterate Platforms
                    for (const key in platforms) {
                        const address = platforms[key];
                        if (platforms[key]) {
                            tokenInfo[id].addresses.push(address);
                        }
                    }
                }
                // Add Tokens w/ Known Addresses
                for (const id in tokenInfo) {
                    const { name, addresses } = tokenInfo[id];
                    let hasMatchingAddress = false;
                    // Iterate Chains
                    for (const chainName of this.chainNames) {
                        const knownAddresses = this.chains[chainName].tokenAddresses;
                        // Iterate Known Addresses
                        for (const knownKey in knownAddresses) {
                            const knownAddress = knownAddresses[knownKey];
                            if (addresses.includes(knownAddress)) {
                                if (name && !supportedTokens[name]) {
                                    supportedTokens[name] = id;
                                    hasMatchingAddress = true;
                                    break;
                                }
                            }
                        }
                        if (hasMatchingAddress)
                            break;
                    }
                }
            }
            // Add Tokens w/ Unknown Addresses
            for (const id in tokenInfo) {
                const { name } = tokenInfo[id];
                if (name && !supportedTokens[name]) {
                    supportedTokens[name] = id;
                }
            }
            return supportedTokens;
        });
    }
    /**
     * Get Token Transaction Times
     */
    getTokenTransactionTimes(supportedTokenNames) {
        const tokenTimes = {};
        // Iterate Chains
        for (const chainNm in this.chains) {
            const chainName = chainNm;
            const chain = this.chains[chainName];
            // Iterate Transactions
            for (const transaction of chain.transactions) {
                const { quoteSymbol, baseSymbol, feeSymbol, feePriceUSD, date } = transaction;
                const time = this.getTimeMs(date);
                const hasFeePrice = feePriceUSD ? true : false;
                const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol);
                const baseName = this.sterilizeTokenNameNoStub(baseSymbol);
                const quoteIsLP = quoteName.endsWith('LP');
                const baseIsLP = baseName.endsWith('LP');
                const quoteSupported = supportedTokenNames.includes(quoteName) && !quoteIsLP;
                const baseSupported = supportedTokenNames.includes(baseName) && !baseIsLP;
                const quoteHasNativePrice = quoteSymbol == feeSymbol && hasFeePrice;
                const baseHasNativePrice = baseSymbol == feeSymbol && hasFeePrice;
                const baseIsFiat = baseSymbol == values_1.FIAT_CURRENCY;
                // Add Quote Time
                if (quoteSupported && !quoteHasNativePrice) {
                    this.addTokenTime(tokenTimes, quoteName, time);
                }
                // Add Base Time
                if (baseSupported && !baseIsFiat && !baseHasNativePrice) {
                    this.addTokenTime(tokenTimes, baseName, time);
                }
            }
        }
        for (const key in tokenTimes) {
            tokenTimes[key].sort((a, b) => b - a);
        }
        return tokenTimes;
    }
    /**
     * Get Local Prices
     */
    getLocalPrices(tokenNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const localPrices = {};
            const requests = [];
            for (const tokenName of tokenNames) {
                requests.push(priceData_1.selectPrices(tokenName));
            }
            const res = yield Promise.all(requests);
            for (const index in res) {
                const tokenName = tokenNames[index];
                localPrices[tokenName] = res[index];
            }
            return localPrices;
        });
    }
    /**
     * Link Local Prices
     */
    linkLocalPrices(transTokenTimes, localPrices) {
        const transPrices = {};
        const missingTimes = {};
        // Iterate Tokens
        for (const tokenName in transTokenTimes) {
            const transTimes = transTokenTimes[tokenName];
            const localTimes = localPrices[tokenName];
            transPrices[tokenName] = [];
            // Iterate Transaction Times
            for (const transTime of transTimes) {
                const validLocalRecord = this.getValidPriceRecord(transTime, localTimes);
                transPrices[tokenName].push({
                    time: transTime,
                    price: (validLocalRecord === null || validLocalRecord === void 0 ? void 0 : validLocalRecord.price) || 0,
                });
                if (!validLocalRecord) {
                    this.addTokenTime(missingTimes, tokenName, transTime);
                }
            }
        }
        return {
            missingTimes,
            transPrices,
        };
    }
    /**
     * Get All Days Out Lists
     */
    getAllDaysOutLists(missingTimes) {
        const daysOutLists = {};
        for (const tokenName in missingTimes) {
            const tokenTimes = missingTimes[tokenName];
            daysOutLists[tokenName] = this.getDaysOutList(tokenTimes);
        }
        return daysOutLists;
    }
    /**
     * Get All Token Prices
     */
    getAllTokenPrices(daysOutLists, supportedTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPrices = {};
            const requests = [];
            const tokenNames = Object.keys(daysOutLists);
            for (const tokenName in daysOutLists) {
                const daysOutList = daysOutLists[tokenName];
                requests.push(daysOutList.length
                    ? this.getTokenPrices(supportedTokens[tokenName], daysOutList)
                    : []);
            }
            const res = yield Promise.all(requests);
            for (const index in res) {
                const prices = res[index];
                const tokenName = tokenNames[index];
                if (prices.length) {
                    tokenPrices[tokenName] = prices;
                }
            }
            return tokenPrices;
        });
    }
    /**
     * Merge API and Local Prices
     */
    mergeApiAndLocalPrices(localPrices, apiPrices) {
        const mergedPrices = Object.assign({}, localPrices);
        for (const tokenName in localPrices) {
            mergedPrices[tokenName] = [
                ...mergedPrices[tokenName],
                ...(apiPrices[tokenName] || []),
            ].sort((a, b) => (a.time < b.time ? 1 : -1));
        }
        return mergedPrices;
    }
    /**
     * Link Merged Prices
     */
    linkMergedPrices(transPrices, mergedPrices) {
        // Iterate Tokens
        for (const tokenName in transPrices) {
            const transTimes = transPrices[tokenName];
            const mergedTimes = mergedPrices[tokenName];
            // Iterate Transaction Records
            for (const index in transTimes) {
                const record = transTimes[index];
                if (!record.price) {
                    const validLocalRecord = this.getValidPriceRecord(record.time, mergedTimes);
                    if (validLocalRecord) {
                        transTimes[index] = {
                            time: record.time,
                            price: validLocalRecord.price,
                        };
                    }
                }
            }
        }
    }
    /**
     * Get Insert Records
     */
    getInsertRecords(localPrices, apiPrices) {
        const insertRecords = [];
        // Iterate Tokens
        for (const tokenName in apiPrices) {
            const existingTimes = [];
            // Get Local Times
            if (localPrices[tokenName]) {
                for (const record of localPrices[tokenName]) {
                    existingTimes.push(record.time);
                }
            }
            // Iterate API Prices
            for (const record of apiPrices[tokenName]) {
                const { time, price } = record;
                if (!existingTimes.includes(record.time)) {
                    insertRecords.push({
                        symbol: tokenName,
                        time,
                        price,
                    });
                }
            }
        }
        return insertRecords;
    }
    /**
     * Sync Missing Prices
     */
    syncMissingPrices(insertRecords) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [];
            for (const record of insertRecords) {
                requests.push(priceData_1.insertPrice(record));
            }
            yield Promise.all(requests);
        });
    }
    /**
     * Update Transaction Data
     */
    updateTransactionData(transPrices) {
        // Get Matching Price
        const getMatchingPrice = (prices, time) => {
            for (const price of prices) {
                if (price.time == time) {
                    return price;
                }
            }
            return false;
        };
        // Get Price And Value
        const getPriceAndValue = (priceInfo, quantity) => {
            const price = priceInfo.price;
            const value = price * quantity;
            return { price, value };
        };
        // Set Price And Value
        const setPriceAndValue = (transaction, info, type) => {
            const { price, value } = info;
            if (type == 'quote') {
                transaction.quotePriceUSD = price;
                transaction.quoteValueUSD = value;
                if (transaction.baseSymbol == values_1.FIAT_CURRENCY) {
                    transaction.baseValueUSD = transaction.quoteValueUSD * -1;
                    transaction.baseQuantity = transaction.baseValueUSD;
                }
            }
            else if (type == 'base') {
                transaction.basePriceUSD = price;
                transaction.baseValueUSD = value;
            }
        };
        // Iterate Prices
        for (const tokenName in transPrices) {
            // Iterate Chains
            for (const chainNm in this.chains) {
                const chainName = chainNm;
                const chain = this.chains[chainName];
                // Iterate Transactions
                for (const transaction of chain.transactions) {
                    const { quoteSymbol, baseSymbol, feeSymbol, feePriceUSD, quoteQuantity, baseQuantity, date, } = transaction;
                    const time = this.getTimeMs(date);
                    const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol);
                    const baseName = this.sterilizeTokenNameNoStub(baseSymbol);
                    const quoteTokenMatch = tokenName == quoteName;
                    const baseTokenMatch = tokenName == baseName;
                    const quoteFeeMatch = quoteSymbol == feeSymbol && feePriceUSD;
                    const baseFeeMatch = baseSymbol == feeSymbol && feePriceUSD;
                    // Quote Token
                    if (!quoteFeeMatch && quoteTokenMatch) {
                        const priceMatch = getMatchingPrice(transPrices[tokenName], time);
                        if (priceMatch && priceMatch.price) {
                            const info = getPriceAndValue(priceMatch, quoteQuantity);
                            setPriceAndValue(transaction, info, 'quote');
                        }
                    }
                    // Quote Token is Fee Token
                    else if (quoteFeeMatch) {
                        const info = getPriceAndValue({ price: feePriceUSD }, quoteQuantity);
                        setPriceAndValue(transaction, info, 'quote');
                    }
                    // Base Token
                    if (!baseFeeMatch && baseTokenMatch) {
                        const priceMatch = getMatchingPrice(transPrices[tokenName], time);
                        if (priceMatch && priceMatch.price) {
                            const info = getPriceAndValue(priceMatch, baseQuantity);
                            setPriceAndValue(transaction, info, 'base');
                        }
                    }
                    // Base Token is Fee Token
                    else if (baseFeeMatch) {
                        const info = getPriceAndValue({ price: feePriceUSD }, baseQuantity);
                        setPriceAndValue(transaction, info, 'base');
                    }
                }
            }
        }
        if (this.filterUnknownTokens) {
            this.getUnknownTokens();
            this.removeGarbagePriceInfo();
        }
    }
    /**
     * Remove Garbage Price Info
     */
    removeGarbagePriceInfo() {
        if (!this.unknownTokens.length)
            return false;
        let maxWhitelistValue = 0;
        for (const chainName of this.chainNames) {
            const transactions = this.chains[chainName].transactions;
            // Get Max Whitelist Value
            for (const transaction of transactions) {
                const { type, quoteSymbol, quoteValueUSD, quotePriceUSD } = transaction;
                if (!quotePriceUSD)
                    continue;
                if (['send', 'receive'].includes(type)) {
                    const isNativeToken = this.isNativeToken(quoteSymbol);
                    const isStableCoin = this.isStableCoin(quoteSymbol, quotePriceUSD);
                    if (isNativeToken || isStableCoin) {
                        if (quoteValueUSD > maxWhitelistValue) {
                            maxWhitelistValue = quoteValueUSD;
                        }
                    }
                }
            }
            // Remove Garbage Prices
            for (const transaction of transactions) {
                const { quoteSymbol, quoteValueUSD, baseSymbol, baseValueUSD } = transaction;
                const quoteIsUnknown = this.isUnknownToken(quoteSymbol);
                const baseIsUnknown = this.isUnknownToken(baseSymbol);
                if (quoteIsUnknown && quoteValueUSD > maxWhitelistValue) {
                    transaction.quoteValueUSD = transaction.quotePriceUSD = 0;
                    if (transaction.baseSymbol == values_1.FIAT_CURRENCY) {
                        transaction.baseValueUSD = transaction.baseQuantity = 0;
                    }
                }
                if (baseIsUnknown && baseValueUSD > maxWhitelistValue) {
                    transaction.baseValueUSD = transaction.basePriceUSD = 0;
                }
            }
        }
    }
    /**
     * Infer Transaction Prices
     */
    inferTransactionPrices() {
        // Iterate Chains
        for (const chainName of this.chainNames) {
            const transactionsByHash = {};
            const transactions = this.chains[chainName].transactions;
            // Get Transactions by Hash
            for (const record of transactions) {
                const { id, type, quoteSymbol, baseSymbol } = record;
                if (type == 'swap') {
                    if (!transactionsByHash[id]) {
                        transactionsByHash[id] = {
                            transactions: [],
                            quoteSymbols: [],
                            baseSymbols: [],
                        };
                    }
                    transactionsByHash[id].transactions.push(record);
                    // Get Quote Symbols
                    if (!transactionsByHash[id].quoteSymbols.includes(quoteSymbol)) {
                        transactionsByHash[id].quoteSymbols.push(quoteSymbol);
                    }
                    // Get Base Symbols
                    if (!transactionsByHash[id].baseSymbols.includes(baseSymbol)) {
                        transactionsByHash[id].baseSymbols.push(baseSymbol);
                    }
                }
            }
            // Iterate by Transaction Hash
            for (const id in transactionsByHash) {
                const { transactions, quoteSymbols, baseSymbols } = transactionsByHash[id];
                const transactionCount = transactions.length;
                // Single Coin Swap
                if (quoteSymbols.length == baseSymbols.length) {
                    this.inferSingleSwap(transactions[0]);
                }
                // Multi Coin Swap
                else if (quoteSymbols.length != baseSymbols.length) {
                    const singleIsBase = quoteSymbols.length > baseSymbols.length;
                    const missingIndexes = [];
                    const eligibleIndexes = [];
                    const ineligibleIndexes = [];
                    let eligibleTotal = 0;
                    let ineligibleTotal = 0;
                    let absSingleValueUSD = 0;
                    // Set Multi Info
                    const setMultiInfo = (record, index, type) => {
                        const { quoteSymbol, baseSymbol, quotePriceUSD, basePriceUSD, quoteValueUSD, baseValueUSD, } = record;
                        const symbol = type == 'quote' ? quoteSymbol : baseSymbol;
                        const price = type == 'quote' ? quotePriceUSD : basePriceUSD;
                        const value = type == 'quote' ? quoteValueUSD : baseValueUSD;
                        // Set Missing Indexes
                        if (!price) {
                            missingIndexes.push(index);
                        }
                        // Get Total Single Token Value
                        else {
                            const isStableCoin = this.isStableCoin(symbol, price);
                            const absRecordValueUSD = Math.abs(value);
                            // Set Eligible Indexes
                            if (!isStableCoin) {
                                eligibleIndexes.push(index);
                                eligibleTotal += absRecordValueUSD;
                            }
                            // Set Ineligible Indexes
                            else {
                                ineligibleIndexes.push(index);
                                ineligibleTotal += absRecordValueUSD;
                            }
                        }
                    };
                    // Get Missing Indexes and Eligible Indexes
                    for (const i in transactions) {
                        const index = Number(i);
                        const record = transactions[index];
                        // Add Single Token Value
                        const { quoteValueUSD, baseValueUSD } = record;
                        const absSingleRecordValueUSD = Math.abs(singleIsBase ? baseValueUSD : quoteValueUSD);
                        absSingleValueUSD += absSingleRecordValueUSD;
                        // Single Base Token Info
                        if (singleIsBase) {
                            setMultiInfo(record, index, 'quote');
                        }
                        // Single Quote Token Info
                        else {
                            setMultiInfo(record, index, 'base');
                        }
                    }
                    // Set Counts
                    const missingCount = missingIndexes.length;
                    const completeCount = transactionCount - missingCount;
                    const ineligibleCount = ineligibleIndexes.length;
                    // Single Token has Price
                    if (absSingleValueUSD) {
                        // Has Missing Tokens
                        if (missingCount) {
                            // Get Total Multi Value & Get Average w/ Slippage
                            const absMultiValueUSD = singleIsBase
                                ? absSingleValueUSD * (1 - values_1.slippageConfig.low)
                                : absSingleValueUSD * (1 + values_1.slippageConfig.low);
                            const avgValueUSD = (absMultiValueUSD - ineligibleTotal) /
                                (transactionCount - ineligibleCount);
                            // Iterate Missing/Eligible Records
                            for (const index of [...missingIndexes, eligibleIndexes]) {
                                const transaction = transactions[Number(index)];
                                // Modify Quote Tokens
                                if (singleIsBase) {
                                    this.setValueAndPrice(transaction, avgValueUSD, 'quote');
                                }
                                // Modify Base Tokens
                                else {
                                    this.setValueAndPrice(transaction, avgValueUSD, 'base');
                                }
                            }
                        }
                        // No Missing Tokens
                        else {
                            const absMultiValueUSD = eligibleTotal + ineligibleTotal;
                            this.inferMultiSwap({
                                absSingleValueUSD,
                                absMultiValueUSD,
                                singleIsBase,
                                transactionCount,
                                ineligibleCount,
                                ineligibleTotal,
                                ineligibleIndexes,
                                transactions,
                            });
                        }
                    }
                    // Infer Single Token from Multi Prices
                    else if (missingCount < transactionCount) {
                        const avgMultiValueUSD = (eligibleTotal + ineligibleTotal) / completeCount;
                        const absMultiValueUSD = avgMultiValueUSD * transactionCount;
                        absSingleValueUSD = singleIsBase
                            ? absMultiValueUSD * (1 - values_1.slippageConfig.low)
                            : absMultiValueUSD * (1 + values_1.slippageConfig.low);
                        this.inferMultiSwap({
                            absSingleValueUSD,
                            absMultiValueUSD,
                            singleIsBase,
                            transactionCount,
                            ineligibleCount,
                            ineligibleTotal,
                            ineligibleIndexes,
                            transactions,
                        });
                    }
                }
            }
        }
    }
    /**
     * Infer Single Swap
     */
    inferSingleSwap(record) {
        // Sterilize Swap
        const { quoteSymbol, quoteValueUSD, quotePriceUSD, baseSymbol, baseValueUSD, basePriceUSD, } = record;
        const quoteIsStable = this.isStableCoin(quoteSymbol, quotePriceUSD);
        const baseIsStable = this.isStableCoin(baseSymbol, basePriceUSD);
        let absQuoteValueUSD = Math.abs(quoteValueUSD);
        let absBaseValueUSD = Math.abs(baseValueUSD);
        // Missing Quote
        if (absBaseValueUSD && !absQuoteValueUSD) {
            absQuoteValueUSD = absBaseValueUSD * (1 - values_1.slippageConfig.low);
            this.setValueAndPrice(record, absQuoteValueUSD, 'quote');
        }
        // Missing Base
        else if (absQuoteValueUSD && !absBaseValueUSD) {
            absBaseValueUSD = absQuoteValueUSD * (1 + values_1.slippageConfig.low);
            this.setValueAndPrice(record, absBaseValueUSD, 'base');
        }
        // Has Both Prices
        else if (absQuoteValueUSD &&
            absBaseValueUSD &&
            !(quoteIsStable && baseIsStable)) {
            // Calculate Values w/ Slippage
            const { upperUSD, lowerUSD, lowerQuote } = this.calculateTotalsWithSlippage(absQuoteValueUSD, absBaseValueUSD, quoteIsStable, baseIsStable);
            // Adjust Values w/ Slippage
            if (upperUSD && lowerUSD) {
                // Quote is lower
                if (lowerQuote) {
                    this.setValueAndPrice(record, lowerUSD, 'quote');
                    this.setValueAndPrice(record, upperUSD, 'base');
                }
                // Base is lower
                else {
                    this.setValueAndPrice(record, upperUSD, 'quote');
                    this.setValueAndPrice(record, lowerUSD, 'base');
                }
            }
        }
    }
    /**
     * Infer Multi Swap
     */
    inferMultiSwap(args) {
        const { absSingleValueUSD, absMultiValueUSD, singleIsBase, transactionCount, ineligibleCount, ineligibleTotal, ineligibleIndexes, transactions, } = args;
        // Get Quote and Base Value, Check if Stablecoin
        let absQuoteValueUSD = singleIsBase ? absMultiValueUSD : absSingleValueUSD;
        let absBaseValueUSD = singleIsBase ? absSingleValueUSD : absMultiValueUSD;
        let baseIsStable = singleIsBase
            ? this.isStableCoin(transactions[0].baseSymbol, transactions[0].basePriceUSD)
            : true;
        let quoteIsStable = singleIsBase
            ? true
            : this.isStableCoin(transactions[0].quoteSymbol, transactions[0].quotePriceUSD);
        // Iterate Transactions to check for Stablecoins
        for (const record of transactions) {
            const { quoteSymbol, baseSymbol, quotePriceUSD, basePriceUSD } = record;
            const isStableCoin = singleIsBase
                ? this.isStableCoin(quoteSymbol, quotePriceUSD)
                : this.isStableCoin(baseSymbol, basePriceUSD);
            if (!isStableCoin) {
                if (singleIsBase)
                    quoteIsStable = false;
                else
                    baseIsStable = false;
                break;
            }
        }
        // Calculate Totals w/ Slippage
        const { upperUSD, lowerUSD, lowerQuote } = this.calculateTotalsWithSlippage(absQuoteValueUSD, absBaseValueUSD, quoteIsStable, baseIsStable);
        // Get Quote and Base Values
        absQuoteValueUSD = (lowerQuote ? lowerUSD : upperUSD) || absQuoteValueUSD;
        absBaseValueUSD = (lowerQuote ? upperUSD : lowerUSD) || absBaseValueUSD;
        const avgQuoteValueUSD = singleIsBase
            ? (absQuoteValueUSD - ineligibleTotal) /
                (transactionCount - ineligibleCount)
            : absQuoteValueUSD / transactionCount;
        const avgBaseValueUSD = singleIsBase
            ? absBaseValueUSD / transactionCount
            : (absBaseValueUSD - ineligibleTotal) /
                (transactionCount - ineligibleCount);
        // Set Value and Price for Transactions
        for (const i in transactions) {
            const index = Number(i);
            const record = transactions[index];
            const isEligible = !ineligibleIndexes.includes(index);
            // Base is Single Token
            if (singleIsBase) {
                this.setValueAndPrice(record, avgBaseValueUSD, 'base');
                if (isEligible) {
                    this.setValueAndPrice(record, avgQuoteValueUSD, 'quote');
                }
            }
            // Quote is Single Token
            else {
                this.setValueAndPrice(record, avgQuoteValueUSD, 'quote');
                if (isEligible) {
                    this.setValueAndPrice(record, avgBaseValueUSD, 'base');
                }
            }
        }
    }
    /**
     * Set Value And Price
     */
    setValueAndPrice(record, value, type) {
        // Quote
        if (type == 'quote') {
            const priceUSD = Math.abs(value / record.quoteQuantity);
            record.quoteValueUSD = record.quoteQuantity >= 0 ? value : value * -1;
            record.quotePriceUSD = priceUSD;
            if (record.quoteSymbol == record.feeSymbol) {
                record.feePriceUSD = record.quotePriceUSD;
                record.feeValueUSD = record.feeQuantity * record.feePriceUSD;
            }
        }
        // Base
        else {
            const priceUSD = Math.abs(value / record.baseQuantity);
            record.baseValueUSD = record.baseQuantity >= 0 ? value : value * -1;
            record.basePriceUSD = priceUSD;
            if (record.baseSymbol == record.feeSymbol) {
                record.feePriceUSD = record.basePriceUSD;
                record.feeValueUSD = record.feeQuantity * record.feePriceUSD;
            }
        }
    }
    /**
     * Calculate Totals w/ Slippage
     */
    calculateTotalsWithSlippage(absQuoteValueUSD, absBaseValueUSD, quoteIsStable, baseIsStable) {
        const lowerQuote = absQuoteValueUSD <= absBaseValueUSD;
        const min = lowerQuote ? absQuoteValueUSD : absBaseValueUSD;
        const max = lowerQuote ? absBaseValueUSD : absQuoteValueUSD;
        const diff = Math.abs(absBaseValueUSD - absQuoteValueUSD);
        const mid = min + diff / 2;
        const slippageAmount = diff / absBaseValueUSD;
        const hasMediumSlippage = slippageAmount > values_1.slippageConfig.low &&
            slippageAmount <= values_1.slippageConfig.high;
        const hasHighSlippage = slippageAmount > values_1.slippageConfig.high;
        let upperUSD = 0;
        let lowerUSD = 0;
        // Modify Slippage if not within low range and not stablecoins
        if (hasMediumSlippage || hasHighSlippage) {
            const slippageAdjust = hasMediumSlippage
                ? values_1.slippageConfig.low
                : values_1.slippageConfig.high;
            if (!quoteIsStable && !baseIsStable) {
                const upperMultiplier = 1 + slippageAdjust / 2;
                const lowerMultiplier = 1 - slippageAdjust / 2;
                upperUSD = mid * upperMultiplier;
                lowerUSD = mid * lowerMultiplier;
            }
            else if ((quoteIsStable && lowerQuote) ||
                (baseIsStable && !lowerQuote)) {
                const upperMultiplier = 1 + slippageAdjust;
                upperUSD = min * upperMultiplier;
                lowerUSD = min;
            }
            else if ((quoteIsStable && !lowerQuote) ||
                (baseIsStable && lowerQuote)) {
                const lowerMultiplier = 1 - slippageAdjust;
                upperUSD = max;
                lowerUSD = max * lowerMultiplier;
            }
        }
        return {
            upperUSD,
            lowerUSD,
            lowerQuote,
        };
    }
    /**
     * Get Valid Price Record
     */
    getValidPriceRecord(transTime, priceTimes) {
        const validRecords = {
            equal: undefined,
            future: undefined,
            past: undefined,
        };
        // Iterate Prices
        for (const info of priceTimes) {
            const curTime = info.time;
            if (transTime == curTime) {
                validRecords.equal = info;
                break;
            }
            else if (this.isValidFutureTime(transTime, curTime)) {
                validRecords.future = info;
            }
            else if (this.isValidPastTime(transTime, curTime)) {
                validRecords.past = info;
            }
            if (validRecords.future && validRecords.past) {
                break;
            }
        }
        const futureDiff = validRecords.future
            ? validRecords.future.time - transTime
            : 0;
        const pastDiff = validRecords.past ? transTime - validRecords.past.time : 0;
        const closestValidRecord = pastDiff && futureDiff
            ? pastDiff > futureDiff
                ? validRecords.future
                : validRecords.past
            : undefined;
        return validRecords.equal || closestValidRecord;
    }
    /**
     * Get Token Prices
     */
    getTokenPrices(tokenId, daysOutList) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const times = [];
            const prices = [];
            const requests = [];
            const fiatLower = values_1.FIAT_CURRENCY.toLowerCase();
            for (const daysOut of daysOutList) {
                requests.push(this.getCoinGeckoEndpoint('coinGeckoPrices', { $id: tokenId }, { vs_currency: fiatLower, days: daysOut }));
            }
            const res = yield Promise.all(requests);
            for (const result of res) {
                if ((_a = result === null || result === void 0 ? void 0 : result.prices) === null || _a === void 0 ? void 0 : _a.length) {
                    const records = result.prices;
                    for (const record of records) {
                        const [time, price] = record;
                        if (!times.includes(time)) {
                            times.push(time);
                            prices.push({ time, price });
                        }
                    }
                }
            }
            prices.sort((a, b) => b.time - a.time);
            return prices;
        });
    }
    /**
     * Get Days Out List
     */
    getDaysOutList(times) {
        const nowMs = this.getTimeMs();
        const daysOutList = [];
        const firstCutoff = values_1.coinGeckoDayCutoffs[0];
        const firstCutoffMs = firstCutoff * values_1.ONE_DAY;
        const secondCutoff = values_1.coinGeckoDayCutoffs[1];
        const secondCutoffMs = secondCutoff * values_1.ONE_DAY;
        // Get Days Out
        const getDaysOut = (diff) => Math.ceil(diff / values_1.ONE_DAY) + 1;
        let firstDaysSearch = 0;
        let secondDaysSearch = 0;
        let secondDaysMaxDiff = 0;
        // Iterate Times
        for (const time of times) {
            const diff = nowMs - time;
            if (!firstDaysSearch && diff <= firstCutoffMs) {
                firstDaysSearch = firstCutoff;
            }
            else if (diff > firstCutoffMs &&
                diff <= secondCutoffMs &&
                diff > secondDaysMaxDiff) {
                secondDaysMaxDiff = diff;
                secondDaysSearch = getDaysOut(diff);
                if (secondDaysSearch >= secondCutoff) {
                    secondDaysSearch = secondCutoff;
                    break;
                }
            }
        }
        // Get Max Days Out
        const minMs = times.length ? Math.min(...times) : 0;
        const maxDiff = minMs ? Math.abs(nowMs - minMs) : 0;
        const maxDays = maxDiff ? getDaysOut(maxDiff) : 0;
        // Add Days Out
        if (firstDaysSearch)
            daysOutList.push(firstDaysSearch);
        if (secondDaysSearch)
            daysOutList.push(secondDaysSearch);
        if (maxDays && maxDays > secondCutoff)
            daysOutList.push(maxDays);
        return daysOutList;
    }
    /**
     * Get Coin Gecko Endpoint
     */
    getCoinGeckoEndpoint(endpoint, replaceArgs, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Format URL
            let url = values_1.ENDPOINTS[endpoint];
            if (replaceArgs) {
                for (const key in replaceArgs) {
                    if (url.includes(key)) {
                        url = url.replace(key, replaceArgs[key]);
                    }
                }
            }
            // Get URL
            const getUrl = () => __awaiter(this, void 0, void 0, function* () {
                this.manageApiLimits();
                return yield this.getEndpoint('coinGecko', url, params);
            });
            // Manage API Limits
            const nowMs = this.getTimeMs();
            const diffMs = this.nextApiCallMs - nowMs;
            if (diffMs <= 0) {
                return yield getUrl();
            }
            else {
                yield misc_1.waitMs(diffMs);
                return yield this.getCoinGeckoEndpoint(endpoint, replaceArgs, params);
            }
        });
    }
    /**
     * Manage API Limits
     */
    manageApiLimits() {
        const nowMs = this.getTimeMs();
        const currentBlockMs = nowMs - values_1.coinGeckoLimits.ms;
        // Remove Old Calls
        for (let i = 0; i < this.recentApiCalls.length; i++) {
            const callMs = this.recentApiCalls[0];
            if (callMs < currentBlockMs) {
                this.recentApiCalls.splice(0, 1);
            }
            else {
                break;
            }
        }
        // Check if block is over call limit
        this.recentApiCalls.push(nowMs);
        const numCalls = this.recentApiCalls.length;
        if (numCalls > values_1.coinGeckoLimits.calls) {
            // Remove Excess Calls
            const excessCalls = numCalls - values_1.coinGeckoLimits.calls;
            for (let i = 0; i < excessCalls; i++) {
                this.recentApiCalls.splice(0, 1);
            }
            // Set Next API Call Time
            this.nextApiCallMs = this.recentApiCalls[0] + values_1.coinGeckoLimits.ms;
        }
    }
    /**
     * Add Token Time
     */
    addTokenTime(tokenTimes, tokenName, time) {
        if (!tokenTimes[tokenName]) {
            tokenTimes[tokenName] = [time];
        }
        else {
            if (!tokenTimes[tokenName].includes(time)) {
                tokenTimes[tokenName].push(time);
            }
        }
    }
    /**
     * Is Valid Future Time
     */
    isValidFutureTime(transTime, localTime) {
        return localTime > transTime && localTime - transTime < values_1.ONE_DAY;
    }
    /**
     * Is Valid Past Time
     */
    isValidPastTime(transTime, localTime) {
        return transTime > localTime && transTime - localTime < values_1.ONE_DAY;
    }
    /**
     * Get Time in ms
     */
    getTimeMs(dateStr) {
        return dateStr ? new Date(dateStr).getTime() : new Date().getTime();
    }
}
exports.default = DefiPrices;
