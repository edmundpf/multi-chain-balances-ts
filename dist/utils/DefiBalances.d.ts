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
    getBalances(): Promise<void>;
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
}
