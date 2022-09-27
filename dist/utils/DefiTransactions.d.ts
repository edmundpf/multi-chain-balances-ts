import DefiBalances from './DefiBalances';
/**
 * DefiTransactions Class
 */
export default class DefiTransactions extends DefiBalances {
    /**
     * Get Transactions
     */
    getTransactions(showAll?: boolean): Promise<void>;
    /**
     * Get Unknown Tokens
     */
    getUnknownTokens(): void;
    /**
     * Get Existing Token Addresses
     */
    private getExistingTokenAddresses;
    /**
     * Sync Contract Addresses
     */
    private syncContractAddresses;
    /**
     * Sterilize History Record
     */
    private sterilizeHistoryRecord;
    /**
     * Split History Record
     */
    private splitHistoryRecord;
    /**
     * Get Token Addresses
     */
    private getTokenAddresses;
    /**
     * Get Token Name
     */
    private getTokenName;
    /**
     * Sterilize Debank Transfer
     */
    private sterilizeDebankTransfer;
    /**
     * Sterilize Transaction Type
     */
    private sterilizeTransactionType;
    /**
     * Get Transaction ID
     */
    private getTransactionID;
}
