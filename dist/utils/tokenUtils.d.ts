import { TokenAddresses } from './types';
/**
 * Formatting
 */
export declare const symbolWithDashes: (symbol: string) => string;
export declare const getAddressStub: (address: string) => string;
export declare const sterilizeTokenName: (token: string) => string;
export declare const sterilizeTokenNameNoStub: (tokenName: string) => string;
/**
 * Validation
 */
export declare const isContract: (address: string) => boolean;
export declare const isNativeToken: (tokenName: string) => boolean;
export declare const isStableCoin: (tokenName: string, price: number) => boolean;
export declare const isUnknownToken: (unknownTokens: string[], symbol: string) => boolean;
/**
 * Misc
 */
export declare const addContract: (symbols: TokenAddresses, symbol: string, address: string) => void;
