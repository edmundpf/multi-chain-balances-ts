import { Chain, Chains, HistoryRecord, DriverArgs } from './types'

/**
 * Fiat Currency
 */

export const FIAT_CURRENCY = 'USD'

/**
 * Crypto Info
 */

// Native Tokens

export const NATIVE_TOKENS = {
	avax: 'AVAX',
	bsc: 'BNB',
	cro: 'CRO',
	eth: 'ETH',
	ftm: 'FTM',
	matic: 'MATIC',
	movr: 'MOVR',
	hmy: 'ONE',
}

// Token Aliases

export const TOKEN_ALIASES: any = {
	mai: 'mimatic',
	mimatic: 'mai',
}

// Receipt Aliases

export const RECEIPT_ALIASES: any = {
	curveren: ['amwbtc', 'renbtc'],
	fugue: ['usdc', 'ust', 'mim'],
	beetgod: ['dei', 'usdc'],
	av3crv: ['mai', 'dai', 'usdc', 'usdt'],
	abrcdbr: ['mim', 'usdt', 'usdc'],
	hector: ['tor', 'dai', 'usdc'],
}

// Default URL's

export const DEFAULT_URLS = {
	avax: 'https://cchain.explorer.avax.network',
	bsc: 'https://bscscan.com',
	cro: 'https://cronos.crypto.org',
	eth: 'https://etherscan.io',
	ftm: 'https://ftmscan.com',
	matic: 'https://polygonscan.com',
	movr: 'https://moonriver.moonscan.io',
	hmy: 'https://explorer.harmony.one',
}

// Beefy Vault URL's

export const BEEFY_VAULT_URLS = {
	avax: 'avalanche',
	bsc: 'bsc',
	cro: 'cronos',
	frm: 'fantom',
	matic: 'polygon',
	movr: 'moonriver',
	hmy: 'harmony',
}

/**
 * API Info
 */

// API Url's

export const APIS = {
	beefy: 'https://api.beefy.finance',
	debank: 'https://openapi.debank.com/v1/user',
	debankPrivate: 'https://api.debank.com',
	coinGecko: 'https://api.coingecko.com/api/v3',
	githubVaults:
		'https://raw.githubusercontent.com/beefyfinance/beefy-app/prod/src/features/configure/vault',
}

// Endpoints

export const ENDPOINTS = {
	beefyApy: 'apy',
	beefyVaults: 'vaults',
	tokenList: 'token_list',
	protocolList: 'complex_protocol_list',
	debankHistory: 'history/list',
	coinGeckoList: 'coins/list',
	coinGeckoPrices: 'coins/$id/market_chart',
}

// Coin Gecko Limits

export const coinGeckoLimits = {
	calls: 10,
	ms: 12.5 * 1000,
}

// Coin Gecko Day Cutoffs

export const coinGeckoDayCutoffs = [1, 90]

/**
 * Default Values
 */

// Default Driver Args

export const defaultDriverArgs: DriverArgs = {
	getTransactions: true,
	getPrices: true,
	getBalances: true,
	filterUnknownTokens: true,
}

// Default History Record

export const defaultHistoryRecord: HistoryRecord = {
	id: '',
	time: '',
	quoteSymbol: '',
	baseSymbol: FIAT_CURRENCY,
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
}

// Default Minimum Value

export const DEFAULT_MIN_VALUE = 0.05

// Default Database File

export const DEFAULT_DB_FILE = '.sqlite-data/defi-prices.db'

// Stablecoin Config

export const stableCoinConfig = {
	otherCoins: ['DAI'],
	errorPercent: 0.03,
}

// Slippage Config

export const slippageConfig = {
	low: 0.002,
	high: 0.01,
}

/**
 * Init Values
 */

// Init Chain

const initChain = (chainName: keyof Chains) => {
	return {
		totalValue: 0,
		totalTokenValue: 0,
		totalVaultValue: 0,
		nativeToken: {
			symbol: NATIVE_TOKENS[chainName],
			amount: 0,
			value: 0,
		},
		tokens: [],
		vaults: [],
		receipts: {},
		transactions: [],
		tokenAddresses: {},
	} as Chain
}

// Init Chains

export const initChains = () => {
	return {
		avax: initChain('avax'),
		bsc: initChain('bsc'),
		cro: initChain('cro'),
		eth: initChain('eth'),
		ftm: initChain('ftm'),
		matic: initChain('matic'),
		movr: initChain('movr'),
		hmy: initChain('hmy'),
	} as Chains
}

/**
 * Misc
 */

// One Second

const ONE_SECOND = 1000

// One Minute

const ONE_MINUTE = 60 * ONE_SECOND

// One Hour

const ONE_HOUR = 60 * ONE_MINUTE

// One Day

export const ONE_DAY = 24 * ONE_HOUR

// Saved Vaults File

export const SAVED_VAULTS_FILE = 'saved_vaults.json'
