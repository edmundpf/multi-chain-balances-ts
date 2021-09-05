"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ONE_DAY = exports.initChains = exports.defaultHistoryRecord = exports.coinGeckoDayCutoffs = exports.coinGeckoLimits = exports.apeBoardCredentials = exports.ENDPOINTS = exports.APIS = exports.DEFAULT_URLS = exports.EXCHANGE_ALIASES = exports.APEBOARD_CHAIN_ALIASES = exports.NATIVE_TOKENS = void 0;
/**
 * Crypto Info
 */
// Native Tokens
exports.NATIVE_TOKENS = {
    bsc: 'BNB',
    eth: 'ETH',
    ftm: 'FTM',
    matic: 'MATIC',
};
// Ape Board Chain Aliases
exports.APEBOARD_CHAIN_ALIASES = {
    bsc: 'bsc',
    eth: 'ethereum',
    ftm: 'fantom',
    matic: 'polygon',
};
// Exchange Aliases
exports.EXCHANGE_ALIASES = {
    dino: ['dinoswap'],
    ape: ['banana'],
};
// Default URL's
exports.DEFAULT_URLS = {
    bsc: 'https://bscscan.com',
    eth: 'https://etherscan.io',
    ftm: 'https://ftmscan.com',
    matic: 'https://polygonscan.com',
};
/**
 * API Info
 */
// API Url's
exports.APIS = {
    beefy: 'https://api.beefy.finance',
    apeBoard: 'https://api.apeboard.finance',
    debank: 'https://openapi.debank.com/v1/user',
    debankPrivate: 'https://api.debank.com',
    coinGecko: 'https://api.coingecko.com/api/v3'
};
// Endpoints
exports.ENDPOINTS = {
    beefyApy: 'apy',
    tokenList: 'token_list',
    protocolList: 'complex_protocol_list',
    debankHistory: 'history/list',
    apeBoardHistory: 'transaction-history',
    coinGeckoList: 'coins/list',
    coinGeckoPrices: 'coins/$id/market_chart',
};
// Ape Board Credentials
exports.apeBoardCredentials = {
    secret: 'U2FsdGVkX19COuJCyW6vO9L8HPHKzedxSbDyJwvCkp+PD3WLM1SbGH4v0gwBiH4xbINmxU67' +
        'QUMSa4nBt0o4sc5xN2DD9mjQ+QjMVkJp568PKmsvfadUKb2Rgm56urKjF6WOY95TjUY/tgNr' +
        '5BGwUw==',
    passCode: '5a102a34f60fa7ec9d643a8a0e72cab9',
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
// Default History Record
exports.defaultHistoryRecord = {
    id: '',
    date: '',
    quoteSymbol: '',
    baseSymbol: 'USD',
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
    chain: 'eth',
    fromAddress: '',
    toAddress: '',
};
/**
 * Init Values
 */
// Init Chain
const initChain = () => {
    return {
        totalValue: 0,
        totalTokenValue: 0,
        totalVaultValue: 0,
        nativeToken: {
            symbol: '',
            amount: 0,
            value: 0,
        },
        tokens: [],
        vaults: [],
        receipts: {},
        transactions: [],
        tokenAddresses: {},
    };
};
// Init Chains
const initChains = () => {
    return {
        bsc: initChain(),
        eth: initChain(),
        ftm: initChain(),
        matic: initChain(),
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
