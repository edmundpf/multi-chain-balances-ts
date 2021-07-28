"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_URL = exports.exchangeAliases = exports.apeBoardCredentials = exports.NATIVE_TOKENS = exports.ENDPOINTS = exports.APIS = exports.initChains = void 0;
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
        receipts: {}
    };
};
// Init Chains
const initChains = () => {
    return {
        bsc: initChain(),
        eth: initChain(),
        matic: initChain()
    };
};
exports.initChains = initChains;
// API Url's
exports.APIS = {
    debank: 'https://openapi.debank.com/v1/user',
    beefy: 'https://api.beefy.finance',
    apeBoard: 'https://api.apeboard.finance'
};
// Endpoints
exports.ENDPOINTS = {
    tokenList: 'token_list',
    protocolList: 'complex_protocol_list',
    beefyApy: 'apy',
    beefyBsc: 'beefyBsc',
    beefyPolygon: 'beefyPolygon'
};
// Native Tokens
exports.NATIVE_TOKENS = {
    bsc: 'BNB',
    eth: 'ETH',
    matic: 'MATIC',
};
// Ape Board Credentials
exports.apeBoardCredentials = {
    secret: ('U2FsdGVkX19COuJCyW6vO9L8HPHKzedxSbDyJwvCkp+PD3WLM1SbGH4v0gwBiH4xbINmxU67' +
        'QUMSa4nBt0o4sc5xN2DD9mjQ+QjMVkJp568PKmsvfadUKb2Rgm56urKjF6WOY95TjUY/tgNr' +
        '5BGwUw=='),
    passCode: '5a102a34f60fa8ec9d643e8a0e72cab9'
};
// Aliases
exports.exchangeAliases = {
    dino: ['dinoswap'],
    ape: ['banana'],
};
// Default URL
exports.DEFAULT_URL = 'https://bscscan.com';
