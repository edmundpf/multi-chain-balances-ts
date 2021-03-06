import { ENV_ADDRESS, ENV_MIN_VALUE } from './envValues'
import {
	NATIVE_TOKENS,
	DEFAULT_URLS,
	initChains,
	TOKEN_ALIASES,
	RECEIPT_ALIASES,
	TULIP_URL,
	ANCHOR_URL,
} from './values'
import {
	titleCase,
	hasNumber,
	getTokenList,
	getKnownTokenList,
	getProtocolList,
	getSolanaTokensInfo,
	getSolanaVaultsInfo,
	getTerraTokensInfo,
	getTerraAnchorInfo,
	getBeefyApy,
	getBeefyVaults,
	sterilizeTokenNameNoStub,
	isUnknownToken,
} from './utils'
import {
	Token,
	Protocol,
	Chains,
	TokenData,
	VaultData,
	NumDict,
	MainRequest,
	Assets,
	ApeBoardToken,
	ApeBoardPositionsResponse,
	ApeBoardAnchorResponse,
} from './types'

/**
 * DefiBalances Class
 */

export default class DefiBalances {
	// Properties

	address = ''
	isEVM = false
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

		// Format Address
		const lowerAddress = this.address.toLowerCase()
		this.isEVM = lowerAddress.startsWith('0x')
		if (this.isEVM) this.address = lowerAddress

		// Get Chain Names
		this.chainNames = Object.keys(this.chains) as Array<keyof Chains>
	}

	/**
	 * Get All Balances
	 */

	async getBalances(filterUnkownTokens = true) {
		const requests: (Promise<MainRequest> | Token[] | any)[] = [
			this.isEVM ? getTokenList(this.address) : [],
			this.isEVM && filterUnkownTokens ? getKnownTokenList(this.address) : [],
			this.isEVM ? getProtocolList(this.address) : [],
			this.isEVM ? getBeefyApy() : {},
			this.isEVM ? getBeefyVaults() : {},
			this.isEVM ? [] : this.getSolanaTokensAndVaults(),
			this.isEVM ? [] : this.getTerraTokensAndVaults(),
		]
		const res: MainRequest[] = await Promise.all(requests)
		const tokenData = res[0] as Token[]
		const knownTokenData = res[1] as Token[]
		const protocolData = res[2] as Protocol[]
		const apyData = res[3] as NumDict
		const vaultData = res[4] as any
		const solanaTokenData = res[5] as Token[]
		const terraTokenData = res[6] as Token[]
		const allTokenData = [...tokenData, ...solanaTokenData, ...terraTokenData]
		this.parseTokenData(allTokenData, knownTokenData)
		this.parseProtocolData(protocolData)
		this.parseApyData(apyData, vaultData)
		this.getAssetsAndTotalValues()
	}

	/**
	 * Get Assets & Total Values
	 */

	private getAssetsAndTotalValues() {
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
			const vaultName: string = (record as any).vaultName || ''
			const url: string = (record as any).platformUrl || DEFAULT_URLS[chainName]
			let symbolStr = isVault && vaultName ? vaultName.toUpperCase() : symbol
			if (!vaultName || !isVault) {
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
				if (isUnknownToken(this.unknownTokens, record.symbol)) continue
				addAsset(record, chainName)
				addToken(record)
			}
			for (const record of chain.vaults) {
				if (record.receiptName && record.vaultName) {
					addAsset(record, chainName, true)
				}
				for (const token of record.tokens) {
					if (isUnknownToken(this.unknownTokens, record.symbol)) continue
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
					const isNativeToken = symbol == NATIVE_TOKENS[chain]
					const shouldDisplay = knownSymbols.length
						? knownSymbols.includes(symbol) || isNativeToken
						: true

					// Update token data
					if (shouldDisplay) {
						chainInfo.tokens.push(tokenData)
					}

					// Add Unknown Tokens
					else {
						const tokenName = sterilizeTokenNameNoStub(symbol)
						if (!this.unknownTokens.includes(tokenName)) {
							this.unknownTokens.push(tokenName)
						}
					}

					// Set Native Token Info
					if (isNativeToken) {
						chainInfo.nativeToken = tokenData
					}

					// Exclude Unknown Token Totals
					if (shouldDisplay && !isUnknownToken(this.unknownTokens, symbol)) {
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

	private parseApyData(apyData: NumDict, vaultData: any) {
		// Iterate Chains
		for (const chainName in this.chains) {
			if (chainName == 'sol') continue
			const chain = this.chains[chainName as keyof Chains]

			// Iterate Vault Info
			for (const vault of chain.vaults) {
				const matches: { [index: string]: number | true } = {}
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
				let symbols = symbolsStr.split(' ')

				// Remove Numeric Symbols
				symbols = symbols.filter((sym: string) => isNaN(Number(sym)))

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
					for (const word of symbols) {
						if (TOKEN_ALIASES[word] && !symbols.includes(TOKEN_ALIASES[word])) {
							symbols.push(TOKEN_ALIASES[word])
						}
					}
					const tokensMatchReceiptTokens = receiptWordsEnd.every(
						(receiptSym: string) =>
							symbols.some(
								(sym: string) =>
									sym.includes(receiptSym) || receiptSym.includes(sym)
							)
					)

					// Check if receipt has alias
					let isReceiptAlias = false
					for (const part in RECEIPT_ALIASES) {
						if (receiptStrNoSpaces.includes(part)) {
							const aliasTokens: string[] = RECEIPT_ALIASES[part]
							isReceiptAlias = aliasTokens.every((aliasSym: string) =>
								symbols.some(
									(receiptSym: string) =>
										receiptSym.includes(aliasSym) ||
										aliasSym.includes(receiptSym)
								)
							)
							if (isReceiptAlias) break
						}
					}

					// Check for Match comparing Symbols vs. Receipts
					const isMatch =
						receiptStr.includes(symbolsStr) ||
						receiptStrNoSpaces.includes(symbolsStr) ||
						tokensMatchReceiptTokens ||
						isReceiptAlias

					// Add Match to Compare Vault/Receipt Amounts
					if (isMatch) {
						const vaultAmount = vault.amount || 0
						matches[receiptName] =
							isReceiptAlias || Math.abs(vaultAmount - receiptAmount)
					}
				}

				// Get Closest Match using Vault/Receipt Amounts
				let receiptMatch = ''
				let currentDiff = 0
				for (const receiptName in matches) {
					const matchValue = matches[receiptName]

					// Get Match by Alias
					const isAlias = matchValue === true
					if (isAlias) {
						receiptMatch = receiptName
						break
					}

					// Get Match using receipt difference
					const diff = isAlias ? 0 : (matchValue as number)
					if (!receiptMatch || diff < currentDiff) {
						receiptMatch = receiptName
						currentDiff = diff
					}
				}

				// Get Matching APY Info
				if (receiptMatch) {
					for (const unwrappedVaultReceipt in vaultData) {
						const id = vaultData[unwrappedVaultReceipt]
						const unwrappedReceipt = receiptMatch
							.toLowerCase()
							.replace(/w/g, '')
						if (
							unwrappedReceipt == unwrappedVaultReceipt &&
							apyData[id] != null
						) {
							// Set Vault Info
							vault.apy = apyData[id] * 100
							vault.vaultName = id
							vault.receiptName = receiptMatch
							vault.receiptAmount = chain.receipts[receiptMatch]
							break
						}
					}
				}
			}
		}
	}

	/**
	 * Parse ApeBoard Tokens
	 */

	private parseApeboardTokens(chain: keyof Chains, response: ApeBoardToken[]) {
		const parsedTokens: Token[] = []
		const tokens = response?.length ? response : []
		for (const token of tokens) {
			const { symbol, balance: amount, price } = token
			parsedTokens.push({
				chain,
				symbol: symbol.toUpperCase(),
				price,
				amount,
			})
		}
		return parsedTokens
	}

	/**
	 * Parse ApeBoard Vaults
	 */

	private parseApeboardVaults(
		chain: keyof Chains,
		platformId: string,
		platformUrl: string,
		response: ApeBoardPositionsResponse | ApeBoardAnchorResponse
	) {
		const vaults =
			(response as ApeBoardPositionsResponse)?.positions ||
			(response as ApeBoardAnchorResponse)?.savings ||
			[]

		// Iterate Vaults
		for (const vault of vaults) {
			const tokens: TokenData[] = []
			const tokenNames: string[] = []
			const tokenInfo = vault.tokens
			let vaultValue = 0

			// Iterate Tokens
			for (const token of tokenInfo) {
				const { symbol, balance: amount, price } = token
				const tokenName = symbol.toUpperCase()
				const tokenValue = amount * price
				vaultValue += tokenValue
				tokenNames.push(tokenName)
				tokens.push({
					symbol: tokenName,
					value: tokenValue,
					amount,
				})
			}

			// Get Pool and Vault Symbols
			const tokensStr = tokenNames.join('-')
			const symbol = `${tokensStr}-Pool`
			const vaultName = `${platformId}-${tokensStr.toLowerCase()}`
			const platform = titleCase(platformId)

			// Push Vault
			this.chains[chain].vaults.push({
				symbol,
				value: vaultValue,
				platform,
				platformUrl,
				vaultName,
				receiptName: vaultName,
				apy: 0,
				tokens,
			})
		}
	}

	/**
	 * Get Solana Tokens and Vaults
	 */

	private async getSolanaTokensAndVaults() {
		const responses = await Promise.all([
			getSolanaTokensInfo(this.address),
			getSolanaVaultsInfo(this.address),
		])
		const tokensResponse = responses[0]
		const vaultsResponse = responses[1]
		const parsedTokens = this.parseSolanaTokens(tokensResponse)
		this.parseSolanaVaults(vaultsResponse)
		return parsedTokens
	}

	/**
	 * Parse Solana Tokens
	 */

	private parseSolanaTokens(response: ApeBoardToken[]) {
		return this.parseApeboardTokens('sol', response)
	}

	/**
	 * Parse Solana Vaults
	 */

	private parseSolanaVaults(response: ApeBoardPositionsResponse) {
		return this.parseApeboardVaults('sol', 'tulip', TULIP_URL, response)
	}

	/**
	 * Get Terra Tokens and Vaults
	 */

	private async getTerraTokensAndVaults() {
		const responses = await Promise.all([
			getTerraTokensInfo(this.address),
			getTerraAnchorInfo(this.address),
		])
		const tokensResponse = responses[0]
		const vaultsResponse = responses[1]
		const parsedTokens = this.parseTerraTokens(tokensResponse)
		this.parseTerraVaults(vaultsResponse)
		return parsedTokens
	}

	/**
	 * Parse Terra Tokens
	 */

	private parseTerraTokens(response: ApeBoardToken[]) {
		return this.parseApeboardTokens('terra', response)
	}

	/**
	 * Parse Solana Vaults
	 */

	private parseTerraVaults(response: ApeBoardAnchorResponse) {
		return this.parseApeboardVaults('terra', 'anchor', ANCHOR_URL, response)
	}
}
