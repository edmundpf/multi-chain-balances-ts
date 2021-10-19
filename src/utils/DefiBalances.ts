import axios from 'axios'
import { titleCase, hasNumber } from './misc'
import { ENV_ADDRESS, ENV_MIN_VALUE } from './envValues'
import {
	APIS,
	ENDPOINTS,
	NATIVE_TOKENS,
	DEFAULT_URLS,
	initChains,
	apeBoardCredentials,
	EXCHANGE_ALIASES,
	TOKEN_ALIASES,
	FIAT_CURRENCY,
	stableCoinConfig,
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

/**
 * DefiBalances Class
 */

export default class DefiBalances {
	// Properties

	address = ''
	totalValue = 0
	totalTokenValue = 0
	totalVaultValue = 0
	chains = initChains()
	assets: Assets = {}
	chainNames: Array<keyof Chains>
	tokenNames: string[] = []
	unknownTokens: string[] = []

	/**
	 * Constructor
	 */

	constructor(address?: string) {
		if (address) {
			this.address = address /* Address Argument */
		} else {
			// First Address from Environment Array
			if (ENV_ADDRESS.includes('[')) {
				try {
					this.address = JSON.parse(ENV_ADDRESS)?.[0] || ''
				} catch (err) {
					// Do Nothing
				}
			} else {
				this.address = ENV_ADDRESS /* Single Environment Address */
			}
		}
		this.address = this.address.toLowerCase()
		this.chainNames = Object.keys(this.chains) as Array<keyof Chains>
	}

	/**
	 * Get All Balances
	 */

	async getBalances(filterUnkownTokens = true) {
		const requests: (Promise<MainRequest> | Token[])[] = [
			this.getTokenList(),
			filterUnkownTokens ? this.getKnownTokenList() : [],
			this.getProtocolList(),
			this.getBeefyApy(),
		]
		const res: MainRequest[] = await Promise.all(requests)
		const tokenData = res[0] as Token[]
		const knownTokenData = res[1] as Token[]
		const protocolData = res[2] as Protocol[]
		const apyData = res[3] as NumDict
		this.parseTokenData(tokenData, knownTokenData)
		this.parseProtocolData(protocolData)
		this.parseApyData(apyData)
		this.getAssetsAndTotalValues()
	}

	/**
	 * Get Assets & Total Values
	 */

	getAssetsAndTotalValues() {
		const assetCounts: NumDict = {}
		const assetIndexes: NumDict = {}

		// Add Asset
		const addAsset = (
			record: TokenData | VaultData,
			chainName: keyof Chains,
			isVault = false
		) => {
			const { symbol, value } = record
			const apy: number = (record as any).apy || 0
			const beefyVaultName: string = (record as any).beefyVaultName || ''
			const url: string = (record as any).platformUrl || DEFAULT_URLS[chainName]
			let symbolStr =
				isVault && beefyVaultName ? beefyVaultName.toUpperCase() : symbol
			if (!beefyVaultName || !isVault) {
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
		for (const chainNm in this.chains) {
			const chainName = chainNm as keyof Chains
			const chain = this.chains[chainName]

			// Update Chain Total Value
			chain.totalValue = chain.totalTokenValue + chain.totalVaultValue

			// Update simplified assets
			for (const record of chain.tokens) {
				if (this.isUnknownToken(record.symbol)) continue
				addAsset(record, chainName)
				addToken(record)
			}
			for (const record of chain.vaults) {
				if (record.beefyReceiptName && record.beefyVaultName) {
					addAsset(record, chainName, true)
				}
				for (const token of record.tokens) {
					if (this.isUnknownToken(record.symbol)) continue
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
			return {
				...((err as any)?.response?.data || {}),
				hasError: true,
			}
		}
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

	/**
	 * Is Stable Coin
	 */

	isStableCoin(tokenName: string, price: number) {
		const upperToken = tokenName.toUpperCase()
		const isNormalStable = upperToken.includes(FIAT_CURRENCY)
		const isOtherStable = stableCoinConfig.otherCoins.includes(tokenName)
		const withinError =
			price >= 1 - stableCoinConfig.errorPercent &&
			price <= 1 + stableCoinConfig.errorPercent
		return (isNormalStable || isOtherStable) && withinError
	}

	/**
	 * Is Native Token
	 */

	isNativeToken(tokenName: string) {
		return Object.values(NATIVE_TOKENS).includes(tokenName)
	}

	/**
	 * Is Unknown Token
	 */

	isUnknownToken(symbol: string) {
		const sterileSymbol = this.sterilizeTokenNameNoStub(symbol)
		return this.unknownTokens.includes(sterileSymbol)
	}

	/**
	 * Sterilize Token Name
	 */

	sterilizeTokenName(token: string) {
		return (token || '').replace(/ /g, '-').toUpperCase()
	}

	/**
	 * Remove Token Contract Stub
	 */

	sterilizeTokenNameNoStub(tokenName: string) {
		let curName = tokenName
		if (tokenName.includes('-')) {
			let dashParts = tokenName.split('-')
			const lastPart = dashParts[dashParts.length - 1]
			const isPool = lastPart == 'Pool'
			const hasStub = lastPart.startsWith('0x') && lastPart.length == 6
			if (!isPool && hasStub) {
				dashParts = dashParts.slice(0, dashParts.length - 2)
				curName = dashParts.join('-')
			}
		}
		return this.sterilizeTokenName(curName)
	}

	/**
	 * Get Address Stub
	 */

	getAddressStub(address: string) {
		return address.substring(2, 6).toUpperCase()
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

	private async getDebankEndpoint(
		endpoint: keyof typeof ENDPOINTS,
		args?: any
	) {
		return await this.getEndpoint('debank', endpoint, {
			...args,
			id: this.address,
		})
	}

	/**
	 * Parse Token Data
	 */

	private parseTokenData(data: Token[], knownData: Token[]) {
		// Get Known Symbols
		const knownSymbols: string[] = []
		for (const record of knownData) {
			knownSymbols.push(record.symbol)
		}

		// Iterate All Tokens
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
				else if (value >= ENV_MIN_VALUE) {
					const chainInfo = this.chains[chain]
					const tokenData: TokenData = {
						symbol,
						amount,
						value,
					}
					const shouldDisplay = knownSymbols.length
						? knownSymbols.includes(symbol)
						: true

					// Update token data
					if (shouldDisplay) {
						chainInfo.tokens.push(tokenData)
					}

					// Add Unknown Tokens
					else {
						const tokenName = this.sterilizeTokenNameNoStub(symbol)
						if (!this.unknownTokens.includes(tokenName)) {
							this.unknownTokens.push(tokenName)
						}
					}

					// Set Native Token Info
					if (symbol == NATIVE_TOKENS[chain]) {
						chainInfo.nativeToken = tokenData
					}

					// Exclude Unknown Token Totals
					if (shouldDisplay && !this.isUnknownToken(symbol)) {
						chainInfo.totalTokenValue += value
					}
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
					if (value >= ENV_MIN_VALUE) {
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
				let symbolsStr = titleCase(
					tokens.join(' ').toLowerCase().replace(/\.e/g, 'e')
				).toLowerCase()
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
					receiptStr = receiptStr.replace(/\.E/g, 'E').replace(/\.e/g, 'E')
					receiptStr = titleCase(receiptStr).toLowerCase()
					const receiptStrNoSpaces = receiptStr.replace(/ /g, '')
					const receiptWords = receiptStr.split(' ')
					const receiptWordsEnd = receiptWords.slice(
						receiptWords.length - symbols.length
					)

					// Add Alias Token Names
					for (const word of receiptWordsEnd) {
						if (
							TOKEN_ALIASES[word] &&
							!receiptWordsEnd.includes(TOKEN_ALIASES[word])
						) {
							receiptWordsEnd.push(TOKEN_ALIASES[word])
						}
					}
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
	 * Get Token List
	 */

	private async getTokenList() {
		return await this.getDebankEndpoint('tokenList')
	}

	/**
	 * Get Known Token List
	 */

	private async getKnownTokenList() {
		return await this.getDebankEndpoint('tokenList', { is_all: false })
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
}
