/**
 * Portfolio Item List
 */

type PortfolioItemList = {
	detail: {
		supply_token_list: Token[]
	}
	stats: {
		net_usd_value: number
	}
}

/**
 * Beefy Vault Type
 */

type BeefyVault = {
	totalApy: number
}

/**
 * Token Type
 */

export type Token = {
	chain: keyof Chains
	symbol: string
	price: number
	amount: number
}

/**
 * Protocol Type
 */

export type Protocol = {
	chain: keyof Chains
	name: string
	site_url: string
	portfolio_item_list: PortfolioItemList[]
}


/**
 * Beefy Vaults Interface
 */

export interface BeefyVaults {
	[index: string]: BeefyVault
}

/**
 * Token Data Type
 */

export type TokenData = {
	symbol: string
	amount?: number
	value: number
}

/**
 * Vault Data Type
 */

export type VaultData = TokenData & {
	platform: string
	platformUrl: string
	apy?: number
	tokens: TokenData[]
}

/**
 * Chain Type
 */

export type Chain = {
	totalValue: number
	totalTokenValue: number
	totalVaultValue: number
	nativeToken: TokenData
	tokens: TokenData[]
	vaults: VaultData[]
}

/**
 * Chains IType
 */

export type Chains = {
	bsc: Chain
	eth: Chain
	matic: Chain
}
