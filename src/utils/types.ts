/**
 * Internal Data Types
 */

// Asset Data Type

type AssetData = {
	value: number
	apy: number
	url: string
	desc: string
}

// Token Record Type

type TokenRecord = {
	amount: number
	quantity: number
	price: number
}

// String Dict Type

export type StringDict = {
	[index: string]: string
}

// Numeric Dict Type

export type NumDict = {
	[index: string]: number
}

// Base Or Quote Type

export type BaseOrQuote = 'base' | 'quote'

// Token Data Type

export type TokenData = {
	symbol: string
	value: number
	amount?: number
}

// Price Data Type

export type PriceData = {
	time: number
	price: number
}

// Token Records Type

export type TokenRecords = {
	[index: string]: TokenRecord
}

// Vault Data Type

export type VaultData = TokenData & {
	platform: string
	platformUrl: string
	apy?: number
	vaultName?: string
	receiptName?: string
	receiptAmount?: number
	tokens: TokenData[]
}

// Assets Type

export type Assets = {
	[index: string]: AssetData
}

// Token Times Type

export type TokenTimes = {
	[index: string]: number[]
}

// Token Prices Type

export type TokenPrices = {
	[index: string]: PriceData[]
}

// Chain Type

export type Chain = {
	totalValue: number
	totalTokenValue: number
	totalVaultValue: number
	nativeToken: TokenData
	tokens: TokenData[]
	vaults: VaultData[]
	receipts: NumDict
	transactions: HistoryRecord[]
	tokenAddresses: StringDict
}

// Chains Type

export type Chains = {
	avax: Chain
	bsc: Chain
	cro: Chain
	eth: Chain
	ftm: Chain
	matic: Chain
	movr: Chain
	hmy: Chain
	sol: Chain
	terra: Chain
}

// History Record Type

export type HistoryRecord = {
	id: string
	time: string
	quoteSymbol: string
	baseSymbol: string
	feeSymbol: string
	ticker: string
	type: 'receive' | 'send' | 'swap' | 'approve' | 'failure'
	direction: 'credit' | 'debit'
	quoteQuantity: number
	quoteValueUSD: number
	quotePriceUSD: number
	baseQuantity: number
	baseValueUSD: number
	basePriceUSD: number
	feeQuantity: number
	feeValueUSD: number
	feePriceUSD: number
	blockchain: keyof Chains
	fromAddress: string
	toAddress: string
	tokens?: TokenRecords
}

// Driver Args Type

export type DriverArgs = {
	useDebank?: boolean
	getTransactions?: boolean
	getPrices?: boolean
	getBalances?: boolean
	filterUnknownTokens?: boolean
	priorTransactions?: HistoryRecord[]
}

// Infer Multi Swap Args

export type InferMultiSwapArgs = {
	absSingleValueUSD: number
	absMultiValueUSD: number
	singleIsBase: boolean
	transactionCount: number
	ineligibleCount: number
	ineligibleTotal: number
	ineligibleIndexes: number[]
	transactions: HistoryRecord[]
}

// Token Addresses Type

export type TokenAddresses = { [index: string]: string[] }

// Main Request Type

export type MainRequest =
	| Token[]
	| Protocol[]
	| NumDict
	| BeefyVaultInfo[]
	| void

/**
 * Debank Types
 */

// Portfolio Item List Type

type PortfolioItemList = {
	detail: {
		supply_token_list: Token[]
	}
	stats: {
		net_usd_value: number
	}
}

// Debank Transaction Info Type

type DebankTransactionInfo = {
	eth_gas_fee: number
	usd_gas_fee: number
	to_addr: string
	from_addr: string
	name: string
	status: 0 | 1
}

// Debank Tokens Type

export type DebankTokens = {
	[index: string]: {
		symbol: string
	}
}

// Debank Transfer Type

export type DebankTransfer = {
	amount: number
	to_addr?: string
	from_addr?: string
	token_id: string
}

// Token Type

export type Token = {
	chain: keyof Chains
	symbol: string
	price: number
	amount: number
}

// Protocol Type

export type Protocol = {
	chain: keyof Chains
	name: string
	site_url: string
	portfolio_item_list: PortfolioItemList[]
}

// Debank Trans Response Type

export type DebankTransResponse = {
	data: {
		history_list: DebankHistory[]
		token_dict: DebankTokens
		project_dict: any
		cate_dict: any
	}
}

// Debank History Type

export type DebankHistory = {
	id: string
	cate_id?: string
	other_addr: string
	time_at: number
	sends: DebankTransfer[]
	receives: DebankTransfer[]
	tx?: DebankTransactionInfo
}

/**
 * Ape Board Types
 */

// Ape Board Interaction Type

type ApeBoardInteraction = {
	from: string
	to: string
	function?: string
}

// Ape Board Fee Type

type ApeBoardFee = {
	amount: number
	price: number
	symbol: string
}

// Ape Board Position

type ApeBoardPosition = {
	balance: number
	tokens: ApeBoardToken[]
}

// Ape Board Token

export type ApeBoardToken = {
	address: string
	symbol: string
	balance: number
	price: number
}

// Ape Board Positions Response

export type ApeBoardPositionsResponse = {
	positions: ApeBoardPosition[]
}

// Ape Board Anchor Reponse

export type ApeBoardAnchorResponse = {
	savings: ApeBoardPosition[]
}

// Ape Board Transfer Type

export type ApeBoardTransfer = {
	from: string
	to: string
	symbol: string
	tokenAddress: string
	balance: number
	type: 'in' | 'out'
}

// Ape Board History Type

export type ApeBoardHistory = {
	hash: string
	timestamp: number
	transfers: ApeBoardTransfer[]
	interactions: ApeBoardInteraction[]
	isError: boolean
	fee: ApeBoardFee[]
}

// Ape Board Transactions Response Type

export type ApeBoardTransResponse = ApeBoardHistory[]

/**
 * Beefy Types
 */

// Beefy Vault Info Type

export type BeefyVaultInfo = {
	id: string
	earnedToken: string
}

/**
 * Coin Gecko Types
 */

// Coin Gecko Token

export type CoinGeckoToken = {
	id: string
	symbol: string
	name: string
	platforms: StringDict
}

// Coin Gecko Prices Response

export type CoinGeckoPricesResponse = {
	prices: number[][]
}

/**
 * Farm.Army Types
 */

// Farm.Army Token

type FarmArmyToken = {
	token: string
	symbol: string
	amount: number
	usd: number
}

// Farm.Army Vault

type FarmArmyVault = {
	deposit: {
		symbol: string
		amount: number
		usd: number
	}
	farm: {
		name: string
		token: string
		id: string
		yield: {
			apy: number
		}
	}
}

// Farm.Army Tokens Response

export type FarmArmyTokensResponse = {
	tokens: FarmArmyToken[]
}

// Farm.Army Vaults Response

export type FarmArmyVaultsResponse = {
	hbeefy: {
		farms: FarmArmyVault[]
		url: string
	}
}

/**
 * Local DB Types
 */

// Local Price Data

export type LocalPriceData = PriceData & { symbol: string }

// Local Contract Data

export type LocalContractData = {
	blockchain: string
	symbol: string
	address: string
}
