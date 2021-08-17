import { Chains, ApeBoardPositions, Assets } from './types';
/**
 * MultiChain Class
 */
export default class MultiChain {
    address: string;
    totalValue: number;
    totalTokenValue: number;
    totalVaultValue: number;
    chains: Chains;
    transactions: import("./types").Transactions;
    assets: Assets;
    chainNames: Array<keyof Chains>;
    tokenNames: string[];
    /**
     * Constructor
     */
    constructor();
    /**
     * Driver
     */
    driver(): Promise<void>;
    /**
     * Parse Token Data
     */
    private parseTokenData;
    /**
     * Parse Protocol Data
     */
    private parseProtocolData;
    /**
     * Parse APY Data
     */
    private parseApyData;
    /**
     * Parse Chain Data
     */
    private parseChainData;
    /**
     * Get Token List
     */
    private getTokenList;
    /**
     * Get Protocol List
     */
    private getProtocolList;
    /**
     * Get Beefy APY
     */
    private getBeefyApy;
    /**
     * Get Ape Board Positions
     */
    getApeBoardPositions(): Promise<ApeBoardPositions>;
    /**
     * Get All Transactions
     */
    getAllTransactions(useReq?: boolean): Promise<void>;
    /**
     * Get Endpoint
     */
    private getEndpoint;
    /**
     * Get Debank Endpoint
     */
    private getDebankEndpoint;
    /**
     * Get Beefy Endpoint
     */
    private getBeefyEndpoint;
    /**
     * Get Ape Board Endpoint
     */
    private getApeBoardEndpoint;
    /**
     * Get Defi Taxes Endpoint
     */
    private getDefiTaxesEndpoint;
    /**
     * Round Number
     */
    private roundNumber;
}
