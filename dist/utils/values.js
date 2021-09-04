"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initChains = exports.defaultHistoryRecord = exports.apeBoardCredentials = exports.ENDPOINTS = exports.APIS = exports.DEFAULT_URLS = exports.EXCHANGE_ALIASES = exports.APEBOARD_CHAIN_ALIASES = exports.NATIVE_TOKENS = void 0;
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
    debank: 'https://openapi.debank.com/v1/user',
    debankPrivate: 'https://api.debank.com',
    beefy: 'https://api.beefy.finance',
    apeBoard: 'https://api.apeboard.finance',
    defiTaxes: 'https://defitaxes.us',
};
// Endpoints
exports.ENDPOINTS = {
    beefyApy: 'apy',
    tokenList: 'token_list',
    protocolList: 'complex_protocol_list',
    debankHistory: 'history/list',
    apeBoardHistory: 'transaction-history'
};
// Ape Board Credentials
exports.apeBoardCredentials = {
    secret: 'U2FsdGVkX19COuJCyW6vO9L8HPHKzedxSbDyJwvCkp+PD3WLM1SbGH4v0gwBiH4xbINmxU67' +
        'QUMSa4nBt0o4sc5xN2DD9mjQ+QjMVkJp568PKmsvfadUKb2Rgm56urKjF6WOY95TjUY/tgNr' +
        '5BGwUw==',
    passCode: '5a102a34f60fa7ec9d643a8a0e72cab9',
};
/**
 * Default Values
 */
// Default History Record
exports.defaultHistoryRecord = {
    id: '',
    date: '',
    ticker: '',
    quote: '',
    base: 'USD',
    type: '',
    direction: '',
    quantity: 0,
    amount: 0,
    price: 0,
    baseQuantity: 0,
    baseAmount: 0,
    basePrice: 1,
    fees: 0,
    feeQuantity: 0,
    feePrice: 0,
    feeToken: '',
    chain: 'bsc',
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
