import { Chains, HistoryRecord } from './types';
/**
 * Crypto Info
 */
export declare const NATIVE_TOKENS: {
    bsc: string;
    eth: string;
    ftm: string;
    matic: string;
};
export declare const APEBOARD_CHAIN_ALIASES: {
    bsc: string;
    eth: string;
    ftm: string;
    matic: string;
};
export declare const EXCHANGE_ALIASES: {
    dino: string[];
    ape: string[];
};
export declare const DEFAULT_URLS: {
    bsc: string;
    eth: string;
    ftm: string;
    matic: string;
};
/**
 * API Info
 */
export declare const APIS: {
    debank: string;
    debankPrivate: string;
    beefy: string;
    apeBoard: string;
    defiTaxes: string;
};
export declare const ENDPOINTS: {
    beefyApy: string;
    tokenList: string;
    protocolList: string;
    debankHistory: string;
    apeBoardHistory: string;
};
export declare const apeBoardCredentials: {
    secret: string;
    passCode: string;
};
/**
 * Default Values
 */
export declare const defaultHistoryRecord: HistoryRecord;
export declare const initChains: () => Chains;
