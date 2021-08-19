import { DefiRow, HistoryRecord } from './types';
/**
 * Is Beefy Receipt
 */
export declare const isBeefyReceipt: (row: DefiRow) => boolean | "";
/**
 * Is LP
 */
export declare const isLP: (row: DefiRow) => boolean | "";
/**
 * Is Buy
 */
export declare const checkBuy: (row: DefiRow) => boolean;
/**
 * Is Sell
 */
export declare const checkSell: (row: DefiRow) => boolean;
/**
 * Check Fee
 */
export declare const checkFee: (row: DefiRow) => boolean;
/**
 * Get Token Name
 */
export declare const getTokenName: (row: DefiRow) => string;
/**
 * Get Ticker
 */
export declare const getTicker: (quote: string, base: string) => string;
/**
 * Set Deposit
 */
export declare const setDeposit: (transRec: HistoryRecord, info: {
    token: string;
    quantity: number;
    amount: number;
    price: number;
    from: string;
    to?: string;
}) => void;
