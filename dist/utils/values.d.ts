import { Chains, HistoryRecord, DriverArgs } from './types';
/**
 * Fiat Currency
 */
export declare const FIAT_CURRENCY = "USD";
/**
 * Default Deposit Chain
 */
export declare const DEFAULT_DEPOSIT_CHAIN = "bsc";
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
export declare const initChains: () => Chains;
export declare const defaultHistoryRecord: HistoryRecord;
export declare const ONE_DAY: number;
export declare const defaultDriverArgs: DriverArgs;
export declare const stableCoinConfig: {
    otherCoins: string[];
    errorPercent: number;
};
export declare const slippageConfig: {
    low: number;
    high: number;
};
export declare const TEMP_TRANSACTION_FILE = "transactions.json";
export declare const DEFAULT_MIN_VALUE = 0.05;
export declare const DEFAULT_DB_FILE = ".defi-prices.db";
