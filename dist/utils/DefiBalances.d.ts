import { APIS, ENDPOINTS } from './values';
import { Chains, Assets, TokenAddresses } from './types';
/**
 * DefiBalances Class
 */
export default class DefiBalances {
    address: string;
    isEVM: boolean;
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
    getBalances(filterUnkownTokens?: boolean): Promise<void>;
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
     * Remove Token Contract Stub
     */
    sterilizeTokenNameNoStub(tokenName: string): string;
    /**
     * Add Contract
     */
    addContract(symbols: TokenAddresses, symbol: string, address: string): void;
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
    isUnknownToken(symbol: string): boolean;
    /**
     * Sterilize Token Name
     */
    sterilizeTokenName(token: string): string;
    /**
     * Get Address Stub
     */
    getAddressStub(address: string): string;
    /**
     * Is Contract
     */
    isContract(address: string): boolean;
    /**
     * Dashed Symbol
     */
    symbolWithDashes(symbol: string): string;
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
     * Get Beefy Vaults
     */
    private getBeefyVaults;
    /**
     * Get Solana Tokens and Vaults
     */
    private getSolanaTokensAndVaults;
    /**
     * Parse Solana Tokens
     */
    private parseSolanaTokens;
    /**
     * Parse Solana Vaults
     */
    private parseSolanaVaults;
    /**
     * Get Harmony Tokens and Vaults
     */
    private getHarmonyTokensAndVaults;
    /**
     * Parse Harmony Tokens
     */
    private parseHarmonyTokens;
    /**
     * Parse Harmony Vaults
     */
    private parseHarmonyVaults;
    /**
     * Get Beefy Endpoint
     */
    private getBeefyEndpoint;
    /**
     * Get Debank Endpoint
     */
    private getDebankEndpoint;
    /**
     * Get Farm.Army Endpoint
     */
    private getFarmArmyEndpoint;
    /**
     * Get Token List
     */
    private getTokenList;
    /**
     * Get Known Token List
     */
    private getKnownTokenList;
    /**
     * Get Protocol List
     */
    private getProtocolList;
    /**
     * Get Beefy APY
     */
    private getBeefyApy;
    /**
     * Get Harmony Tokens Info
     */
    private getHarmonyTokensInfo;
    /**
     * Get Harmony Vaults Info
     */
    private getHarmonyVaultsInfo;
    /**
     * Get Solana Tokens Info
     */
    private getSolanaTokensInfo;
    /**
     * Get Solana Vaults Info
     */
    private getSolanaVaultsInfo;
}
