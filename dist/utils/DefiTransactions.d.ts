import DefiBalances from './DefiBalances';
/**
 * DefiTransactions Class
 */
export default class DefiTransactions extends DefiBalances {
    transactions: import("./types").Transactions;
    /**
     * Get Transactions
     */
    getTransactions(): Promise<void>;
    /**
     * Get Defi Taxes Endpoint
     */
    private getDefiTaxesEndpoint;
}
