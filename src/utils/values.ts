import { Chain, Chains, HistoryRecord } from './types'

/**
 * Crypto Info
 */

// Native Tokens

export const NATIVE_TOKENS = {
	bsc: 'BNB',
	eth: 'ETH',
	ftm: 'FTM',
	matic: 'MATIC',
}

// Ape Board Chain Aliases

export const APEBOARD_CHAIN_ALIASES = {
	bsc: 'bsc',
	eth: 'ethereum',
	ftm: 'fantom',
	matic: 'polygon',
}

// Exchange Aliases

export const EXCHANGE_ALIASES = {
	dino: ['dinoswap'],
	ape: ['banana'],
}

// Default URL's

export const DEFAULT_URLS = {
	bsc: 'https://bscscan.com',
	eth: 'https://etherscan.io',
	ftm: 'https://ftmscan.com',
	matic: 'https://polygonscan.com',
}

/**
 * API Info
 */

// API Url's

export const APIS = {
	debank: 'https://openapi.debank.com/v1/user',
	debankPrivate: 'https://api.debank.com',
	beefy: 'https://api.beefy.finance',
	apeBoard: 'https://api.apeboard.finance',
	defiTaxes: 'https://defitaxes.us',
}

// Endpoints

export const ENDPOINTS = {
	beefyApy: 'apy',
	tokenList: 'token_list',
	protocolList: 'complex_protocol_list',
	debankHistory: 'history/list',
	apeBoardHistory: 'transaction-history',
}

// Ape Board Credentials

export const apeBoardCredentials = {
	secret:
		'U2FsdGVkX19COuJCyW6vO9L8HPHKzedxSbDyJwvCkp+PD3WLM1SbGH4v0gwBiH4xbINmxU67' +
		'QUMSa4nBt0o4sc5xN2DD9mjQ+QjMVkJp568PKmsvfadUKb2Rgm56urKjF6WOY95TjUY/tgNr' +
		'5BGwUw==',
	passCode: '5a102a34f60fa7ec9d643a8a0e72cab9',
}

/**
 * Default Values
 */

// Default History Record

export const defaultHistoryRecord: HistoryRecord = {
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
}

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
	} as Chain
}

// Init Chains

export const initChains = () => {
	return {
		bsc: initChain(),
		eth: initChain(),
		ftm: initChain(),
		matic: initChain(),
	} as Chains
}
