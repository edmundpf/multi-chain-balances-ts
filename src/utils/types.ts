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

// Numeric Dict Type

export type NumDict = {
	[index: string]: number
}

// Token Data Type

export type TokenData = {
	symbol: string
	value: number
	amount?: number
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
	beefyVaultName?: string
	beefyReceiptName?: string
	beefyReceiptAmount?: number
	tokens: TokenData[]
}

// Assets Type

export type Assets = {
	[index: string]: AssetData
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
}

// Chains Type

export type Chains = {
	bsc: Chain
	eth: Chain
	ftm: Chain
	matic: Chain
}

// History Record Type

export type HistoryRecord = {
	id: string
	date: string
	ticker: string
	quote: string
	base: string
	type: string
	direction: string
	amount: number
	quantity: number
	price: number
	tokens?: TokenRecords
	baseAmount: number
	baseQuantity: number
	basePrice: number
	fees: number
	feeQuantity: number
	feePrice: number
	feeToken: string
	chain: keyof Chains
	fromAddress: string
	toAddress: string
}

// Main Request Type

export type MainRequest = Token[] | Protocol[] | NumDict | void

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
	fee: ApeBoardFee[]
}

// Ape Board Transactions Response Type

export type ApeBoardTransResponse = ApeBoardHistory[]
