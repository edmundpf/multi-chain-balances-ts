import { DefiRow, HistoryRecord } from './types';
export declare const isBeefyReceipt: (row: DefiRow) => boolean | "";
export declare const isLP: (row: DefiRow) => boolean | "";
export declare const checkBuy: (row: DefiRow) => boolean;
export declare const checkSell: (row: DefiRow) => boolean;
export declare const checkFee: (row: DefiRow) => boolean;
export declare const getTokenName: (row: DefiRow) => string;
export declare const getTicker: (quote: string, base: string) => string;
export declare const setDeposit: (transRec: HistoryRecord, info: {
    token: string;
    quantity: number;
    amount: number;
    price: number;
    from: string;
    to?: string;
}) => void;
