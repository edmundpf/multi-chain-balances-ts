import { Chains, Transactions, HistoryRecord } from './types';
export declare const initChains: () => Chains;
export declare const initTrans: () => Transactions;
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
    defiTaxesProcess: string;
    transactionHistoryBsc: string;
    transactionHistoryEth: string;
    transactionHistoryMatic: string;
};
export declare const NATIVE_TOKENS: {
    bsc: string;
    eth: string;
    ftm: string;
    matic: string;
};
export declare const CHAIN_ALIASES: {
    bsc: string;
    eth: string;
    ftm: string;
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
    ftm: string;
    matic: string;
};
export declare const defaultHistoryRecord: HistoryRecord;
