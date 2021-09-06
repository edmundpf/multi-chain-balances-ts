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
    }
    /**
     * Get Price Data
     */
    getPriceData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield priceData_1.prepareDB();
            const supportedTokens = yield this.getSupportedTokens();
            const supportedTokenNames = Object.keys(supportedTokens);
            const transTokenTimes = this.getTokenTransactionTimes(supportedTokenNames);
            const transTokenNames = Object.keys(transTokenTimes);
            const localPrices = yield this.getLocalPrices(transTokenNames);
            const { transPrices, missingTimes } = this.linkLocalPrices(transTokenTimes, localPrices);
            const daysOutLists = this.getAllDaysOutLists(missingTimes);
            const apiPrices = yield this.getAllTokenPrices(daysOutLists, supportedTokens);
            const insertRecords = this.getInsertRecords(localPrices, apiPrices);
            const mergedPrices = this.mergeApiAndLocalPrices(localPrices, apiPrices);
            this.linkMergedPrices(transPrices, mergedPrices);
            this.updateTransactionData(transPrices);
            yield this.syncMissingPrices(insertRecords);
        });
    }
    /**
     * Get Supported Tokens
     */
    getSupportedTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedTokens = {};
            const res = yield this.getCoinGeckoEndpoint('coinGeckoList');
            if (res === null || res === void 0 ? void 0 : res.length) {
                for (const record of res) {
                    const tokenName = this.sterilizeTokenName(record.symbol);
                    if (tokenName && !supportedTokens[tokenName]) {
                        supportedTokens[tokenName] = record.id;
                    }
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
                const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol, chainName);
                const baseName = this.sterilizeTokenNameNoStub(baseSymbol, chainName);
                const quoteSupported = supportedTokenNames.includes(quoteName);
                const baseSupported = supportedTokenNames.includes(baseName);
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
        // Iterate Prices
        for (const tokenName in transPrices) {
            // Iterate Chains
            for (const chainNm in this.chains) {
                const chainName = chainNm;
                const chain = this.chains[chainName];
                // Iterate Transactions
                for (const transaction of chain.transactions) {
                    const { quoteSymbol, baseSymbol, feeSymbol, feePriceUSD, quoteQuantity, baseQuantity, date } = transaction;
                    const time = this.getTimeMs(date);
                    const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol, chainName);
                    const baseName = this.sterilizeTokenNameNoStub(baseSymbol, chainName);
                    const quoteTokenMatch = tokenName == quoteName;
                    const baseTokenMatch = tokenName == baseName;
                    const quoteFeeMatch = quoteSymbol == feeSymbol && feePriceUSD;
                    const baseFeeMatch = baseSymbol == feeSymbol && feePriceUSD;
                    // Quote Token
                    if (!quoteFeeMatch && quoteTokenMatch) {
                        const priceMatch = getMatchingPrice(transPrices[tokenName], time);
                        if (priceMatch && priceMatch.price) {
                            const { price, value } = getPriceAndValue(priceMatch, quoteQuantity);
                            transaction.quotePriceUSD = price;
                            transaction.quoteValueUSD = value;
                        }
                    }
                    // Quote Token is Fee Token
                    else if (quoteFeeMatch) {
                        const { price, value } = getPriceAndValue({ price: feePriceUSD }, quoteQuantity);
                        transaction.quotePriceUSD = price;
                        transaction.quoteValueUSD = value;
                    }
                    // Base Token
                    else if (!baseFeeMatch && baseTokenMatch) {
                        const priceMatch = getMatchingPrice(transPrices[tokenName], time);
                        if (priceMatch && priceMatch.price) {
                            const { price, value } = getPriceAndValue(priceMatch, baseQuantity);
                            transaction.basePriceUSD = price;
                            transaction.baseValueUSD = value;
                        }
                    }
                    // Base Token is Fee Token
                    else if (baseFeeMatch) {
                        const { price, value } = getPriceAndValue({ price: feePriceUSD }, baseQuantity);
                        transaction.basePriceUSD = price;
                        transaction.baseValueUSD = value;
                    }
                }
            }
        }
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
     * Get Days Out Lits
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
     * Sterilize Token Name
     */
    sterilizeTokenName(token) {
        return (token || '').replace(/ /g, '-').toUpperCase();
    }
    /**
     * Remove Token Contract Stub
     */
    sterilizeTokenNameNoStub(tokenName, chainName) {
        let curName = tokenName;
        if (tokenName.includes('-')) {
            const dashParts = tokenName.split('-');
            const lastPart = dashParts[dashParts.length - 1];
            const addressStub = this.getAddressStub(this.chains[chainName].tokenAddresses[tokenName]);
            if (lastPart == addressStub) {
                dashParts.pop();
                curName = dashParts.join('-');
            }
        }
        return this.sterilizeTokenName(curName);
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
