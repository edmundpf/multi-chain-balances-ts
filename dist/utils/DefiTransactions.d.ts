import DefiBalances from './DefiBalances';
/**
 * DefiTransactions Class
 */
export default class DefiTransactions extends DefiBalances {
    transactions: import("./types").Transactions;
    /**
     * Get Transactions
     */
    getTransactions(useReq?: boolean): Promise<void>;
    /**
     * Get Defi Taxes Endpoint
     */
    private getDefiTaxesEndpoint;
}
