import { Chains, Transactions, TokenRecord, HistoryRecord } from './types';
export declare const initChains: () => Chains;
export declare const initTrans: () => Transactions;
export declare const initTokenRecord: () => TokenRecord;
export declare const APIS: {
    debank: string;
    beefy: string;
    apeBoard: string;
    defiTaxes: string;
};
export declare const ENDPOINTS: {
    tokenList: string;
    protocolList: string;
    beefyApy: string;
    beefyBsc: string;
    beefyPolygon: string;
    defiTaxesProcess: string;
};
export declare const NATIVE_TOKENS: {
    bsc: string;
    eth: string;
    matic: string;
};
export declare const apeBoardCredentials: {
    secret: string;
    passCode: string;
};
export declare const exchangeAliases: {
    dino: string[];
    ape: string[];
};
export declare const DEFAULT_URLS: {
    bsc: string;
    eth: string;
    matic: string;
};
export declare const defaultHistoryRecord: HistoryRecord;
