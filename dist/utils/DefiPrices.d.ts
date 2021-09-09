import DefiTransactions from './DefiTransactions';
import { defaultDriverArgs } from './values';
/**
 * DefiPrices Class
 */
export default class DefiPrices extends DefiTransactions {
    private nextApiCallMs;
    private recentApiCalls;
    private filterUnknownTokens;
    /**
     * Driver
     */
    driver(args?: typeof defaultDriverArgs): Promise<void>;
    /**
     * Get Price Data
     */
    private getPriceData;
    /**
     * Read Temp File
     */
    private readTempFile;
    /**
     * Set Temp Data
     */
    private setTempData;
    /**
     * Write Temp File
     */
    private writeTempFile;
    /**
     * Import Prior Transactions
     */
    private importPriorTransactions;
    /**
     * Get Supported Tokens
     */
    private getSupportedTokens;
    /**
     * Get Token Transaction Times
     */
    private getTokenTransactionTimes;
    /**
     * Get Local Prices
     */
    private getLocalPrices;
    /**
     * Link Local Prices
     */
    private linkLocalPrices;
    /**
     * Get All Days Out Lists
     */
    private getAllDaysOutLists;
    /**
     * Get All Token Prices
     */
    private getAllTokenPrices;
    /**
     * Merge API and Local Prices
     */
    private mergeApiAndLocalPrices;
    /**
     * Link Merged Prices
     */
    private linkMergedPrices;
    /**
     * Get Insert Records
     */
    private getInsertRecords;
    /**
     * Sync Missing Prices
     */
    private syncMissingPrices;
    /**
     * Update Transaction Data
     */
    private updateTransactionData;
    /**
     * Remove Garbage Price Info
     */
    private removeGarbagePriceInfo;
    /**
     * Infer Transaction Prices
     */
    private inferTransactionPrices;
    /**
     * Infer Single Swap
     */
    private inferSingleSwap;
    /**
     * Infer Multi Swap
     */
    private inferMultiSwap;
    /**
     * Set Value And Price
     */
    private setValueAndPrice;
    /**
     * Calculate Totals w/ Slippage
     */
    private calculateTotalsWithSlippage;
    /**
     * Get Valid Price Record
     */
    private getValidPriceRecord;
    /**
     * Get Token Prices
     */
    private getTokenPrices;
    /**
     * Get Days Out List
     */
    private getDaysOutList;
    /**
     * Get Coin Gecko Endpoint
     */
    private getCoinGeckoEndpoint;
    /**
     * Manage API Limits
     */
    private manageApiLimits;
    /**
     * Add Token Time
     */
    private addTokenTime;
    /**
     * Is Valid Future Time
     */
    private isValidFutureTime;
    /**
     * Is Valid Past Time
     */
    private isValidPastTime;
    /**
     * Get Time in ms
     */
    private getTimeMs;
}
