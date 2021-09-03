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
// import {
// 	checkBuy,
// 	checkSell,
// 	checkFee,
// 	getTokenName,
// 	getTicker,
// 	setDeposit,
// } from './transactions'
const misc_1 = require("./misc");
const values_1 = require("./values");
/**
 * DefiTransactions Class
 */
class DefiTransactions extends DefiBalances_1.default {
    constructor() {
        // Properties
        super(...arguments);
        this.transactions = values_1.initTrans();
    }
    /**
     * Get Transactions
     */
    getTransactions() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [];
            const processRequest = this.getDefiTaxesEndpoint.bind(this, 'defiTaxesProcess');
            // Is Debit
            const transIsDebit = (from) => from.toUpperCase() == this.address.toUpperCase();
            // Send Requests
            for (const chainName of this.chainNames) {
                requests.push(processRequest({ chain: values_1.CHAIN_ALIASES[chainName] || chainName }));
                requests.push(this.getApeBoardEndpoint(`transactionHistory${misc_1.titleCase(chainName)}}`));
            }
            // Resolve Requests
            const res = yield Promise.all(requests);
            // Iterate Chains
            for (const index in this.chainNames) {
                const priceIndex = Number(index) * 2;
                const transIndex = priceIndex + 1;
                const chainName = this.chainNames[index];
                const nativeToken = values_1.NATIVE_TOKENS[chainName];
                const priceInfo = res[priceIndex];
                const transInfo = ((_a = res[transIndex]) === null || _a === void 0 ? void 0 : _a.histories) || [];
                const hashes = {};
                // Get Hashes w/ Prices
                for (const record of priceInfo) {
                    const { hash, rows } = record;
                    const tokens = {};
                    // Iterate Rows
                    for (const row of rows) {
                        const { from, token_name: tokenName, token_contract: tokenContract, value: tokenQuantity, rate: tokenPrice, treatment, } = row;
                        // Skip burns/missing tokens
                        const isBurn = treatment == 'burn';
                        const token = tokenName || tokenContract || '';
                        if (isBurn || !token)
                            continue;
                        const isDebit = transIsDebit(from);
                        const price = tokenPrice || 0;
                        let quantity = tokenQuantity || 0;
                        let amount = quantity * price;
                        if (isDebit) {
                            if (quantity)
                                quantity = quantity * -1;
                            if (amount)
                                amount = amount * -1;
                        }
                        // Update token
                        if (!tokens[token]) {
                            tokens[token] = {
                                amount,
                                quantity,
                                price,
                                fills: 1
                            };
                        }
                        else {
                            const { amount: priorAmount, quantity: priorQuantity, price: priorPrice, fills: priorFills, } = tokens[token];
                            const newFills = priorFills + 1;
                            const newPrice = ((priorPrice * priorFills) + price) / newFills;
                            tokens[token] = {
                                amount: priorAmount + amount,
                                quantity: priorQuantity + quantity,
                                price: newPrice,
                                fills: newFills,
                            };
                        }
                    }
                    // Fill in missing info
                    const numTokens = Object.keys(tokens).length;
                    if (numTokens) {
                        let totalAmount = 0;
                        const incomplete = [];
                        for (const tokenName in tokens) {
                            const token = tokens[tokenName];
                            const { amount } = token;
                            totalAmount += amount;
                            if (!amount)
                                incomplete.push(tokenName);
                        }
                        if (incomplete.length == 1 && numTokens > 1) {
                            const incompleteToken = tokens[incomplete[0]];
                            const { quantity: priorQuantity } = tokens[incomplete[0]];
                            const amount = totalAmount * -1;
                            const quantity = amount >= 0 ? priorQuantity : priorQuantity * -1;
                            const price = Math.abs(amount / quantity);
                            incompleteToken.amount = amount;
                            incompleteToken.quantity = quantity;
                            incompleteToken.price = price;
                        }
                        // Normalize Swap Prices
                        if (numTokens == 2) {
                            let buyToken = '';
                            let sellToken = '';
                            let buyAmount = 0;
                            let sellAmount = 0;
                            for (const tokenName in tokens) {
                                const { amount } = tokens[tokenName];
                                if (!amount)
                                    break;
                                if (amount >= 0) {
                                    buyToken = tokenName;
                                    buyAmount = amount;
                                }
                                else {
                                    sellToken = tokenName;
                                    sellAmount = amount;
                                }
                            }
                            if (buyAmount && sellAmount) {
                                const absBuyAmount = Math.abs(buyAmount);
                                if (absBuyAmount != sellAmount) {
                                    const higherBuy = absBuyAmount >= sellAmount;
                                    if (higherBuy) {
                                        const { quantity } = tokens[buyToken];
                                        const amount = sellAmount * -1;
                                        const price = Math.abs(amount / quantity);
                                        tokens[buyToken].amount = amount;
                                        tokens[buyToken].price = price;
                                    }
                                    else {
                                        const { quantity } = tokens[sellToken];
                                        const amount = absBuyAmount;
                                        const price = Math.abs(amount / quantity);
                                        tokens[sellToken].amount = amount;
                                        tokens[sellToken].price = price;
                                    }
                                }
                            }
                        }
                        // Set Hash
                        hashes[hash] = tokens;
                    }
                }
                // Parse History
                for (const record of transInfo) {
                    const { hash, 
                    // from: fromAddress,
                    // to: toAddress,
                    function: method, 
                    // fee: feeQuant,
                    timestamp, nativePrice, transfers } = record;
                    // Properties
                    const type = method || '';
                    const isSwap = type.includes('swap');
                    // const feeQuantity = feeQuant || 0
                    const feePrice = nativePrice || 0;
                    // const fees = feeQuantity * feePrice
                    const date = new Date(timestamp).toISOString();
                    // Get Hash Info
                    const hashTokens = hashes[hash];
                    const hashTokenNames = Object.keys(hashTokens);
                    const hashTokensCount = hashTokenNames.length;
                    const hashIsSterile = hashTokensCount == 2 &&
                        hashTokens[0].amount &&
                        hashTokens[1].amount &&
                        hashTokens[0].amount == hashTokens[1].amount * -1;
                    const hashHasNativeToken = hashTokenNames.some((tokenName) => tokenName.toUpperCase() == nativeToken);
                    // Replace native token prices
                    if (hashHasNativeToken && feePrice) {
                        let nativeTokenIndex = 0;
                        for (const index in hashTokenNames) {
                            const tokenName = hashTokenNames[index];
                            const upperTokenName = tokenName.toUpperCase();
                            if (upperTokenName == nativeToken) {
                                nativeTokenIndex = Number(index);
                                break;
                            }
                        }
                        const nativeTokenKey = hashTokenNames[nativeTokenIndex];
                        const { quantity: nativeQuantity } = hashTokens[nativeTokenKey];
                        const nativePrice = feePrice;
                        const nativeAmount = nativeQuantity * nativePrice;
                        hashTokens[nativeTokenKey].amount = nativeAmount;
                        hashTokens[nativeTokenKey].price = feePrice;
                        // Normalize swaps w/ new prices
                        if (hashIsSterile) {
                            const quoteTokenIndex = nativeTokenIndex ? 0 : 1;
                            const quoteTokenKey = hashTokenNames[quoteTokenIndex];
                            const { quantity: quoteQuantity } = hashTokens[quoteTokenKey];
                            const quoteAmount = nativeAmount * -1;
                            const quotePrice = Math.abs(quoteAmount / quoteQuantity);
                            hashTokens[quoteTokenKey].amount = quoteAmount;
                            hashTokens[quoteTokenKey].price = quotePrice;
                        }
                    }
                    // Get Buy Token for Swaps
                    let hashBuyToken = '';
                    let hashBuyTokenUpper = '';
                    let buyTokenInfo = undefined;
                    if (isSwap) {
                        let buyToken = '';
                        let buyTokenUpper = '';
                        for (const transfer of transfers) {
                            const { from, symbol, tokenAddress,
                            // balance: tokenQuantity
                             } = transfer;
                            const isDebit = transIsDebit(from);
                            if (isDebit) {
                                buyToken = symbol || tokenAddress || '';
                                buyTokenUpper = buyToken.toUpperCase();
                                break;
                            }
                        }
                        // Get Buy Token Info from Hash
                        let buyTokenIndex = 0;
                        for (const index in hashTokenNames) {
                            const tokenName = hashTokenNames[index];
                            const upperTokenName = tokenName.toUpperCase();
                            if (upperTokenName == buyTokenUpper) {
                                buyTokenIndex = Number(index);
                                break;
                            }
                        }
                        hashBuyToken = hashTokenNames[buyTokenIndex];
                        hashBuyTokenUpper = hashBuyToken.toUpperCase();
                        buyTokenInfo = hashTokens[hashBuyToken];
                    }
                    // Iterate Transfers
                    for (const transfer of transfers) {
                        const { 
                        // from,
                        symbol, tokenAddress,
                        // balance: tokenQuantity
                         } = transfer;
                        const token = symbol || tokenAddress || '';
                        const tokenUpper = token.toUpperCase();
                        // const quantity = tokenQuantity || 0
                        // const isDebit = transIsDebit(from)
                        // Format Swaps
                        if (isSwap && buyTokenInfo) {
                            const isBuyToken = tokenUpper == hashBuyTokenUpper;
                            if (!isBuyToken) {
                                // Get Current Token Info from Hash
                                let curTokenIndex = 0;
                                for (const index in hashTokenNames) {
                                    const tokenName = hashTokenNames[index];
                                    const upperTokenName = tokenName.toUpperCase();
                                    if (upperTokenName == tokenUpper) {
                                        curTokenIndex = Number(index);
                                        break;
                                    }
                                }
                                const hashCurToken = hashTokenNames[curTokenIndex];
                                // const curTokenInfo = hashTokens[hashCurToken]
                                // const { price } = buyTokenInfo
                                // const {
                                // 	amount: baseAmount,
                                // 	quantity: baseQuantity,
                                // 	price: basePrice,
                                // } = curTokenInfo
                                const quote = hashBuyToken;
                                const base = hashCurToken;
                                const ticker = quote.includes('-') || base.includes('-')
                                    ? quote
                                    : `${quote}-${base}`;
                                // const amount = baseAmount * -1
                                // const quantity = amount / price
                                this.transactions[chainName].push(Object.assign(Object.assign({}, values_1.defaultHistoryRecord), { id: hash, date,
                                    ticker,
                                    quote,
                                    base,
                                    type, direction: 'buy' }));
                            }
                        }
                    }
                }
            }
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
}
exports.default = DefiTransactions;
