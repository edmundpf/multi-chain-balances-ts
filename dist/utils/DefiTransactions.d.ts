import DefiBalances from './DefiBalances';
/**
 * DefiTransactions Class
 */
export default class DefiTransactions extends DefiBalances {
    /**
     * Get Transactions
     */
    getTransactions(useDebank?: boolean): Promise<void>;
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
     * Sterilize Ape Board Transfer
     */
    private sterilizeApeBoardTransfer;
    /**
     * Sterilize Debank Transfer
     */
    private sterilizeDebankTransfer;
    /**
     * Sterilize Transaction Type
     */
    private sterilizeTransactionType;
    /**
     * Add Contract
     */
    private addContract;
    /**
     * Get Private Debank Endpoint
     */
    private getPrivateDebankEndpoint;
    /**
     * Get Transaction ID
     */
    private getTransactionID;
    /**
     * Is Contract
     */
    private isContract;
    /**
     * Dashed Symbol
     */
    private symbolWithDashes;
}
