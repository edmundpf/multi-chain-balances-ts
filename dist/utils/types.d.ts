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
export declare type Transactions = {
    bsc: HistoryRecord[];
    eth: HistoryRecord[];
    ftm: HistoryRecord[];
    matic: HistoryRecord[];
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
    ftm: Chain;
    matic: Chain;
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
declare type ApeBoardHistory = {
    hash: string;
    from: string;
    to: string;
    function: string;
    fee: number;
    timestamp: number;
    nativePrice?: number;
    transfers: ApeBoardTransfer[];
};
declare type ApeBoardTransfer = {
    from: string;
    to: string;
    symbol: string;
    tokenAddress: string;
    logo?: string;
    balance: number;
};
export declare type ApeBoardTransResponse = {
    histories: ApeBoardHistory[];
};
/**
 * Defi Taxes Types
 */
export declare type DefiTransaction = {
    hash: string;
    type?: string;
    ts: string;
    rate_inferred: string | false;
    rate_adjusted: number | false;
    classification_certainty: number;
    rows: DefiRow[];
};
export declare type DefiRow = {
    to?: string;
    from: string;
    token_name: string;
    token_contract?: string;
    value: number;
    rate?: number;
    treatment: string;
    good_rate: number;
};
/**
 * Misc
 */
export declare type MainRequest = Token[] | Protocol[] | NumDict | void;
export declare type HistoryRecord = {
    id: string;
    date: string;
    ticker: string;
    quote: string;
    base: string;
    type: string;
    direction: string;
    amount: number;
    quantity: number;
    price: number;
    baseAmount: number;
    baseQuantity: number;
    basePrice: number;
    fills: number;
    fees: number;
    feeQuantity: number;
    feePrice: number;
    feeToken: string;
    chain: keyof Chains;
    fromAddress: string;
    toAddress: string;
    taxable: boolean;
};
export declare type TokenRecord = {
    amount: number;
    quantity: number;
    price: number;
    fills: number;
};
export declare type TokenRecords = {
    [index: string]: TokenRecord;
};
export declare type HashRecords = {
    [index: string]: TokenRecords;
};
export {};
