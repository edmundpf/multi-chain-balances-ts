import { LocalPriceData, LocalContractData } from './types';
/**
 * Prepare DB
 */
export declare const prepareDB: () => Promise<boolean>;
/**
 * Select Prices
 */
export declare const selectPrices: (symbol: string) => Promise<LocalPriceData[]>;
/**
 * Insert Price
 */
export declare const insertPrice: (record: LocalPriceData) => Promise<void>;
/**
 * Select Contracts
 */
export declare const selectContracts: () => Promise<LocalContractData[]>;
/**
 * Insert Contract
 */
export declare const insertContract: (record: LocalContractData) => Promise<void>;
