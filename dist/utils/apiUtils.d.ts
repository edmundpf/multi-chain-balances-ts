import { DebankHistory } from './types';
import { APIS, ENDPOINTS } from './values';
/**
 * Misc
 */
export declare const getFormattedURL: (endpoint: string, replaceArgs: any) => string;
export declare const getEndpoint: (api: keyof typeof APIS, endpoint: keyof typeof ENDPOINTS, params?: any, headers?: any) => Promise<any>;
/**
 * API Methods
 */
export declare const getDebankEndpoint: (endpoint: keyof typeof ENDPOINTS, address: string, args?: any, hasShortAddressArg?: boolean) => Promise<any>;
export declare const getBeefyEndpoint: (endpoint: keyof typeof ENDPOINTS) => Promise<any>;
export declare const getTokenList: (address: string, chainNames: string[]) => Promise<any[]>;
export declare const getProtocolList: (address: string) => Promise<any>;
export declare const getHistory: (address: string, chainName: string, getSinglePage?: boolean) => Promise<{
    history: DebankHistory[];
    tokens: any;
}>;
/**
 * Beefy Calls
 */
export declare const getBeefyApy: () => Promise<any>;
export declare const getBeefyVaults: () => Promise<any>;
export declare const getBeefyVaultsFromGithub: () => Promise<any>;
