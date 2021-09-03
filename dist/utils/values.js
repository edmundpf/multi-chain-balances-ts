"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHistoryRecord = exports.DEFAULT_URLS = exports.exchangeAliases = exports.apeBoardCredentials = exports.CHAIN_ALIASES = exports.NATIVE_TOKENS = exports.ENDPOINTS = exports.APIS = exports.initTrans = exports.initChains = void 0;
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
// Init Trans
const initTrans = () => {
    return {
        bsc: [],
        eth: [],
        ftm: [],
        matic: [],
    };
};
exports.initTrans = initTrans;
// API Url's
exports.APIS = {
    debank: 'https://openapi.debank.com/v1/user',
    beefy: 'https://api.beefy.finance',
    apeBoard: 'https://api.apeboard.finance',
    defiTaxes: 'https://defitaxes.us',
};
// Endpoints
exports.ENDPOINTS = {
    tokenList: 'token_list',
    protocolList: 'complex_protocol_list',
    beefyApy: 'apy',
    defiTaxesProcess: 'process',
    transactionHistoryBsc: 'transaction-history/bsc',
    transactionHistoryEth: 'transaction-history/eth',
    transactionHistoryMatic: 'transaction-history/matic',
};
// Native Tokens
exports.NATIVE_TOKENS = {
    bsc: 'BNB',
    eth: 'ETH',
    ftm: 'FTM',
    matic: 'MATIC',
};
// Chain Aliases
exports.CHAIN_ALIASES = {
    bsc: 'BSC',
    eth: 'ETH',
    ftm: 'FTM',
    matic: 'Polygon',
};
// Ape Board Credentials
exports.apeBoardCredentials = {
    secret: 'U2FsdGVkX19COuJCyW6vO9L8HPHKzedxSbDyJwvCkp+PD3WLM1SbGH4v0gwBiH4xbINmxU67' +
        'QUMSa4nBt0o4sc5xN2DD9mjQ+QjMVkJp568PKmsvfadUKb2Rgm56urKjF6WOY95TjUY/tgNr' +
        '5BGwUw==',
    passCode: '5a102a34f60fa7ec9d643a8a0e72cab9',
};
// Aliases
exports.exchangeAliases = {
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
// Default History Record
exports.defaultHistoryRecord = {
    id: '',
    date: '',
    ticker: '',
    quote: '',
    base: 'USD',
    type: '',
    direction: 'buy',
    quantity: 0,
    amount: 0,
    price: 0,
    baseQuantity: 0,
    baseAmount: 0,
    basePrice: 1,
    fills: 0,
    fees: 0,
    feeQuantity: 0,
    feePrice: 0,
    feeToken: '',
    chain: 'bsc',
    fromAddress: '',
    toAddress: '',
    taxable: true,
};
