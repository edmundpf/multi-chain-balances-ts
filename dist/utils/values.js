"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAVED_VAULTS_FILE = exports.ONE_DAY = exports.initChains = exports.slippageConfig = exports.stableCoinConfig = exports.DEFAULT_DB_FILE = exports.DEFAULT_MIN_VALUE = exports.defaultHistoryRecord = exports.defaultDriverArgs = exports.coinGeckoDayCutoffs = exports.coinGeckoLimits = exports.ENDPOINTS = exports.APIS = exports.BEEFY_VAULT_URLS = exports.DEFAULT_URLS = exports.NATIVE_TOKENS = exports.FIAT_CURRENCY = void 0;
/**
 * Fiat Currency
 */
exports.FIAT_CURRENCY = 'USD';
/**
 * Crypto Info
 */
// Native Tokens
exports.NATIVE_TOKENS = {
    avax: 'AVAX',
    bsc: 'BNB',
    cro: 'CRO',
    eth: 'ETH',
    ftm: 'FTM',
    matic: 'MATIC',
    movr: 'MOVR',
    hmy: 'ONE',
};
// Default URL's
exports.DEFAULT_URLS = {
    avax: 'https://cchain.explorer.avax.network',
    bsc: 'https://bscscan.com',
    cro: 'https://cronos.crypto.org',
    eth: 'https://etherscan.io',
    ftm: 'https://ftmscan.com',
    matic: 'https://polygonscan.com',
    movr: 'https://moonriver.moonscan.io',
    hmy: 'https://explorer.harmony.one',
};
// Beefy Vault URL's
exports.BEEFY_VAULT_URLS = {
    avax: 'avalanche',
    bsc: 'bsc',
    cro: 'cronos',
    frm: 'fantom',
    matic: 'polygon',
    movr: 'moonriver',
    hmy: 'harmony',
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
        matic: initChain('matic'),
        movr: initChain('movr'),
        hmy: initChain('hmy'),
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
// One Day
exports.ONE_DAY = 24 * ONE_HOUR;
// Saved Vaults File
exports.SAVED_VAULTS_FILE = 'saved_vaults.json';
