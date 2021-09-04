import dotenv from 'dotenv'
import axios from 'axios'
import { titleCase, hasNumber } from './misc'
import {
	APIS,
	ENDPOINTS,
	NATIVE_TOKENS,
	DEFAULT_URLS,
	initChains,
	apeBoardCredentials,
	EXCHANGE_ALIASES,
} from './values'
import {
	Token,
	Protocol,
	Chains,
	TokenData,
	VaultData,
	NumDict,
	MainRequest,
	Assets,
} from './types'

// Init

dotenv.config()
const ADDRESS = process.env.ADDRESS || ''
const MIN_VALUE = Number(process.env.MIN_VALUE) || 0.05

/**
 * DefiBalances Class
 */

export default class DefiBalances {
	// Properties

	address = ADDRESS
	totalValue = 0
	totalTokenValue = 0
	totalVaultValue = 0
	chains = initChains()
	assets: Assets = {}
	chainNames: Array<keyof Chains>
	tokenNames: string[] = []

	/**
	 * Constructor
	 */

	constructor() {
		this.chainNames = Object.keys(this.chains) as Array<keyof Chains>
	}

	/**
	 * Get All Balances
	 */

	async getBalances() {
		const requests: Promise<MainRequest>[] = [
			this.getTokenList(),
			this.getProtocolList(),
			this.getBeefyApy(),
		]
		const res: MainRequest[] = await Promise.all(requests)
		const tokenData = res[0] as Token[]
		const protocolData = res[1] as Protocol[]
		const apyData = res[2] as NumDict
		this.parseTokenData(tokenData)
		this.parseProtocolData(protocolData)
		this.parseApyData(apyData)
		this.parseChainData()
	}

	/**
	 * Parse Token Data
	 */

	private parseTokenData(data: Token[]) {
		for (const record of data) {
			// Token Info
			const { chain, symbol, price: recPrice, amount: recAmount } = record
			const price = recPrice || 0
			const amount = recAmount || 0
			const value = price * amount

			// Check if Chain exists
			if (this.chainNames.includes(chain)) {
				// Check for Beefy Receipt
				if (symbol.toLowerCase().startsWith('moo')) {
					const formattedSymbol = symbol.replace(/ /g, '')
					this.chains[chain].receipts[formattedSymbol] = amount
				}

				// Check for minimum value
				else if (value >= MIN_VALUE) {
					const chainInfo = this.chains[chain]
					const tokenData: TokenData = {
						symbol,
						amount,
						value,
					}

					// Update token data
					chainInfo.tokens.push(tokenData)
					if (symbol == NATIVE_TOKENS[chain]) {
						chainInfo.nativeToken = tokenData
					}
					chainInfo.totalTokenValue += value
				}
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
				portfolio_item_list: vaults,
			} = record

			// Check if Chain exists
			if (this.chainNames.includes(chain)) {
				const chainInfo = this.chains[chain]

				// Vault Info
				for (const vault of vaults) {
					const value = vault?.stats?.net_usd_value || 0

					// Check for minimum value
					if (value >= MIN_VALUE) {
						let vaultSymbol = ''
						const tokens = vault?.detail?.supply_token_list || []
						const tokenData: TokenData[] = []

						// Token Info
						for (const token of tokens) {
							const { symbol, price: recPrice, amount: recAmount } = token
							if (symbol) {
								const price = recPrice || 0
								const amount = recAmount || 0
								const value = price * amount
								if (vaultSymbol) vaultSymbol += '-'
								vaultSymbol += symbol
								tokenData.push({
									symbol,
									amount,
									value,
								})
							}
						}

						// Update vault data
						if (vaultSymbol) vaultSymbol += '-Pool'
						chainInfo.vaults.push({
							symbol: vaultSymbol,
							value,
							platform,
							platformUrl,
							tokens: tokenData,
						})
						chainInfo.totalVaultValue += value
					}
				}
			}
		}
	}

	/**
	 * Parse APY Data
	 */

	private parseApyData(apyData: NumDict) {
		// Iterate Chains
		for (const chainName in this.chains) {
			const chain = this.chains[chainName as keyof Chains]

			// Iterate Vault Info
			for (const vault of chain.vaults) {
				const matches: NumDict = {}
				const tokens: string[] = []

				// Get Token Names in Vault
				for (const token of vault.tokens) {
					tokens.push(token.symbol)
				}

				// Format Symbols for Parsing
				let symbolsStr = titleCase(tokens.join(' ').toLowerCase()).toLowerCase()
				const numericSymbol = hasNumber(symbolsStr)

				// Numeric Symbol Format
				if (numericSymbol) {
					let numIndex = 0
					for (let i = 0; i < symbolsStr.length; i++) {
						const curLetter = symbolsStr[i]
						if (hasNumber(curLetter)) {
							numIndex = i
							break
						}
					}
					symbolsStr = symbolsStr.substring(numIndex)
				}
				const symbols = symbolsStr.split(' ')

				// Iterate Beefy Receipts
				for (const receiptName in chain.receipts) {
					const receiptAmount = chain.receipts[receiptName]
					const isPair = receiptName.includes('-')
					let receiptStr = receiptName

					// Format LP Pairs for Parsing
					if (isPair) {
						const dashIndex = receiptStr.indexOf('-')
						receiptStr =
							receiptStr.substring(0, dashIndex + 1) +
							receiptStr.substring(dashIndex + 1).toUpperCase()
					}

					// Format Beefy Receipts for Parsing
					receiptStr = titleCase(receiptStr).toLowerCase()
					const receiptStrNoSpaces = receiptStr.replace(/ /g, '')
					const receiptWords = receiptStr.split(' ')
					const receiptWordsEnd = receiptWords.slice(
						receiptWords.length - symbols.length
					)
					const hasMultipleSymbols = symbols.length >= 2
					const tokensMatchReceiptTokens = symbols.every((sym: string) =>
						receiptWordsEnd.some((receiptSym: string) =>
							sym.includes(receiptSym)
						)
					)

					// Check for Match comparing Symbols vs. Receipts
					const isMatch = isPair
						? hasMultipleSymbols && tokensMatchReceiptTokens
						: receiptStr.includes(symbolsStr) ||
						  receiptStrNoSpaces.includes(symbolsStr) ||
						  (!hasMultipleSymbols && tokensMatchReceiptTokens)

					// Add Match to Compare Vault/Receipt Amounts
					if (isMatch) {
						const vaultAmount = vault.amount || 0
						matches[receiptName] = Math.abs(vaultAmount - receiptAmount)
					}
				}

				// Get Closest Match using Vault/Receipt Amounts
				let receiptMatch = ''
				let currentDiff = 0
				for (const receiptName in matches) {
					const diff = matches[receiptName]
					if (!receiptMatch || diff < currentDiff) {
						receiptMatch = receiptName
						currentDiff = diff
					}
				}

				// Get Matching APY Info
				if (receiptMatch) {
					// Format Pancake-LP V2 Receipts
					const receiptStr = titleCase(
						receiptMatch.replace('V2', 'v2')
					).toLowerCase()
					let receiptWords = receiptStr.split(' ').slice(1)

					// Check if Symbol has Version and format Receipt Words
					const symbolHasVersion =
						receiptWords.length == 2 &&
						receiptWords[0].endsWith('v') &&
						String(Number(receiptWords[1])) == receiptWords[1]
					if (symbolHasVersion) receiptWords = [receiptWords.join('')]
					const receiptWordsSet = [receiptWords]

					// Get APY Aliases
					for (const key in EXCHANGE_ALIASES) {
						if (receiptStr.includes(key)) {
							for (const alias of EXCHANGE_ALIASES[
								key as keyof typeof EXCHANGE_ALIASES
							]) {
								receiptWordsSet.push(
									receiptStr.replace(key, alias).split(' ').slice(1)
								)
							}
						}
					}

					// Find Matching APY Info
					for (const vaultName in apyData) {
						let vaultMatch = ''
						for (const wordSet of receiptWordsSet) {
							const isMatch =
								wordSet.length == 1
									? vaultName.endsWith(`-${wordSet[0]}`)
									: wordSet.every(
											(word: string) =>
												word == 'swap' || vaultName.includes(word)
									  )
							if (isMatch) {
								vaultMatch = vaultName
								break
							}
						}

						// Set Vault Info
						if (vaultMatch) {
							vault.apy = apyData[vaultName] * 100
							vault.beefyVaultName = vaultName
							vault.beefyReceiptName = receiptMatch
							vault.beefyReceiptAmount = chain.receipts[receiptMatch]
							break
						}
					}
				}
			}
		}
	}

	/**
	 * Parse Chain Data
	 */

	private parseChainData() {
		const assetCounts: NumDict = {}
		const assetIndexes: NumDict = {}

		// Add Asset
		const addAsset = (
			record: TokenData | VaultData,
			chainName: keyof Chains,
			useBeefyVaultName = false
		) => {
			const { symbol, value } = record
			const apy: number = (record as any).apy || 0
			const beefyVaultName: string = (record as any).beefyVaultName || ''
			const url: string = (record as any).platformUrl || DEFAULT_URLS[chainName]
			let symbolStr =
				useBeefyVaultName && beefyVaultName
					? beefyVaultName.toUpperCase()
					: symbol
			if (!beefyVaultName || !useBeefyVaultName) {
				if (assetCounts[symbol] > 1) {
					const symbolIndex =
						assetIndexes[symbol] != null ? assetIndexes[symbol] + 1 : 0
					symbolStr += `-${symbolIndex}`
					assetIndexes[symbol] = symbolIndex
				}
			}
			symbolStr += ` (${chainName.toUpperCase()})`
			this.assets[symbolStr] = {
				desc: symbol,
				value,
				apy,
				url,
			}
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

			// Update Chain Total Value
			chain.totalValue = chain.totalTokenValue + chain.totalVaultValue

			// Update simplified assets
			for (const record of chain.tokens) {
				addAsset(record, chainName as keyof Chains)
				addToken(record)
			}
			for (const record of chain.vaults) {
				if (record.beefyReceiptName && record.beefyVaultName) {
					addAsset(record, chainName as keyof Chains, true)
				}
				for (const token of record.tokens) {
					addToken(token)
				}
			}

			// Update Totals from all chains
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

	async getEndpoint(
		api: keyof typeof APIS,
		endpoint: keyof typeof ENDPOINTS,
		params?: any,
		headers?: any
	) {
		try {
			const apiUrl = APIS[api]
			const stub = ENDPOINTS[endpoint] || endpoint
			let paramStr = params ? new URLSearchParams(params).toString() : ''
			if (paramStr) paramStr = '?' + paramStr
			const fullUrl = `${apiUrl}/${stub}${paramStr}`
			return (
				(await axios.get(fullUrl, headers ? { headers } : undefined))?.data ||
				{}
			)
		} catch (err) {
			return err?.response?.data || {}
		}
	}

	/**
	 * Get Beefy Endpoint
	 */

	private async getBeefyEndpoint(endpoint: keyof typeof ENDPOINTS) {
		return await this.getEndpoint('beefy', endpoint)
	}

	/**
	 * Get Debank Endpoint
	 */

	private async getDebankEndpoint(endpoint: keyof typeof ENDPOINTS) {
		return await this.getEndpoint('debank', endpoint, { id: this.address })
	}

	/**
	 * Get Private Debank Endpoint
	 */

	async getPrivateDebankEndpoint(
		endpoint: keyof typeof ENDPOINTS,
		params?: any
	) {
		return await this.getEndpoint('debankPrivate', endpoint, {
			...params,
			user_addr: this.address.toLowerCase(),
		})
	}

	/**
	 * Get Ape Board Endpoint
	 */

	async getApeBoardEndpoint(endpoint: keyof typeof ENDPOINTS) {
		return await this.getEndpoint(
			'apeBoard',
			`${endpoint}/${this.address}` as keyof typeof ENDPOINTS,
			undefined,
			{
				passcode: apeBoardCredentials.passCode,
				'ape-secret': apeBoardCredentials.secret,
			}
		)
	}
}
