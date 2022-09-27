import { Chains, HistoryRecord, DriverArgs } from './types';
/**
 * Crypto Info
 */
export declare const FIAT_CURRENCY = "USD";
export declare const NATIVE_TOKENS: {
    avax: string;
    bsc: string;
    cro: string;
    eth: string;
    ftm: string;
    matic: string;
    movr: string;
    hmy: string;
};
export declare const DEFAULT_URLS: {
    avax: string;
    bsc: string;
    cro: string;
    eth: string;
    ftm: string;
    matic: string;
    movr: string;
    hmy: string;
};
export declare const BEEFY_VAULT_URLS: {
    avax: string;
    bsc: string;
    cro: string;
    frm: string;
    matic: string;
    movr: string;
    hmy: string;
};
/**
 * API Info
 */
export declare const APIS: {
    beefy: string;
    debank: string;
    coinGecko: string;
    githubVaults: string;
};
export declare const ENDPOINTS: {
    beefyApy: string;
    beefyVaults: string;
    tokenList: string;
    protocolList: string;
    history: string;
    coinGeckoList: string;
    coinGeckoPrices: string;
};
export declare const coinGeckoLimits: {
    calls: number;
    ms: number;
};
export declare const coinGeckoDayCutoffs: number[];
/**
 * Default Values
 */
export declare const defaultDriverArgs: DriverArgs;
export declare const defaultHistoryRecord: HistoryRecord;
export declare const DEFAULT_MIN_VALUE = 0.05;
export declare const DEFAULT_DB_FILE = ".sqlite-data/defi-prices.db";
export declare const stableCoinConfig: {
    otherCoins: string[];
    errorPercent: number;
};
export declare const slippageConfig: {
    low: number;
    high: number;
};
export declare const initChains: () => Chains;
export declare const ONE_DAY: number;
export declare const SAVED_VAULTS_FILE = "saved_vaults.json";
export declare const getDebankHeaders: (address: string) => {
    account: string;
    'x-api-ts': number;
    Accept: string;
    'Accept-Language': string;
    Referer: string;
    Origin: string;
    'User-Agent': string;
    'sec-ch-ua': string;
    'sec-ch-ua-mobile': string;
    'sec-ch-ua-platform': string;
    'sec-fetch-dest': string;
    'sec-fetch-mode': string;
    'sec-fetch-site': string;
    source: string;
    'x-api-nonce': string;
    'x-api-sign': string;
    'x-api-ver': string;
};
