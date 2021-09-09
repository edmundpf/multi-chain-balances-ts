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
    unknownTokens: string[];
    /**
     * Constructor
     */
    constructor(address?: string);
    /**
     * Get All Balances
     */
    getBalances(): Promise<void>;
    /**
     * Get Assets & Total Values
     */
    getAssetsAndTotalValues(): void;
    /**
     * Get Endpoint
     */
    getEndpoint(api: keyof typeof APIS, endpoint: keyof typeof ENDPOINTS, params?: any, headers?: any): Promise<any>;
    /**
     * Get Ape Board Endpoint
     */
    getApeBoardEndpoint(endpoint: keyof typeof ENDPOINTS): Promise<any>;
    /**
     * Is Stable Coin
     */
    isStableCoin(tokenName: string, price: number): boolean;
    /**
     * Is Native Token
     */
    isNativeToken(tokenName: string): boolean;
    /**
     * Is Unknown Token
     */
    isUnknownToken(symbol: string, chainName?: keyof Chains): boolean;
    /**
     * Sterilize Token Name
     */
    sterilizeTokenName(token: string): string;
    /**
     * Remove Token Contract Stub
     */
    sterilizeTokenNameNoStub(tokenName: string, chainName: keyof Chains): string;
    /**
     * Get Address Stub
     */
    getAddressStub(address: string): string;
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
