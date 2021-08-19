"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDeposit = exports.getTicker = exports.getTokenName = exports.checkFee = exports.checkSell = exports.checkBuy = exports.isLP = exports.isBeefyReceipt = void 0;
/**
 * Is Beefy Receipt
 */
const isBeefyReceipt = (row) => row.token_name && row.token_name.includes('moo');
exports.isBeefyReceipt = isBeefyReceipt;
/**
 * Is LP
 */
const isLP = (row) => row.token_name && row.token_name.toUpperCase().includes('LP');
exports.isLP = isLP;
/**
 * Is Buy
 */
const checkBuy = (row) => row.treatment == 'buy';
exports.checkBuy = checkBuy;
/**
 * Is Sell
 */
const checkSell = (row) => row.treatment == 'sell';
exports.checkSell = checkSell;
/**
 * Check Fee
 */
const checkFee = (row) => row.treatment == 'burn';
exports.checkFee = checkFee;
/**
 * Get Token Name
 */
const getTokenName = (row) => row.token_name ? row.token_name.toUpperCase() : row.token_contract || '';
exports.getTokenName = getTokenName;
/**
 * Get Ticker
 */
const getTicker = (quote, base) => `${quote}-${base}`;
exports.getTicker = getTicker;
/**
 * Set Deposit
 */
const setDeposit = (transRec, info) => {
    const { token, quantity, amount, price, from, to } = info;
    transRec.type = 'deposit';
    transRec.direction = 'buy';
    transRec.quote = token;
    transRec.ticker = exports.getTicker(transRec.quote, transRec.base);
    transRec.quantity = quantity;
    transRec.amount = amount;
    transRec.price = price;
    transRec.baseAmount = amount;
    transRec.baseQuantity = amount;
    transRec.basePrice = 1;
    transRec.fills = 1;
    transRec.fromAddress = from || '';
    transRec.toAddress = to || '';
};
exports.setDeposit = setDeposit;
