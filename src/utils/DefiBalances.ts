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
	exchangeAliases,
} from './values'
import {
	Token,
	Protocol,
	Chains,
	TokenData,
	VaultData,
	NumDict,
	ApeBoardResponse,
	ApeBoardPosition,
	ApeBoardPositions,
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
			this.getApeBoardPositions(),
			this.getBeefyApy(),
		]
		const res: MainRequest[] = await Promise.all(requests)
		const tokenData = res[0] as Token[]
		const protocolData = res[1] as Protocol[]
		const positionData = res[2] as ApeBoardPositions
		const apyData = res[3] as NumDict
		this.parseTokenData(tokenData)
		this.parseProtocolData(protocolData)
		this.parseApyData(positionData, apyData)
		this.parseChainData()
	}

	/**
	 * Parse Token Data
	 */

	private parseTokenData(data: Token[]) {
		for (const record of data) {
			// Token Info
			const {
				chain,
				symbol,
				price: recPrice,
				amount: recAmount
			}	= record
			const price = recPrice || 0
			const amount = recAmount || 0
			const value = price * amount

			// Check if chain exists
			if (this.chainNames.includes(chain)) {

				// Check for Beefy Receipt
				if (symbol.startsWith('moo')) {
					this.chains[chain].receipts[symbol] = amount
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
				portfolio_item_list: vaults
			} = record

			// Check if chain exists
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

						// Update vault data
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
	 * Parse APY Data
	 */

	private parseApyData(positionData: ApeBoardPositions, apyData: NumDict) {
		for (const chainName in this.chains) {
			const chain = this.chains[chainName as keyof Chains]

			// Iterate positions
			for (const position of positionData[chainName as keyof Chains]) {
				const matches: NumDict = {}

				// Symbol Formatting
				let symbolsStr = titleCase(
					position.tokens
						.join(' ')
						.toLowerCase()
				)
					.toLowerCase()
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

				// Iterate Receipts
				for (const receiptName in chain.receipts) {
					const receiptAmount = chain.receipts[receiptName]
					const isPair = receiptName.includes('-')
					let receiptStr = receiptName

					// Pair Format
					if (isPair) {
						const dashIndex = receiptStr.indexOf('-')
						receiptStr = receiptStr.substring(0, dashIndex + 1) +
							receiptStr.substring(dashIndex + 1).toUpperCase()
					}

					// Receipt Formatting
					receiptStr = titleCase(receiptStr).toLowerCase()
					const receiptStrNoSpaces = receiptStr.replace(/ /g, '')
					const receiptWords = receiptStr.split(' ')

					// Check for Match
					const isMatch = isPair
						? symbols.every((sym: string) => (
							receiptWords.slice(receiptWords.length - symbols.length).some(
								(receiptSym: string) => sym.includes(receiptSym)
							)
						))
						: receiptStr.includes(symbolsStr) ||
							receiptStrNoSpaces.includes(symbolsStr)

					if (isMatch) {
						matches[receiptName] = Math.abs(position.amount - receiptAmount)
					}
				}

				// Get Closest Match
				let receiptMatch = ''
				let currentDiff = 0
				for (const receiptName in matches) {
					const diff = matches[receiptName]
					if (!receiptMatch || diff < currentDiff) {
						receiptMatch = receiptName
					}
				}

				// Get Matching APY
				if (receiptMatch) {
					const receiptStr = titleCase(receiptMatch.replace('V2', 'v2'))
						.toLowerCase()
					let receiptWords = receiptStr.split(' ').slice(1)

					// Check if Symbol has version and format receipt words
					const symbolHasVersion =
						receiptWords.length == 2 &&
						receiptWords[0].endsWith('v') &&
						String(Number(receiptWords[1])) == receiptWords[1]
					if (symbolHasVersion) receiptWords = [receiptWords.join('')]
					const receiptWordsSet = [receiptWords]

					// Get Aliases
					for (const key in exchangeAliases) {
						if (receiptStr.includes(key)) {
							for (const alias of exchangeAliases[
								key as keyof typeof exchangeAliases
							]) {
								receiptWordsSet.push(
									receiptStr
										.replace(key, alias)
										.split(' ')
										.slice(1)
								)
							}
						}
					}

					// Find Matching Vault
					for (const vaultName in apyData) {
						let vaultMatch = ''
						for (const wordSet of receiptWordsSet) {
							const isMatch = wordSet.length == 1
								? vaultName.endsWith(`-${wordSet[0]}`)
								: wordSet.every((word: string) => (
								word == 'swap' || vaultName.includes(word)
							))
							if (isMatch) {
								vaultMatch = vaultName
								break
							}
						}
						if (vaultMatch) {
							let currentDiff = -1
							let vaultIndexMatch = 0

							// Get Matching Vault
							for (const vaultIndex in chain.vaults) {
								const isMatch = position.tokens.every((token: string) => (
									chain.vaults[vaultIndex].symbol
										.toLowerCase()
										.includes(token.toLowerCase())
								))
								const vault = chain.vaults[vaultIndex]
								const diff = Math.abs(vault.value - position.value)
								if (isMatch && (currentDiff == -1 || diff < currentDiff)) {
									vaultIndexMatch = Number(vaultIndex)
									currentDiff = diff
								}
							}

							// Set Vault Info
							const vaultInfo = chain.vaults[vaultIndexMatch]
							vaultInfo.apy = apyData[vaultName] * 100
							vaultInfo.beefyVaultName = vaultName
							vaultInfo.beefyReceiptName = receiptMatch
							vaultInfo.beefyReceiptAmount = chain.receipts[receiptMatch]
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
			let symbolStr = useBeefyVaultName && beefyVaultName
				? beefyVaultName.toUpperCase()
				: symbol
			if (!beefyVaultName || !useBeefyVaultName) {
				if (assetCounts[symbol] > 1) {
					const symbolIndex = assetIndexes[symbol] != null
						? assetIndexes[symbol] + 1
						: 0
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
	 * Get Ape Board Positions
	 */

	async getApeBoardPositions() {
		const requests = [
			this.getApeBoardEndpoint('beefyBsc'),
			this.getApeBoardEndpoint('beefyPolygon')
		]
		const res: ApeBoardResponse[] = await Promise.all(requests)
		const bscInfo = res[0]?.positions || []
		const maticInfo = res[1]?.positions || []
		const bscPositions: ApeBoardPosition[] = []
		const maticPositions: ApeBoardPosition[] = []

		// BSC Positions
		for (const record of bscInfo) {
			const tokens: string[] = []
			let value = 0
			for (const token of record.tokens) {
				tokens.push(token.symbol)
				value += Number(token.price) * token.balance
			}
			bscPositions.push({
				amount: record.balance,
				value,
				tokens,
			})
		}

		// Matic Positions
		for (const record of maticInfo) {
			const tokens: string[] = []
			let value = 0
			for (const token of record.tokens) {
				tokens.push(token.symbol)
				value += Number(token.price) * token.balance
			}
			maticPositions.push({
				amount: record.balance,
				value,
				tokens,
			})
		}
		return {
			bsc: bscPositions,
			eth: [],
			matic: maticPositions
		} as ApeBoardPositions
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
				await axios.get(
					fullUrl,
					headers ? { headers } : undefined
				)
			)?.data || {}
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

	/**
	 * Get Ape Board Endpoint
	 */

	private async getApeBoardEndpoint(endpoint: keyof typeof ENDPOINTS) {
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
