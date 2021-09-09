/**
 * Internal Data Types
 */
declare type AssetData = {
    value: number;
    apy: number;
    url: string;
    desc: string;
};
declare type TokenRecord = {
    amount: number;
    quantity: number;
    price: number;
};
export declare type StringDict = {
    [index: string]: string;
};
export declare type NumDict = {
    [index: string]: number;
};
export declare type BaseOrQuote = 'base' | 'quote';
export declare type TokenData = {
    symbol: string;
    value: number;
    amount?: number;
};
export declare type PriceData = {
    time: number;
    price: number;
};
export declare type TokenRecords = {
    [index: string]: TokenRecord;
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
export declare type Assets = {
    [index: string]: AssetData;
};
export declare type TokenTimes = {
    [index: string]: number[];
};
export declare type TokenPrices = {
    [index: string]: PriceData[];
};
export declare type Chain = {
    totalValue: number;
    totalTokenValue: number;
    totalVaultValue: number;
    nativeToken: TokenData;
    tokens: TokenData[];
    vaults: VaultData[];
    receipts: NumDict;
    transactions: HistoryRecord[];
    tokenAddresses: StringDict;
};
export declare type Chains = {
    bsc: Chain;
    eth: Chain;
    ftm: Chain;
    matic: Chain;
};
export declare type HistoryRecord = {
    id: string;
    date: string;
    quoteSymbol: string;
    baseSymbol: string;
    feeSymbol: string;
    ticker: string;
    type: 'receive' | 'send' | 'swap' | 'approve' | 'failure';
    direction: 'credit' | 'debit';
    quoteQuantity: number;
    quoteValueUSD: number;
    quotePriceUSD: number;
    baseQuantity: number;
    baseValueUSD: number;
    basePriceUSD: number;
    feeQuantity: number;
    feeValueUSD: number;
    feePriceUSD: number;
    chain: keyof Chains;
    fromAddress: string;
    toAddress: string;
    tokens?: TokenRecords;
};
export declare type DriverArgs = {
    useDebank?: boolean;
    getTransactions?: boolean;
    getPrices?: boolean;
    getBalances?: boolean;
    filterUnknownTokens?: boolean;
    useTempTransactions?: boolean;
};
export declare type InferMultiSwapArgs = {
    absSingleValueUSD: number;
    absMultiValueUSD: number;
    singleIsBase: boolean;
    transactionCount: number;
    ineligibleCount: number;
    ineligibleTotal: number;
    ineligibleIndexes: number[];
    transactions: HistoryRecord[];
};
export declare type TransactionsFile = {
    [index: string]: {
        transactions: HistoryRecord[];
        tokenAddresses: StringDict;
    };
};
export declare type MainRequest = Token[] | Protocol[] | NumDict | void;
/**
 * Debank Types
 */
declare type PortfolioItemList = {
    detail: {
        supply_token_list: Token[];
    };
    stats: {
        net_usd_value: number;
    };
};
declare type DebankTransactionInfo = {
    eth_gas_fee: number;
    usd_gas_fee: number;
    to_addr: string;
    from_addr: string;
    name: string;
};
export declare type DebankTokens = {
    [index: string]: {
        symbol: string;
    };
};
export declare type DebankTransfer = {
    amount: number;
    to_addr?: string;
    from_addr?: string;
    token_id: string;
};
export declare type Token = {
    chain: keyof Chains;
    symbol: string;
    price: number;
    amount: number;
};
export declare type Protocol = {
    chain: keyof Chains;
    name: string;
    site_url: string;
    portfolio_item_list: PortfolioItemList[];
};
export declare type DebankTransResponse = {
    data: {
        history_list: DebankHistory[];
        token_dict: DebankTokens;
        project_dict: any;
        cate_dict: any;
    };
};
export declare type DebankHistory = {
    id: string;
    cate_id?: string;
    other_addr: string;
    time_at: number;
    sends: DebankTransfer[];
    receives: DebankTransfer[];
    tx?: DebankTransactionInfo;
};
/**
 * Ape Board Types
 */
declare type ApeBoardInteraction = {
    from: string;
    to: string;
    function?: string;
};
declare type ApeBoardFee = {
    amount: number;
    price: number;
    symbol: string;
};
export declare type ApeBoardTransfer = {
    from: string;
    to: string;
    symbol: string;
    tokenAddress: string;
    balance: number;
    type: 'in' | 'out';
};
export declare type ApeBoardHistory = {
    hash: string;
    timestamp: number;
    transfers: ApeBoardTransfer[];
    interactions: ApeBoardInteraction[];
    fee: ApeBoardFee[];
};
export declare type ApeBoardTransResponse = ApeBoardHistory[];
/**
 * Coin Gecko Types
 */
export declare type CoinGeckoToken = {
    id: string;
    symbol: string;
    name: string;
};
export declare type CoinGeckoPricesResponse = {
    prices: number[][];
};
/**
 * Local DB Types
 */
export declare type LocalPriceData = PriceData & {
    symbol: string;
};
export {};
