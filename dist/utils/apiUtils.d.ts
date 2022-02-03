import { APIS, ENDPOINTS } from './values';
/**
 * Misc
 */
export declare const getFormattedURL: (endpoint: string, replaceArgs: any) => string;
export declare const getEndpoint: (api: keyof typeof APIS, endpoint: keyof typeof ENDPOINTS, params?: any, headers?: any) => Promise<any>;
/**
 * API Methods
 */
export declare const getDebankEndpoint: (endpoint: keyof typeof ENDPOINTS, address: string, args?: any) => Promise<any>;
export declare const getPrivateDebankEndpoint: (endpoint: keyof typeof ENDPOINTS, address: string, args?: any) => Promise<any>;
export declare const getApeBoardEndpoint: (endpoint: keyof typeof ENDPOINTS, address: string) => Promise<any>;
export declare const getFarmArmyEndpoint: (endpoint: keyof typeof ENDPOINTS, address: string, params?: any) => Promise<any>;
export declare const getBeefyEndpoint: (endpoint: keyof typeof ENDPOINTS) => Promise<any>;
/**
 * Debank Calls
 */
export declare const getTokenList: (address: string) => Promise<any>;
export declare const getKnownTokenList: (address: string) => Promise<any>;
export declare const getProtocolList: (address: string) => Promise<any>;
/**
 * Apeboard Calls
 */
export declare const getSolanaTokensInfo: (address: string) => Promise<any>;
export declare const getSolanaVaultsInfo: (address: string) => Promise<any>;
/**
 * Farm Army Calls
 */
export declare const getHarmonyTokensInfo: (address: string) => Promise<any>;
export declare const getHarmonyVaultsInfo: (address: string) => Promise<any>;
/**
 * Beefy Calls
 */
export declare const getBeefyApy: () => Promise<any>;
export declare const getBeefyVaults: () => Promise<any>;
