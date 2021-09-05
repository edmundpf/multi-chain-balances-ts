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
    beefy: string;
    apeBoard: string;
    debank: string;
    debankPrivate: string;
    coinGecko: string;
};
export declare const ENDPOINTS: {
    beefyApy: string;
    tokenList: string;
    protocolList: string;
    debankHistory: string;
    apeBoardHistory: string;
    coinGeckoList: string;
    coinGeckoPrices: string;
};
export declare const apeBoardCredentials: {
    secret: string;
    passCode: string;
};
export declare const coinGeckoLimits: {
    calls: number;
    ms: number;
};
export declare const coinGeckoDayCutoffs: number[];
/**
 * Default Values
 */
export declare const defaultHistoryRecord: HistoryRecord;
export declare const initChains: () => Chains;
export declare const ONE_DAY: number;
