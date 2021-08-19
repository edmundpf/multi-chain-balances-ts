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
const fs_1 = require("fs");
const transactions_1 = require("./transactions");
const values_1 = require("./values");
// Init
const DUMMY_TRANSACTIONS_FILE = 'trans.json';
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
    getTransactions(useReq = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [];
            if (useReq) {
                // Defi Taxes Request
                const processRequest = this.getDefiTaxesEndpoint.bind(this, 'defiTaxesProcess');
                // Chain Aliases
                const chainAliases = {
                    bsc: 'BSC',
                    eth: 'ETH',
                    matic: 'Polygon',
                };
                // Send Requests
                for (const chainName of this.chainNames) {
                    requests.push(processRequest({ chain: chainAliases[chainName] || chainName }));
                }
            }
            // Resolve Requests
            const res = useReq
                ? yield Promise.all(requests)
                : JSON.parse(fs_1.readFileSync(DUMMY_TRANSACTIONS_FILE, 'utf-8'));
            // Iterate Chains
            for (const index in res) {
                const result = res[index];
                const chainName = this.chainNames[index];
                for (const record of result) {
                    // Transaction Details
                    const { hash, rows, type: transType, ts: timeNum } = record;
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
                                    type: 'quote',
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
                                        type: 'base',
                                    };
                                }
                                else {
                                    const { quantity: prevQuantity, amount: prevAmount, price: prevPrice, fills: prevFills, } = tokens[token];
                                    const newFills = prevFills + 1;
                                    tokens[token].fills = newFills;
                                    tokens[token].quantity = adjQuantity + prevQuantity;
                                    tokens[token].amount = adjAmount + prevAmount;
                                    tokens[token].price = (prevPrice * prevFills + price) / newFills;
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
                                    to,
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
                                to,
                            });
                            console.log('DEPOSIT');
                            this.transactions[chainName].push(transRec);
                            break;
                        }
                    }
                    // Convert tokens to transaction
                    if (Object.keys(tokens).length > 0) {
                        for (const tokenName in tokens) {
                            const { type, quantity, amount, price } = tokens[tokenName];
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
                            : transRec.quote || '';
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
     * Get Defi Taxes Endpoint
     */
    getDefiTaxesEndpoint(endpoint, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEndpoint('defiTaxes', endpoint, Object.assign({ address: this.address }, args));
        });
    }
}
exports.default = DefiTransactions;
