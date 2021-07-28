/**
 * Data Types
 */
export declare type NumDict = {
    [index: string]: number;
};
export declare type TokenData = {
    symbol: string;
    value: number;
    amount?: number;
};
export declare type VaultData = TokenData & {
    platform: string;
    platformUrl: string;
    apy?: number;
    beefyVaultName?: string;
    beefyReceiptName?: string;
    beefyReceiptAmount?: number;
    tokens: TokenData[];
};
declare type AssetData = {
    value: number;
    apy: number;
    url: string;
    desc: string;
};
export declare type Assets = {
    [index: string]: AssetData;
};
export declare type Chain = {
    totalValue: number;
    totalTokenValue: number;
    totalVaultValue: number;
    nativeToken: TokenData;
    tokens: TokenData[];
    vaults: VaultData[];
    receipts: NumDict;
};
export declare type Chains = {
    bsc: Chain;
    eth: Chain;
    matic: Chain;
};
export declare type ApeBoardPosition = {
    amount: number;
    value: number;
    tokens: string[];
};
export declare type ApeBoardPositions = {
    bsc: ApeBoardPosition[];
    eth: ApeBoardPosition[];
    matic: ApeBoardPosition[];
};
/**
 * Debank Types
 */
export declare type Token = {
    chain: keyof Chains;
    symbol: string;
    price: number;
    amount: number;
};
declare type PortfolioItemList = {
    detail: {
        supply_token_list: Token[];
    };
    stats: {
        net_usd_value: number;
    };
};
export declare type Protocol = {
    chain: keyof Chains;
    name: string;
    site_url: string;
    portfolio_item_list: PortfolioItemList[];
};
/**
 * Ape Board Types
 */
declare type ApeBoardToken = {
    symbol: string;
    price: string;
    balance: number;
};
declare type ApeBoardVault = {
    balance: number;
    tokens: ApeBoardToken[];
};
export declare type ApeBoardResponse = {
    positions: ApeBoardVault[];
};
/**
 * Misc
 */
export declare type MainRequest = Token[] | Protocol[] | ApeBoardPositions | NumDict;
export {};
