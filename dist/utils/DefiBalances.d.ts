import { Chains, Assets } from './types';
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
    private getAssetsAndTotalValues;
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
     * Parse ApeBoard Tokens
     */
    private parseApeboardTokens;
    /**
     * Parse ApeBoard Vaults
     */
    private parseApeboardVaults;
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
     * Get Terra Tokens and Vaults
     */
    private getTerraTokensAndVaults;
    /**
     * Parse Terra Tokens
     */
    private parseTerraTokens;
    /**
     * Parse Solana Vaults
     */
    private parseTerraVaults;
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
}
