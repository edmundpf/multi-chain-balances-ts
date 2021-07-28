/**
 * Data Types
 */

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

// Chain Type

export type Chain = {
	totalValue: number
	totalTokenValue: number
	totalVaultValue: number
	nativeToken: TokenData
	tokens: TokenData[]
	vaults: VaultData[]
	receipts: NumDict
}

// Chains Type

export type Chains = {
	bsc: Chain
	eth: Chain
	matic: Chain
}

// Ape Board Position

export type ApeBoardPosition = {
	amount: number
	value: number
	tokens: string[]
}

// Ape Board Positions

export type ApeBoardPositions = {
	bsc: ApeBoardPosition[],
	eth: ApeBoardPosition[],
	matic: ApeBoardPosition[],
}

/**
 * Debank Types
 */

// Token Type

export type Token = {
	chain: keyof Chains
	symbol: string
	price: number
	amount: number
}

// Portfolio Item List Type

type PortfolioItemList = {
	detail: {
		supply_token_list: Token[]
	}
	stats: {
		net_usd_value: number
	}
}

// Protocol Type

export type Protocol = {
	chain: keyof Chains
	name: string
	site_url: string
	portfolio_item_list: PortfolioItemList[]
}

/**
 * Ape Board Types
 */

// Ape Board Token Type

type ApeBoardToken = {
	symbol: string
	price: string
	balance: number
}

// Ape Board Vault

type ApeBoardVault = {
	balance: number
	tokens: ApeBoardToken[]
}

// Ape Board Response

export type ApeBoardResponse = {
	positions: ApeBoardVault[]
}

/**
 * Misc
 */

export type MainRequest =
	Token[] |
	Protocol[] |
	ApeBoardPositions |
	NumDict
