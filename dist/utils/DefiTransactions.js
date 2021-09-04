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
const values_1 = require("./values");
/**
 * DefiTransactions Class
 */
class DefiTransactions extends DefiBalances_1.default {
    /**
     * Get Transactions
     */
    getTransactions(useDebank = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const debankRequests = [];
            const apeBoardRequests = [];
            const rawChains = [];
            const debankTokens = [];
            // Get Info from Debank
            const getInfoFromDebank = () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                for (const index in this.chainNames) {
                    const chainName = this.chainNames[index];
                    if (!rawChains[index]) {
                        debankRequests.push(this.getPrivateDebankEndpoint('debankHistory', { chain: chainName }));
                    }
                    else {
                        debankRequests.push(undefined);
                    }
                }
                const res = yield Promise.all(debankRequests);
                const isFilled = rawChains.length == this.chainNames.length;
                for (const index in res) {
                    const result = res[index];
                    if (((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.history_list) && !((_b = result) === null || _b === void 0 ? void 0 : _b.error_msg)) {
                        rawChains[index] = result.data.history_list;
                    }
                    else if (!rawChains[index]) {
                        rawChains[index] = isFilled ? [] : undefined;
                    }
                    debankTokens.push(((_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.token_dict) || {});
                }
            });
            // Get Info from Ape Board
            const getInfoFromApeBoard = () => __awaiter(this, void 0, void 0, function* () {
                var _d;
                for (const index in this.chainNames) {
                    const chainName = this.chainNames[index];
                    const chainAlias = values_1.APEBOARD_CHAIN_ALIASES[chainName];
                    if (!rawChains[index]) {
                        const endpoint = `${values_1.ENDPOINTS['apeBoardHistory']}/${chainAlias}`;
                        apeBoardRequests.push(this.getApeBoardEndpoint(endpoint));
                    }
                    else {
                        apeBoardRequests.push(undefined);
                    }
                }
                const res = yield Promise.all(apeBoardRequests);
                const isFilled = rawChains.length == this.chainNames.length;
                for (const index in res) {
                    const result = res[index];
                    if (result && !((_d = result) === null || _d === void 0 ? void 0 : _d.statusCode)) {
                        rawChains[index] = result;
                    }
                    else if (!rawChains[index]) {
                        rawChains[index] = isFilled ? [] : undefined;
                    }
                }
            });
            // Get Info
            if (useDebank) {
                yield getInfoFromDebank();
                yield getInfoFromApeBoard();
            }
            else {
                yield getInfoFromApeBoard();
                yield getInfoFromDebank();
            }
            // Iterate Chain Results
            for (const index in rawChains) {
                const chainName = this.chainNames[index];
                const records = rawChains[index];
                let historyRecords = [];
                for (const record of records) {
                    const nestedRecord = this.sterilizeHistoryRecord(record, chainName, debankTokens[index]);
                    const splitRecords = this.splitHistoryRecord(nestedRecord);
                    historyRecords = [...historyRecords, ...splitRecords];
                }
                this.chains[chainName].transactions = historyRecords;
            }
        });
    }
    /**
     * Sterilize History Record
     */
    sterilizeHistoryRecord(record, chainName, tokenSymbols) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const debankRec = record;
        const apeBoardRec = record;
        const tokens = {};
        // Add Token
        const addToken = (info) => {
            const { token, quantity } = info;
            if (quantity != 0) {
                tokens[token] = {
                    amount: 0,
                    quantity,
                    price: 0
                };
            }
        };
        // Get Universal Info
        let type = debankRec.cate_id ||
            ((_a = debankRec.tx) === null || _a === void 0 ? void 0 : _a.name) ||
            ((_c = (_b = apeBoardRec.interactions) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.function) ||
            '';
        const hash = debankRec.id || apeBoardRec.hash || '';
        const date = new Date((debankRec.time_at * 1000) || apeBoardRec.timestamp).toISOString();
        const toAddress = ((_d = debankRec.tx) === null || _d === void 0 ? void 0 : _d.to_addr) || ((_f = (_e = apeBoardRec.interactions) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.to) || this.address;
        const fromAddress = ((_g = debankRec.tx) === null || _g === void 0 ? void 0 : _g.from_addr) ||
            debankRec.other_addr ||
            ((_j = (_h = apeBoardRec.interactions) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.from) ||
            this.address;
        const feeToken = values_1.NATIVE_TOKENS[chainName];
        const feeQuantity = ((_k = debankRec.tx) === null || _k === void 0 ? void 0 : _k.eth_gas_fee) || ((_m = (_l = apeBoardRec.fee) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.amount) || 0;
        let feePrice = ((_p = (_o = apeBoardRec.fee) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.price) || 0;
        let fees = ((_q = debankRec.tx) === null || _q === void 0 ? void 0 : _q.usd_gas_fee) || 0;
        feePrice = feePrice || fees / feeQuantity || 0;
        fees = fees || feeQuantity * feePrice || 0;
        // Get Tokens Info
        if (apeBoardRec.transfers) {
            for (const record of apeBoardRec.transfers) {
                const tokenInfo = this.sterilizeApeBoardTransfer(record);
                addToken(tokenInfo);
            }
        }
        else {
            for (const record of debankRec.sends) {
                const tokenInfo = this.sterilizeDebankTransfer(record, true, tokenSymbols);
                addToken(tokenInfo);
            }
            for (const record of debankRec.receives) {
                const tokenInfo = this.sterilizeDebankTransfer(record, false, tokenSymbols);
                addToken(tokenInfo);
            }
        }
        // Sterilize Type
        type = this.sterilizeTransactionType(type, tokens);
        // Get Direction
        const direction = ['receive', 'swap'].includes(type) ? 'credit' : 'debit';
        // Format Result
        return Object.assign(Object.assign({}, values_1.defaultHistoryRecord), { id: hash, date,
            type,
            direction,
            tokens, basePrice: 0, fees,
            feeQuantity,
            feePrice,
            feeToken, chain: chainName, fromAddress,
            toAddress });
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
                    const quantity = compareIsBase
                        ? record.tokens[quote].quantity
                        : getQuantity(record.tokens[quote].quantity, iterTokens.length);
                    const baseQuantity = compareIsBase
                        ? getQuantity(record.tokens[base].quantity, iterTokens.length)
                        : record.tokens[base].quantity;
                    const feeQuantity = getQuantity(record.feeQuantity, iterTokens.length);
                    const fees = getFees(feeQuantity, record.feePrice);
                    const ticker = getTicker(quote, base);
                    const splitRecord = Object.assign(Object.assign({}, record), { ticker,
                        quote,
                        base,
                        quantity,
                        baseQuantity,
                        fees,
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
                    const base = record.base;
                    const quantity = curToken.quantity;
                    const feeQuantity = getQuantity(record.feeQuantity, numTokens);
                    const fees = getFees(feeQuantity, record.feePrice);
                    const ticker = getTicker(quote, base);
                    const splitRecord = Object.assign(Object.assign({}, record), { ticker,
                        quote,
                        quantity,
                        fees,
                        feeQuantity });
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
     * Sterilize Ape Board Transfer
     */
    sterilizeApeBoardTransfer(record) {
        const { symbol, tokenAddress, balance, type } = record;
        const token = (symbol || tokenAddress).toUpperCase();
        const isDebit = type == 'out';
        const quantity = isDebit ? balance * -1 : balance;
        return {
            token,
            quantity,
        };
    }
    /**
     * Sterilize Debank Transfer
     */
    sterilizeDebankTransfer(record, isSend = true, tokenSymbols) {
        const { amount, token_id: tokenId } = record;
        const token = (tokenSymbols[tokenId].symbol || tokenId).toUpperCase();
        const quantity = isSend ? amount * -1 : amount;
        return {
            token,
            quantity
        };
    }
    /**
     * Sterilize Transaction Type
     */
    sterilizeTransactionType(type, tokens) {
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
        else if (type != 'approve' && !numTokens) {
            newType = 'failure';
        }
        return newType;
    }
}
exports.default = DefiTransactions;
