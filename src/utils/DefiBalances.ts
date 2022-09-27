import { ENV_ADDRESS, ENV_MIN_VALUE } from './envValues'
import { NATIVE_TOKENS, DEFAULT_URLS, initChains } from './values'
import {
	getTokenList,
	getProtocolList,
	getBeefyApy,
	getBeefyVaults,
	sterilizeTokenNameNoStub,
	isUnknownToken,
	nativeToDecimal,
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
	BeefyVaultInfo,
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

	async getBalances() {
		const res: MainRequest[] = [
			this.isEVM ? await getTokenList(this.address, this.chainNames) : [],
			this.isEVM ? await getProtocolList(this.address) : [],
			this.isEVM ? await getBeefyApy() : {},
			this.isEVM ? await getBeefyVaults() : {},
		]
		const tokenData = res[0] as Token[]
		const protocolData = res[1] as Protocol[]
		const apyData = res[2] as NumDict
		const vaultData = res[3] as BeefyVaultInfo[]
		this.parseTokenData(tokenData)
		this.parseProtocolData(protocolData, vaultData)
		this.parseApyData(apyData)
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

	private parseTokenData(data: Token[]) {
		// Iterate All Tokens
		for (const record of data) {
			// Token Info
			const {
				chain,
				symbol,
				price: recPrice,
				amount: decAmount,
				balance,
				decimals,
			} = record
			const recAmount = decAmount
				? decAmount
				: nativeToDecimal(balance || 0, decimals)
			const price = recPrice || 0
			const amount = recAmount || 0
			const value = price * amount

			// Check if Chain exists
			if (this.chainNames.includes(chain)) {
				// Check for minimum value
				if (value >= ENV_MIN_VALUE) {
					const chainInfo = this.chains[chain]
					const tokenData: TokenData = {
						symbol,
						amount,
						value,
					}
					const isNativeToken = symbol == NATIVE_TOKENS[chain]
					const shouldDisplay = !symbol.startsWith('0x')

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

	private parseProtocolData(data: Protocol[], vaultData: BeefyVaultInfo[]) {
		// Get Vaults by Address
		const vaultsByAddress: { [index: string]: BeefyVaultInfo } = {}
		for (const vault of vaultData) {
			vaultsByAddress[vault.earnedTokenAddress.toLowerCase()] = vault
		}

		for (const record of data) {
			// Platform Info
			const {
				chain,
				name: platform,
				site_url: platformUrl,
				portfolio_list: vaults,
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
						const receiptAddress = vault?.pool?.id || ''
						const receiptName =
							vaultsByAddress[receiptAddress]?.earnedToken || ''
						const vaultName = vaultsByAddress[receiptAddress]?.id || ''

						// Token Info
						for (const token of tokens) {
							const {
								symbol,
								price: recPrice,
								amount: decAmount,
								balance,
								decimals,
							} = token
							const recAmount = decAmount
								? decAmount
								: nativeToDecimal(balance || 0, decimals)
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
							receiptAddress,
							receiptName,
							vaultName,
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
				const vaultName = vault.vaultName
				for (const apyName in apyData) {
					if (vaultName == apyName) {
						vault.apy = apyData[apyName] * 100
						break
					}
				}
			}
		}
	}
}
