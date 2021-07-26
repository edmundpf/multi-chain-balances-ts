import { Chains } from './types';
/**
 * MultiChain Class
 */
export default class MultiChain {
    address: string;
    totalValue: number;
    totalTokenValue: number;
    totalVaultValue: number;
    chains: Chains;
    assets: {
        [key: string]: number;
    };
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
     * Parse Beefy APY Data
     */
    private parseBeefyApyData;
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
}
