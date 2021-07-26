import dotenv from 'dotenv'
import axios from 'axios'
import CONFIG from './config.json'
import {
	APIS,
	ENDPOINTS,
	initChains,
	NATIVE_TOKENS,
} from './values'
import {
	Token,
	Protocol,
	BeefyVaults,
	Chains,
	TokenData,
	VaultData,
} from './types'


// Init

dotenv.config()
const ADDRESS = process.env.ADDRESS || ''

/**
 * MultiChain Class
 */

export default class MultiChain {

	// Properties

	address = ADDRESS
	totalValue = 0
	totalTokenValue = 0
	totalVaultValue = 0
	chains = initChains()
	assets: { [key: string]: number } = {}
	chainNames: Array<keyof Chains>
	tokenNames: string[] = []

	/**
	 * Constructor
	 */

	constructor() {
		this.chainNames = Object.keys(this.chains) as Array<keyof Chains>
	}

	/**
	 * Driver
	 */

	async driver() {
		const tokenData: Token[] = await this.getTokenList()
		const protocolData: Protocol[] = await this.getProtocolList()
		// const beefyApyData: BeefyVaults = await this.getBeefyApy()
		this.parseTokenData(tokenData)
		this.parseProtocolData(protocolData)
		// this.parseBeefyApyData(beefyApyData)
		this.parseChainData()
		// console.log(this)
		console.log(this)
	}

	/**
	 * Parse Token Data
	 */

	private parseTokenData(data: Token[]) {
		for (const record of data) {
			const {
				chain,
				symbol,
				price: recPrice,
				amount: recAmount
			}	= record
			const price = recPrice || 0
			const amount = recAmount || 0
			const value = price * amount
			if (value >= CONFIG.minimumValue && this.chainNames.includes(chain)) {
				const chainInfo = this.chains[chain]
				const tokenData: TokenData = {
					symbol,
					amount,
					value,
				}
				chainInfo.tokens.push(tokenData)
				if (symbol == NATIVE_TOKENS[chain]) {
					chainInfo.nativeToken = tokenData
				}
				chainInfo.totalTokenValue += value
			}
		}
	}

	/**
	 * Parse Protocol Data
	 */

	private parseProtocolData(data: Protocol[]) {
		for (const record of data) {

			// Platform Info
			const {
				chain,
				name: platform,
				site_url: platformUrl,
				portfolio_item_list: vaults
			} = record
			if (this.chainNames.includes(chain)) {
				const chainInfo = this.chains[chain]
				// Vault Info
				for (const vault of vaults) {
					const value = vault?.stats?.net_usd_value || 0
					if (value >= CONFIG.minimumValue) {
						let vaultSymbol = ''
						const tokens = vault?.detail?.supply_token_list || []
						const tokenData: TokenData[] = []

						// Token Info
						for (const token of tokens) {
							const {
								symbol,
								price: recPrice,
								amount: recAmount
							} = token
							if (symbol) {
								const price = recPrice || 0
								const amount = recAmount || 0
								const value = price * amount
								if (vaultSymbol) vaultSymbol += '-'
								vaultSymbol += symbol
								tokenData.push({
									symbol,
									amount,
									value
								})
							}
						}
						if (vaultSymbol) vaultSymbol += '-Pool'
						chainInfo.vaults.push({
							symbol: vaultSymbol,
							value,
							platform,
							platformUrl,
							tokens: tokenData
						})
						chainInfo.totalVaultValue += value
					}
				}
			}
		}
	}

	/**
	 * Parse Beefy APY Data
	 */

	private parseBeefyApyData(data: BeefyVaults) {
		return 0
	}

	/**
	 * Parse Chain Data
	 */

	private parseChainData() {
		const assetCounts: any = {}
		const assetIndexes: any = {}

		// Add Asset
		const addAsset = (
			record: TokenData | VaultData,
			chainName: keyof Chains
		) => {
			const { symbol, value } = record
			let symbolStr = symbol
			if (assetCounts[symbol] > 1) {
				const symbolIndex = assetIndexes[symbol] != null
					? assetIndexes[symbol] + 1
					: 0
				symbolStr += `-${symbolIndex}`
				assetIndexes[symbol] = symbolIndex
			}
			symbolStr += ` (${chainName.toUpperCase()})`
			this.assets[symbolStr] = value
		}

		// Add Token
		const addToken = (token: TokenData) => {
			const { symbol } = token
			if (!this.tokenNames.includes(symbol)) {
				this.tokenNames.push(symbol)
			}
		}

		// Update Asset Count
		const updateAssetCount = (record: TokenData | VaultData) => {
			const symbol = record.symbol
			if (!assetCounts[symbol]) assetCounts[symbol] = 1
			else assetCounts[symbol] += 1
		}

		// Get Duplicate Assets Counts
		for (const chainName in this.chains) {
			const chain = this.chains[chainName as keyof Chains]
			for (const record of chain.tokens) {
				updateAssetCount(record)
			}
			for (const record of chain.vaults) {
				updateAssetCount(record)
			}
		}

		// Parse Data
		for (const chainName in this.chains) {
			const chain = this.chains[chainName as keyof Chains]

			// Get Total Value
			chain.totalValue = chain.totalTokenValue + chain.totalVaultValue

			// Simplify Assets and Tokens
			for (const record of chain.tokens) {
				addAsset(record, chainName as keyof Chains)
				addToken(record)
			}
			for (const record of chain.vaults) {
				addAsset(record, chainName as keyof Chains)
				for (const token of record.tokens) {
					addToken(token)
				}
			}

			// Get Totals between Chains
			this.totalTokenValue += chain.totalTokenValue
			this.totalVaultValue += chain.totalVaultValue
		}
		this.totalValue = this.totalTokenValue + this.totalVaultValue
	}

	/**
	 * Get Token List
	 */

	private async getTokenList() {
		return await this.getDebankEndpoint('tokenList')
	}

	/**
	 * Get Protocol List
	 */

	private async getProtocolList() {
		return await this.getDebankEndpoint('protocolList')
	}

	/**
	 * Get Beefy APY
	 */

	private async getBeefyApy() {
		return await this.getBeefyEndpoint('beefyApy')
	}

	/**
	 * Get Endpoint
	 */

	private async getEndpoint(
		api: keyof typeof APIS,
		endpoint: keyof typeof ENDPOINTS,
		params?: any
	) {
		try {
			const apiUrl = APIS[api]
			const stub = ENDPOINTS[endpoint]
			let paramStr = params ? new URLSearchParams(params).toString() : ''
			if (paramStr) paramStr = '?' + paramStr
			const fullUrl = `${apiUrl}/${stub}${paramStr}`
			return (await axios.get(fullUrl))?.data || {}
		} catch (err) {
			return err?.response?.data || {}
		}
	}

	/**
	 * Get Debank Endpoint
	 */

	private async getDebankEndpoint(endpoint: keyof typeof ENDPOINTS) {
		return await this.getEndpoint(
			'debank',
			endpoint,
			{ id: this.address }
		)
	}

	/**
	 * Get Beefy Endpoint
	 */

	private async getBeefyEndpoint(endpoint: keyof typeof ENDPOINTS) {
		return await this.getEndpoint('beefy', endpoint)
	}
}
