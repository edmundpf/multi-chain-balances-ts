import DefiBalances from './DefiBalances';
import { Token } from './types';
/**
 * Harmony Class
 */
export default class Harmony extends DefiBalances {
    /**
     * Harmony Driver
     */
    harmonyDriver(): Promise<Token[]>;
    /**
     * Get Tokens Info
     */
    private getTokensInfo;
    /**
     * Parse Tokens
     */
    private parseTokens;
    /**
     * Get Vaults Info
     */
    private getVaultsInfo;
    /**
     * Parse Vaults
     */
    private parseVaults;
    /**
     * Get Farm.Army Endpoint
     */
    private getFarmArmyEndpoint;
}
