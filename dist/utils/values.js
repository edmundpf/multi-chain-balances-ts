"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NATIVE_TOKENS = exports.ENDPOINTS = exports.APIS = exports.initChains = void 0;
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
};
// Endpoints
exports.ENDPOINTS = {
    tokenList: 'token_list',
    protocolList: 'complex_protocol_list',
    beefyApy: 'apy/breakdown'
};
// Native Tokens
exports.NATIVE_TOKENS = {
    bsc: 'BNB',
    eth: 'ETH',
    matic: 'MATIC',
};
