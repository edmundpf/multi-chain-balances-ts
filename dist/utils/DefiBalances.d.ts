import { APIS, ENDPOINTS } from './values';
import { Chains, Assets } from './types';
/**
 * DefiBalances Class
 */
export default class DefiBalances {
    address: string;
    totalValue: number;
    totalTokenValue: number;
    totalVaultValue: number;
    chains: Chains;
    assets: Assets;
    chainNames: Array<keyof Chains>;
    tokenNames: string[];
    /**
     * Constructor
     */
    constructor();
    /**
     * Get All Balances
     */
    getBalances(): Promise<void>;
    /**
     * Get Endpoint
     */
    getEndpoint(api: keyof typeof APIS, endpoint: keyof typeof ENDPOINTS, params?: any, headers?: any): Promise<any>;
    /**
     * Get Ape Board Endpoint
     */
    getApeBoardEndpoint(endpoint: keyof typeof ENDPOINTS): Promise<any>;
    /**
     * Get Beefy Endpoint
     */
    private getBeefyEndpoint;
    /**
     * Get Debank Endpoint
     */
    private getDebankEndpoint;
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
}
