"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDebankHeaders = exports.ONE_DAY = exports.initChains = exports.slippageConfig = exports.stableCoinConfig = exports.DEFAULT_DB_FILE = exports.DEFAULT_MIN_VALUE = exports.defaultHistoryRecord = exports.defaultDriverArgs = exports.coinGeckoDayCutoffs = exports.coinGeckoLimits = exports.ENDPOINTS = exports.APIS = exports.DEFAULT_URLS = exports.NATIVE_TOKENS = exports.FIAT_CURRENCY = void 0;
/**
 * Crypto Info
 */
// Fiat Currency
exports.FIAT_CURRENCY = 'USD';
// Native Tokens
exports.NATIVE_TOKENS = {
    avax: 'AVAX',
    bsc: 'BNB',
    cro: 'CRO',
    eth: 'ETH',
    ftm: 'FTM',
    hmy: 'ONE',
    matic: 'MATIC',
    metis: 'METIS',
    movr: 'MOVR',
    op: 'ETH',
};
// Default URL's
exports.DEFAULT_URLS = {
    avax: 'https://cchain.explorer.avax.network',
    bsc: 'https://bscscan.com',
    cro: 'https://cronos.crypto.org',
    eth: 'https://etherscan.io',
    ftm: 'https://ftmscan.com',
    hmy: 'https://explorer.harmony.one',
    matic: 'https://polygonscan.com',
    metis: 'https://andromeda-explorer.metis.io',
    movr: 'https://moonriver.moonscan.io',
    op: 'https://optimistic.etherscan.io',
};
/**
 * API Info
 */
// API Url's
exports.APIS = {
    beefy: 'https://api.beefy.finance',
    debank: 'https://api.debank.com',
    coinGecko: 'https://api.coingecko.com/api/v3',
    githubVaults: 'https://raw.githubusercontent.com/beefyfinance/beefy-app/prod/src/features/configure/vault',
};
// Endpoints
exports.ENDPOINTS = {
    beefyApy: 'apy',
    beefyVaults: 'vaults',
    tokenList: 'token/balance_list',
    protocolList: 'portfolio/project_list',
    history: 'history/list',
    coinGeckoList: 'coins/list',
    coinGeckoPrices: 'coins/$id/market_chart',
};
// Coin Gecko Limits
exports.coinGeckoLimits = {
    calls: 10,
    ms: 12.5 * 1000,
};
// Coin Gecko Day Cutoffs
exports.coinGeckoDayCutoffs = [1, 90];
/**
 * Default Values
 */
// Default Driver Args
exports.defaultDriverArgs = {
    getTransactions: true,
    getPrices: true,
    getBalances: true,
    filterUnknownTokens: true,
    showAllTransactions: false,
};
// Default History Record
exports.defaultHistoryRecord = {
    id: '',
    time: '',
    quoteSymbol: '',
    baseSymbol: exports.FIAT_CURRENCY,
    feeSymbol: '',
    ticker: '',
    type: 'failure',
    direction: 'debit',
    quoteQuantity: 0,
    quoteValueUSD: 0,
    quotePriceUSD: 0,
    baseQuantity: 0,
    baseValueUSD: 0,
    basePriceUSD: 1,
    feeQuantity: 0,
    feeValueUSD: 0,
    feePriceUSD: 0,
    blockchain: 'eth',
    fromAddress: '',
    toAddress: '',
};
// Default Minimum Value
exports.DEFAULT_MIN_VALUE = 0.05;
// Default Database File
exports.DEFAULT_DB_FILE = '.sqlite-data/defi-prices.db';
// Stablecoin Config
exports.stableCoinConfig = {
    otherCoins: ['DAI'],
    errorPercent: 0.03,
};
// Slippage Config
exports.slippageConfig = {
    low: 0.002,
    high: 0.01,
};
/**
 * Init Values
 */
// Init Chain
const initChain = (chainName) => {
    return {
        totalValue: 0,
        totalTokenValue: 0,
        totalVaultValue: 0,
        nativeToken: {
            symbol: exports.NATIVE_TOKENS[chainName],
            amount: 0,
            value: 0,
        },
        tokens: [],
        vaults: [],
        transactions: [],
        tokenAddresses: {},
    };
};
// Init Chains
const initChains = () => {
    return {
        avax: initChain('avax'),
        bsc: initChain('bsc'),
        cro: initChain('cro'),
        eth: initChain('eth'),
        ftm: initChain('ftm'),
        hmy: initChain('hmy'),
        matic: initChain('matic'),
        metis: initChain('metis'),
        movr: initChain('movr'),
        op: initChain('op'),
    };
};
exports.initChains = initChains;
/**
 * Misc
 */
// One Second
const ONE_SECOND = 1000;
// One Minute
const ONE_MINUTE = 60 * ONE_SECOND;
// One Hour
const ONE_HOUR = 60 * ONE_MINUTE;
// Default Debank Headers
const defaultDebankHeaders = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    account: '{"random_at":1627578821,"random_id":"be0e50eb9b94458eb42b5bef871a0c16","session_id":"705c8a29fd9141d4a360dc7a8a8ac52e","user_addr":"__ADDR__","wallet_type":"metamask","is_verified":true}',
    'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    source: 'web',
    'x-api-nonce': 'n_IwdUUGPS0Dr9SX9TRwRcly7gTRLXLQc8T3CRxXxg',
    'x-api-sign': 'fa673a8daa21d7bd5cc3ce30718a636f4ea7d2e0dd9170f61b22466b62eede44',
    'x-api-ts': '0',
    'x-api-ver': 'v2',
    referer: 'https://debank.com/',
    origin: 'https://debank.com',
    authority: 'api.debank.com',
};
// One Day
exports.ONE_DAY = 24 * ONE_HOUR;
// Get Debank Headers
const getDebankHeaders = (address) => (Object.assign(Object.assign({}, defaultDebankHeaders), { account: defaultDebankHeaders.account.replace('__ADDR__', address), 'x-api-ts': String(new Date().getTime()) }));
exports.getDebankHeaders = getDebankHeaders;
