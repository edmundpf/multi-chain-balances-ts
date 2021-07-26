import { Chain, Chains } from './types'

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
	} as Chain
}

// Init Chains

export const initChains = () => {
	return {
		bsc: initChain(),
		eth: initChain(),
		matic: initChain()
	} as Chains
}

// API Url's

export const APIS = {
	debank: 'https://openapi.debank.com/v1/user',
	beefy: 'https://api.beefy.finance',
}

// Endpoints

export const ENDPOINTS = {
	tokenList: 'token_list',
	protocolList: 'complex_protocol_list',
	beefyApy: 'apy/breakdown'
}

// Native Tokens

export const NATIVE_TOKENS = {
	bsc: 'BNB',
	eth: 'ETH',
	matic: 'MATIC',
}
