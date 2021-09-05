import DefiTransactions from './DefiTransactions';
/**
 * DefiPrices Class
 */
export default class DefiPrices extends DefiTransactions {
    private nextApiCallMs;
    private recentApiCalls;
    /**
     * Get Price Data
     */
    getPriceData(): Promise<void>;
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
     * Get Valid Price Record
     */
    private getValidPriceRecord;
    /**
     * Get Token Prices
     */
    private getTokenPrices;
    /**
     * Get Days Out Lits
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
     * Sterilize Token Name
     */
    private sterilizeTokenName;
    /**
     * Remove Token Contract Stub
     */
    private sterilizeTokenNameNoStub;
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
