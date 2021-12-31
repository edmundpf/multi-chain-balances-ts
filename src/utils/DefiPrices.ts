import DefiTransactions from './DefiTransactions'
import { waitMs, getFormattedURL } from './misc'
import { prepareDB, selectPrices, insertPrice } from './localData'
import {
	CoinGeckoToken,
	CoinGeckoPricesResponse,
	PriceData,
	StringDict,
	Chains,
	TokenTimes,
	TokenPrices,
	LocalPriceData,
	HistoryRecord,
	InferMultiSwapArgs,
	BaseOrQuote,
} from './types'
import {
	ENDPOINTS,
	coinGeckoLimits,
	coinGeckoDayCutoffs,
	ONE_DAY,
	FIAT_CURRENCY,
	defaultDriverArgs,
	slippageConfig,
} from './values'

/**
 * DefiPrices Class
 */

export default class DefiPrices extends DefiTransactions {
	// Properties

	private nextApiCallMs = 0
	private recentApiCalls: number[] = []
	private filterUnknownTokens = false

	/**
	 * Driver
	 */

	async driver(args?: typeof defaultDriverArgs) {
		const {
			useDebank,
			getTransactions,
			getPrices,
			getBalances,
			filterUnknownTokens,
			priorTransactions,
		} = {
			...defaultDriverArgs,
			...args,
		}
		this.filterUnknownTokens = filterUnknownTokens ? true : false

		if (priorTransactions?.length) {
			this.importPriorTransactions(priorTransactions)
		}

		// Get Transactions
		if (getTransactions || getPrices) {
			await prepareDB()
			await this.getTransactions(useDebank)
			if (this.filterUnknownTokens && !getPrices) this.getUnknownTokens()
		}

		// Get Prices and Balances
		if (getBalances) await this.getBalances(this.filterUnknownTokens)
		if (getPrices) await this.getPriceData()
	}

	/**
	 * Get Price Data
	 */

	private async getPriceData() {
		// Get Transaction Times for Supported Tokens
		const supportedTokens = await this.getSupportedTokens()
		const supportedTokenNames = Object.keys(supportedTokens)
		const transTokenTimes = this.getTokenTransactionTimes(supportedTokenNames)
		const transTokenNames = Object.keys(transTokenTimes)

		// Find Times w/ Missing Prices
		const localPrices = await this.getLocalPrices(transTokenNames)
		const { transPrices, missingTimes } = this.linkLocalPrices(
			transTokenTimes,
			localPrices
		)

		// Get Missing Prices from Coin Gecko API
		const daysOutLists = this.getAllDaysOutLists(missingTimes)
		const apiPrices = await this.getAllTokenPrices(
			daysOutLists,
			supportedTokens
		)
		const insertRecords = this.getInsertRecords(localPrices, apiPrices)

		// Update Transactions w/ Prices
		const mergedPrices = this.mergeApiAndLocalPrices(localPrices, apiPrices)
		this.linkMergedPrices(transPrices, mergedPrices)
		this.updateTransactionData(transPrices)

		// Infer Missing Transaction Prices
		this.inferTransactionPrices()

		// Add Missing Prices to DB
		await this.syncMissingPrices(insertRecords)
	}

	/**
	 * Import Prior Transactions
	 */

	private importPriorTransactions(records: HistoryRecord[]) {
		for (const record of records) {
			const chainName = record.blockchain
			this.chains[chainName].transactions.push(record)
		}
	}

	/**
	 * Get Supported Tokens
	 */

	private async getSupportedTokens() {
		const supportedTokens: StringDict = {}
		const tokenInfo: {
			[index: string]: {
				name: string
				addresses: string[]
			}
		} = {}
		const res: CoinGeckoToken[] = await this.getCoinGeckoEndpoint(
			'coinGeckoList',
			undefined,
			{ include_platform: true }
		)
		if (res?.length) {
			// Iterate ID's
			for (const record of res) {
				const { id, symbol, platforms } = record
				if (id && !tokenInfo[id]) {
					const tokenName = this.sterilizeTokenName(symbol)
					tokenInfo[id] = {
						name: tokenName,
						addresses: [],
					}
				}

				// Iterate Platforms
				for (const key in platforms) {
					const address = platforms[key]
					if (platforms[key]) {
						tokenInfo[id].addresses.push(address)
					}
				}
			}

			// Add Tokens w/ Known Addresses
			for (const id in tokenInfo) {
				const { name, addresses } = tokenInfo[id]
				let hasMatchingAddress = false

				// Iterate Chains
				for (const chainName of this.chainNames) {
					const knownAddresses = this.chains[chainName].tokenAddresses

					// Iterate Known Addresses
					for (const knownKey in knownAddresses) {
						const knownAddress = knownAddresses[knownKey]
						if (addresses.includes(knownAddress)) {
							if (name && !supportedTokens[name]) {
								supportedTokens[name] = id
								hasMatchingAddress = true
								break
							}
						}
					}
					if (hasMatchingAddress) break
				}
			}
		}

		// Add Tokens w/ Unknown Addresses
		for (const id in tokenInfo) {
			const { name } = tokenInfo[id]
			if (name && !supportedTokens[name]) {
				supportedTokens[name] = id
			}
		}
		return supportedTokens
	}

	/**
	 * Get Token Transaction Times
	 */

	private getTokenTransactionTimes(supportedTokenNames: string[]) {
		const tokenTimes: TokenTimes = {}

		// Iterate Chains
		for (const chainNm in this.chains) {
			const chainName = chainNm as keyof Chains
			const chain = this.chains[chainName]

			// Iterate Transactions
			for (const transaction of chain.transactions) {
				const {
					quoteSymbol,
					baseSymbol,
					feeSymbol,
					feePriceUSD,
					time: timeStr,
				} = transaction
				const time = this.getTimeMs(timeStr)
				const hasFeePrice = feePriceUSD ? true : false
				const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol)
				const baseName = this.sterilizeTokenNameNoStub(baseSymbol)
				const quoteIsLP = quoteName.endsWith('LP')
				const baseIsLP = baseName.endsWith('LP')
				const quoteSupported =
					supportedTokenNames.includes(quoteName) && !quoteIsLP
				const baseSupported =
					supportedTokenNames.includes(baseName) && !baseIsLP
				const quoteHasNativePrice = quoteSymbol == feeSymbol && hasFeePrice
				const baseHasNativePrice = baseSymbol == feeSymbol && hasFeePrice
				const baseIsFiat = baseSymbol == FIAT_CURRENCY

				// Add Quote Time
				if (quoteSupported && !quoteHasNativePrice) {
					this.addTokenTime(tokenTimes, quoteName, time)
				}

				// Add Base Time
				if (baseSupported && !baseIsFiat && !baseHasNativePrice) {
					this.addTokenTime(tokenTimes, baseName, time)
				}
			}
		}
		for (const key in tokenTimes) {
			tokenTimes[key].sort((a, b) => b - a)
		}
		return tokenTimes
	}

	/**
	 * Get Local Prices
	 */

	private async getLocalPrices(tokenNames: string[]) {
		const localPrices: TokenPrices = {}
		const requests: ReturnType<typeof selectPrices>[] = []
		for (const tokenName of tokenNames) {
			requests.push(selectPrices(tokenName))
		}
		const res = await Promise.all(requests)
		for (const index in res) {
			const tokenName = tokenNames[index]
			localPrices[tokenName] = res[index]
		}
		return localPrices
	}

	/**
	 * Link Local Prices
	 */

	private linkLocalPrices(
		transTokenTimes: TokenTimes,
		localPrices: TokenPrices
	) {
		const transPrices: TokenPrices = {}
		const missingTimes: TokenTimes = {}

		// Iterate Tokens
		for (const tokenName in transTokenTimes) {
			const transTimes = transTokenTimes[tokenName]
			const localTimes = localPrices[tokenName]
			transPrices[tokenName] = []

			// Iterate Transaction Times
			for (const transTime of transTimes) {
				const validLocalRecord = this.getValidPriceRecord(transTime, localTimes)
				transPrices[tokenName].push({
					time: transTime,
					price: validLocalRecord?.price || 0,
				})
				if (!validLocalRecord) {
					this.addTokenTime(missingTimes, tokenName, transTime)
				}
			}
		}
		return {
			missingTimes,
			transPrices,
		}
	}

	/**
	 * Get All Days Out Lists
	 */

	private getAllDaysOutLists(missingTimes: TokenTimes) {
		const daysOutLists: { [index: string]: number[] } = {}
		for (const tokenName in missingTimes) {
			const tokenTimes = missingTimes[tokenName]
			daysOutLists[tokenName] = this.getDaysOutList(tokenTimes)
		}
		return daysOutLists
	}

	/**
	 * Get All Token Prices
	 */

	private async getAllTokenPrices(
		daysOutLists: ReturnType<DefiPrices['getAllDaysOutLists']>,
		supportedTokens: StringDict
	) {
		const tokenPrices: TokenPrices = {}
		const requests: (Promise<PriceData[]> | PriceData[])[] = []
		const tokenNames = Object.keys(daysOutLists)
		for (const tokenName in daysOutLists) {
			const daysOutList = daysOutLists[tokenName]
			requests.push(
				daysOutList.length
					? this.getTokenPrices(supportedTokens[tokenName], daysOutList)
					: []
			)
		}
		const res = await Promise.all(requests)
		for (const index in res) {
			const prices = res[index]
			const tokenName = tokenNames[index]
			if (prices.length) {
				tokenPrices[tokenName] = prices
			}
		}
		return tokenPrices
	}

	/**
	 * Merge API and Local Prices
	 */

	private mergeApiAndLocalPrices(
		localPrices: TokenPrices,
		apiPrices: TokenPrices
	) {
		const mergedPrices: TokenPrices = { ...localPrices }
		for (const tokenName in localPrices) {
			mergedPrices[tokenName] = [
				...mergedPrices[tokenName],
				...(apiPrices[tokenName] || []),
			].sort((a, b) => (a.time < b.time ? 1 : -1))
		}
		return mergedPrices
	}

	/**
	 * Link Merged Prices
	 */

	private linkMergedPrices(
		transPrices: TokenPrices,
		mergedPrices: TokenPrices
	) {
		// Iterate Tokens
		for (const tokenName in transPrices) {
			const transTimes = transPrices[tokenName]
			const mergedTimes = mergedPrices[tokenName]

			// Iterate Transaction Records
			for (const index in transTimes) {
				const record = transTimes[index]
				if (!record.price) {
					const validLocalRecord = this.getValidPriceRecord(
						record.time,
						mergedTimes
					)
					if (validLocalRecord) {
						transTimes[index] = {
							time: record.time,
							price: validLocalRecord.price,
						}
					}
				}
			}
		}
	}

	/**
	 * Get Insert Records
	 */

	private getInsertRecords(localPrices: TokenPrices, apiPrices: TokenPrices) {
		const insertRecords: LocalPriceData[] = []

		// Iterate Tokens
		for (const tokenName in apiPrices) {
			const existingTimes: number[] = []

			// Get Local Times
			if (localPrices[tokenName]) {
				for (const record of localPrices[tokenName]) {
					existingTimes.push(record.time)
				}
			}

			// Iterate API Prices
			for (const record of apiPrices[tokenName]) {
				const { time, price } = record
				if (!existingTimes.includes(record.time)) {
					insertRecords.push({
						symbol: tokenName,
						time,
						price,
					})
				}
			}
		}
		return insertRecords
	}

	/**
	 * Sync Missing Prices
	 */

	private async syncMissingPrices(insertRecords: LocalPriceData[]) {
		const requests: Promise<any>[] = []
		for (const record of insertRecords) {
			requests.push(insertPrice(record))
		}
		await Promise.all(requests)
	}

	/**
	 * Update Transaction Data
	 */

	private updateTransactionData(transPrices: TokenPrices) {
		// Get Matching Price
		const getMatchingPrice = (prices: PriceData[], time: number) => {
			for (const price of prices) {
				if (price.time == time) {
					return price
				}
			}
			return false
		}

		// Get Price And Value
		const getPriceAndValue = (priceInfo: PriceData, quantity: number) => {
			const price = priceInfo.price
			const value = price * quantity
			return { price, value }
		}

		// Set Price And Value
		const setPriceAndValue = (
			transaction: HistoryRecord,
			info: ReturnType<typeof getPriceAndValue>,
			type: BaseOrQuote
		) => {
			const { price, value } = info
			if (type == 'quote') {
				transaction.quotePriceUSD = price
				transaction.quoteValueUSD = value
				if (transaction.baseSymbol == FIAT_CURRENCY) {
					transaction.baseValueUSD = transaction.quoteValueUSD * -1
					transaction.baseQuantity = transaction.baseValueUSD
				}
			} else if (type == 'base') {
				transaction.basePriceUSD = price
				transaction.baseValueUSD = value
			}
		}

		// Iterate Prices
		for (const tokenName in transPrices) {
			// Iterate Chains
			for (const chainNm in this.chains) {
				const chainName = chainNm as keyof Chains
				const chain = this.chains[chainName]

				// Iterate Transactions
				for (const transaction of chain.transactions) {
					const {
						quoteSymbol,
						baseSymbol,
						feeSymbol,
						feePriceUSD,
						quoteQuantity,
						baseQuantity,
						time: timeStr,
					} = transaction
					const time = this.getTimeMs(timeStr)
					const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol)
					const baseName = this.sterilizeTokenNameNoStub(baseSymbol)
					const quoteTokenMatch = tokenName == quoteName
					const baseTokenMatch = tokenName == baseName
					const quoteFeeMatch = quoteSymbol == feeSymbol && feePriceUSD
					const baseFeeMatch = baseSymbol == feeSymbol && feePriceUSD

					// Quote Token
					if (!quoteFeeMatch && quoteTokenMatch) {
						const priceMatch = getMatchingPrice(transPrices[tokenName], time)
						if (priceMatch && priceMatch.price) {
							const info = getPriceAndValue(priceMatch, quoteQuantity)
							setPriceAndValue(transaction, info, 'quote')
						}
					}

					// Quote Token is Fee Token
					else if (quoteFeeMatch) {
						const info = getPriceAndValue(
							{ price: feePriceUSD } as PriceData,
							quoteQuantity
						)
						setPriceAndValue(transaction, info, 'quote')
					}

					// Base Token
					if (!baseFeeMatch && baseTokenMatch) {
						const priceMatch = getMatchingPrice(transPrices[tokenName], time)
						if (priceMatch && priceMatch.price) {
							const info = getPriceAndValue(priceMatch, baseQuantity)
							setPriceAndValue(transaction, info, 'base')
						}
					}

					// Base Token is Fee Token
					else if (baseFeeMatch) {
						const info = getPriceAndValue(
							{ price: feePriceUSD } as PriceData,
							baseQuantity
						)
						setPriceAndValue(transaction, info, 'base')
					}
				}
			}
		}
		if (this.filterUnknownTokens) {
			this.getUnknownTokens()
			this.removeGarbagePriceInfo()
		}
	}

	/**
	 * Remove Garbage Price Info
	 */

	private removeGarbagePriceInfo() {
		if (!this.unknownTokens.length) return false
		let maxWhitelistValue = 0
		for (const chainName of this.chainNames) {
			const transactions = this.chains[chainName].transactions

			// Get Max Whitelist Value
			for (const transaction of transactions) {
				const { type, quoteSymbol, quoteValueUSD, quotePriceUSD } = transaction
				if (!quotePriceUSD) continue
				if (['send', 'receive'].includes(type)) {
					const isNativeToken = this.isNativeToken(quoteSymbol)
					const isStableCoin = this.isStableCoin(quoteSymbol, quotePriceUSD)
					if (isNativeToken || isStableCoin) {
						if (quoteValueUSD > maxWhitelistValue) {
							maxWhitelistValue = quoteValueUSD
						}
					}
				}
			}

			// Remove Garbage Prices
			for (const transaction of transactions) {
				const { quoteSymbol, quoteValueUSD, baseSymbol, baseValueUSD } =
					transaction
				const quoteIsUnknown = this.isUnknownToken(quoteSymbol)
				const baseIsUnknown = this.isUnknownToken(baseSymbol)
				if (quoteIsUnknown && quoteValueUSD > maxWhitelistValue) {
					transaction.quoteValueUSD = transaction.quotePriceUSD = 0
					if (transaction.baseSymbol == FIAT_CURRENCY) {
						transaction.baseValueUSD = transaction.baseQuantity = 0
					}
				}
				if (baseIsUnknown && baseValueUSD > maxWhitelistValue) {
					transaction.baseValueUSD = transaction.basePriceUSD = 0
				}
			}
		}
	}

	/**
	 * Infer Transaction Prices
	 */

	private inferTransactionPrices() {
		// Iterate Chains
		for (const chainName of this.chainNames) {
			const transactionsByHash: {
				[index: string]: {
					transactions: HistoryRecord[]
					quoteSymbols: string[]
					baseSymbols: string[]
				}
			} = {}
			const transactions = this.chains[chainName].transactions

			// Get Transactions by Hash
			for (const record of transactions) {
				const { id, type, quoteSymbol, baseSymbol } = record
				if (type == 'swap') {
					if (!transactionsByHash[id]) {
						transactionsByHash[id] = {
							transactions: [],
							quoteSymbols: [],
							baseSymbols: [],
						}
					}
					transactionsByHash[id].transactions.push(record)

					// Get Quote Symbols
					if (!transactionsByHash[id].quoteSymbols.includes(quoteSymbol)) {
						transactionsByHash[id].quoteSymbols.push(quoteSymbol)
					}

					// Get Base Symbols
					if (!transactionsByHash[id].baseSymbols.includes(baseSymbol)) {
						transactionsByHash[id].baseSymbols.push(baseSymbol)
					}
				}
			}

			// Iterate by Transaction Hash
			for (const id in transactionsByHash) {
				const { transactions, quoteSymbols, baseSymbols } =
					transactionsByHash[id]
				const transactionCount = transactions.length

				// Single Coin Swap
				if (quoteSymbols.length == baseSymbols.length) {
					this.inferSingleSwap(transactions[0])
				}

				// Multi Coin Swap
				else if (quoteSymbols.length != baseSymbols.length) {
					const singleIsBase = quoteSymbols.length > baseSymbols.length
					const missingIndexes: number[] = []
					const eligibleIndexes: number[] = []
					const ineligibleIndexes: number[] = []
					let eligibleTotal = 0
					let ineligibleTotal = 0
					let absSingleValueUSD = 0

					// Set Multi Info
					const setMultiInfo = (
						record: HistoryRecord,
						index: number,
						type: BaseOrQuote
					) => {
						const {
							quoteSymbol,
							baseSymbol,
							quotePriceUSD,
							basePriceUSD,
							quoteValueUSD,
							baseValueUSD,
						} = record

						const symbol = type == 'quote' ? quoteSymbol : baseSymbol
						const price = type == 'quote' ? quotePriceUSD : basePriceUSD
						const value = type == 'quote' ? quoteValueUSD : baseValueUSD

						// Set Missing Indexes
						if (!price) {
							missingIndexes.push(index)
						}

						// Get Total Single Token Value
						else {
							const isStableCoin = this.isStableCoin(symbol, price)
							const absRecordValueUSD = Math.abs(value)

							// Set Eligible Indexes
							if (!isStableCoin) {
								eligibleIndexes.push(index)
								eligibleTotal += absRecordValueUSD
							}

							// Set Ineligible Indexes
							else {
								ineligibleIndexes.push(index)
								ineligibleTotal += absRecordValueUSD
							}
						}
					}

					// Get Missing Indexes and Eligible Indexes
					for (const i in transactions) {
						const index = Number(i)
						const record = transactions[index]

						// Add Single Token Value
						const { quoteValueUSD, baseValueUSD } = record
						const absSingleRecordValueUSD = Math.abs(
							singleIsBase ? baseValueUSD : quoteValueUSD
						)
						absSingleValueUSD += absSingleRecordValueUSD

						// Single Base Token Info
						if (singleIsBase) {
							setMultiInfo(record, index, 'quote')
						}

						// Single Quote Token Info
						else {
							setMultiInfo(record, index, 'base')
						}
					}

					// Set Counts
					const missingCount = missingIndexes.length
					const completeCount = transactionCount - missingCount
					const ineligibleCount = ineligibleIndexes.length

					// Single Token has Price
					if (absSingleValueUSD) {
						// Has Missing Tokens
						if (missingCount) {
							// Get Total Multi Value & Get Average w/ Slippage
							const absMultiValueUSD = singleIsBase
								? absSingleValueUSD * (1 - slippageConfig.low)
								: absSingleValueUSD * (1 + slippageConfig.low)
							const avgValueUSD =
								(absMultiValueUSD - ineligibleTotal) /
								(transactionCount - ineligibleCount)

							// Iterate Missing/Eligible Records
							for (const index of [...missingIndexes, eligibleIndexes]) {
								const transaction = transactions[Number(index)]

								// Modify Quote Tokens
								if (singleIsBase) {
									this.setValueAndPrice(transaction, avgValueUSD, 'quote')
								}

								// Modify Base Tokens
								else {
									this.setValueAndPrice(transaction, avgValueUSD, 'base')
								}
							}
						}

						// No Missing Tokens
						else {
							const absMultiValueUSD = eligibleTotal + ineligibleTotal
							this.inferMultiSwap({
								absSingleValueUSD,
								absMultiValueUSD,
								singleIsBase,
								transactionCount,
								ineligibleCount,
								ineligibleTotal,
								ineligibleIndexes,
								transactions,
							})
						}
					}

					// Infer Single Token from Multi Prices
					else if (missingCount < transactionCount) {
						const avgMultiValueUSD =
							(eligibleTotal + ineligibleTotal) / completeCount
						const absMultiValueUSD = avgMultiValueUSD * transactionCount
						absSingleValueUSD = singleIsBase
							? absMultiValueUSD * (1 - slippageConfig.low)
							: absMultiValueUSD * (1 + slippageConfig.low)

						this.inferMultiSwap({
							absSingleValueUSD,
							absMultiValueUSD,
							singleIsBase,
							transactionCount,
							ineligibleCount,
							ineligibleTotal,
							ineligibleIndexes,
							transactions,
						})
					}
				}
			}
		}
	}

	/**
	 * Infer Single Swap
	 */

	private inferSingleSwap(record: HistoryRecord) {
		// Sterilize Swap
		const {
			quoteSymbol,
			quoteValueUSD,
			quotePriceUSD,
			baseSymbol,
			baseValueUSD,
			basePriceUSD,
		} = record
		const quoteIsStable = this.isStableCoin(quoteSymbol, quotePriceUSD)
		const baseIsStable = this.isStableCoin(baseSymbol, basePriceUSD)
		let absQuoteValueUSD = Math.abs(quoteValueUSD)
		let absBaseValueUSD = Math.abs(baseValueUSD)

		// Missing Quote
		if (absBaseValueUSD && !absQuoteValueUSD) {
			absQuoteValueUSD = absBaseValueUSD * (1 - slippageConfig.low)
			this.setValueAndPrice(record, absQuoteValueUSD, 'quote')
		}

		// Missing Base
		else if (absQuoteValueUSD && !absBaseValueUSD) {
			absBaseValueUSD = absQuoteValueUSD * (1 + slippageConfig.low)
			this.setValueAndPrice(record, absBaseValueUSD, 'base')
		}

		// Has Both Prices
		else if (
			absQuoteValueUSD &&
			absBaseValueUSD &&
			!(quoteIsStable && baseIsStable)
		) {
			// Calculate Values w/ Slippage
			const { upperUSD, lowerUSD, lowerQuote } =
				this.calculateTotalsWithSlippage(
					absQuoteValueUSD,
					absBaseValueUSD,
					quoteIsStable,
					baseIsStable
				)

			// Adjust Values w/ Slippage
			if (upperUSD && lowerUSD) {
				// Quote is lower
				if (lowerQuote) {
					this.setValueAndPrice(record, lowerUSD, 'quote')
					this.setValueAndPrice(record, upperUSD, 'base')
				}

				// Base is lower
				else {
					this.setValueAndPrice(record, upperUSD, 'quote')
					this.setValueAndPrice(record, lowerUSD, 'base')
				}
			}
		}
	}

	/**
	 * Infer Multi Swap
	 */

	private inferMultiSwap(args: InferMultiSwapArgs) {
		const {
			absSingleValueUSD,
			absMultiValueUSD,
			singleIsBase,
			transactionCount,
			ineligibleCount,
			ineligibleTotal,
			ineligibleIndexes,
			transactions,
		} = args

		// Get Quote and Base Value, Check if Stablecoin
		let absQuoteValueUSD = singleIsBase ? absMultiValueUSD : absSingleValueUSD
		let absBaseValueUSD = singleIsBase ? absSingleValueUSD : absMultiValueUSD
		let baseIsStable = singleIsBase
			? this.isStableCoin(
					transactions[0].baseSymbol,
					transactions[0].basePriceUSD
			  )
			: true
		let quoteIsStable = singleIsBase
			? true
			: this.isStableCoin(
					transactions[0].quoteSymbol,
					transactions[0].quotePriceUSD
			  )

		// Iterate Transactions to check for Stablecoins
		for (const record of transactions) {
			const { quoteSymbol, baseSymbol, quotePriceUSD, basePriceUSD } = record
			const isStableCoin = singleIsBase
				? this.isStableCoin(quoteSymbol, quotePriceUSD)
				: this.isStableCoin(baseSymbol, basePriceUSD)
			if (!isStableCoin) {
				if (singleIsBase) quoteIsStable = false
				else baseIsStable = false
				break
			}
		}

		// Calculate Totals w/ Slippage
		const { upperUSD, lowerUSD, lowerQuote } = this.calculateTotalsWithSlippage(
			absQuoteValueUSD,
			absBaseValueUSD,
			quoteIsStable,
			baseIsStable
		)

		// Get Quote and Base Values
		absQuoteValueUSD = (lowerQuote ? lowerUSD : upperUSD) || absQuoteValueUSD
		absBaseValueUSD = (lowerQuote ? upperUSD : lowerUSD) || absBaseValueUSD
		const avgQuoteValueUSD = singleIsBase
			? (absQuoteValueUSD - ineligibleTotal) /
			  (transactionCount - ineligibleCount)
			: absQuoteValueUSD / transactionCount
		const avgBaseValueUSD = singleIsBase
			? absBaseValueUSD / transactionCount
			: (absBaseValueUSD - ineligibleTotal) /
			  (transactionCount - ineligibleCount)

		// Set Value and Price for Transactions
		for (const i in transactions) {
			const index = Number(i)
			const record = transactions[index]
			const isEligible = !ineligibleIndexes.includes(index)

			// Base is Single Token
			if (singleIsBase) {
				this.setValueAndPrice(record, avgBaseValueUSD, 'base')
				if (isEligible) {
					this.setValueAndPrice(record, avgQuoteValueUSD, 'quote')
				}
			}

			// Quote is Single Token
			else {
				this.setValueAndPrice(record, avgQuoteValueUSD, 'quote')
				if (isEligible) {
					this.setValueAndPrice(record, avgBaseValueUSD, 'base')
				}
			}
		}
	}

	/**
	 * Set Value And Price
	 */

	private setValueAndPrice(
		record: HistoryRecord,
		value: number,
		type: BaseOrQuote
	) {
		// Quote
		if (type == 'quote') {
			const priceUSD = Math.abs(value / record.quoteQuantity)
			record.quoteValueUSD = record.quoteQuantity >= 0 ? value : value * -1
			record.quotePriceUSD = priceUSD
			if (record.quoteSymbol == record.feeSymbol) {
				record.feePriceUSD = record.quotePriceUSD
				record.feeValueUSD = record.feeQuantity * record.feePriceUSD
			}
		}

		// Base
		else {
			const priceUSD = Math.abs(value / record.baseQuantity)
			record.baseValueUSD = record.baseQuantity >= 0 ? value : value * -1
			record.basePriceUSD = priceUSD
			if (record.baseSymbol == record.feeSymbol) {
				record.feePriceUSD = record.basePriceUSD
				record.feeValueUSD = record.feeQuantity * record.feePriceUSD
			}
		}
	}

	/**
	 * Calculate Totals w/ Slippage
	 */

	private calculateTotalsWithSlippage(
		absQuoteValueUSD: number,
		absBaseValueUSD: number,
		quoteIsStable: boolean,
		baseIsStable: boolean
	) {
		const lowerQuote = absQuoteValueUSD <= absBaseValueUSD
		const min = lowerQuote ? absQuoteValueUSD : absBaseValueUSD
		const max = lowerQuote ? absBaseValueUSD : absQuoteValueUSD
		const diff = Math.abs(absBaseValueUSD - absQuoteValueUSD)
		const mid = min + diff / 2
		const slippageAmount = diff / absBaseValueUSD
		const hasMediumSlippage =
			slippageAmount > slippageConfig.low &&
			slippageAmount <= slippageConfig.high
		const hasHighSlippage = slippageAmount > slippageConfig.high
		let upperUSD = 0
		let lowerUSD = 0

		// Modify Slippage if not within low range and not stablecoins
		if (hasMediumSlippage || hasHighSlippage) {
			const slippageAdjust = hasMediumSlippage
				? slippageConfig.low
				: slippageConfig.high
			if (!quoteIsStable && !baseIsStable) {
				const upperMultiplier = 1 + slippageAdjust / 2
				const lowerMultiplier = 1 - slippageAdjust / 2
				upperUSD = mid * upperMultiplier
				lowerUSD = mid * lowerMultiplier
			} else if (
				(quoteIsStable && lowerQuote) ||
				(baseIsStable && !lowerQuote)
			) {
				const upperMultiplier = 1 + slippageAdjust
				upperUSD = min * upperMultiplier
				lowerUSD = min
			} else if (
				(quoteIsStable && !lowerQuote) ||
				(baseIsStable && lowerQuote)
			) {
				const lowerMultiplier = 1 - slippageAdjust
				upperUSD = max
				lowerUSD = max * lowerMultiplier
			}
		}
		return {
			upperUSD,
			lowerUSD,
			lowerQuote,
		}
	}

	/**
	 * Get Valid Price Record
	 */

	private getValidPriceRecord(transTime: number, priceTimes: PriceData[]) {
		const validRecords = {
			equal: undefined as PriceData | undefined,
			future: undefined as PriceData | undefined,
			past: undefined as PriceData | undefined,
		}

		// Iterate Prices
		for (const info of priceTimes) {
			const curTime = info.time
			if (transTime == curTime) {
				validRecords.equal = info
				break
			} else if (this.isValidFutureTime(transTime, curTime)) {
				validRecords.future = info
			} else if (this.isValidPastTime(transTime, curTime)) {
				validRecords.past = info
			}
			if (validRecords.future && validRecords.past) {
				break
			}
		}
		const futureDiff = validRecords.future
			? validRecords.future.time - transTime
			: 0
		const pastDiff = validRecords.past ? transTime - validRecords.past.time : 0
		const closestValidRecord =
			pastDiff && futureDiff
				? pastDiff > futureDiff
					? validRecords.future
					: validRecords.past
				: undefined
		return validRecords.equal || closestValidRecord
	}

	/**
	 * Get Token Prices
	 */

	private async getTokenPrices(tokenId: string, daysOutList: number[]) {
		const times: number[] = []
		const prices: PriceData[] = []
		const requests: Promise<CoinGeckoPricesResponse>[] = []
		const fiatLower = FIAT_CURRENCY.toLowerCase()
		for (const daysOut of daysOutList) {
			requests.push(
				this.getCoinGeckoEndpoint(
					'coinGeckoPrices',
					{ $id: tokenId },
					{ vs_currency: fiatLower, days: daysOut }
				)
			)
		}
		const res = await Promise.all(requests)
		for (const result of res) {
			if (result?.prices?.length) {
				const records = result.prices
				for (const record of records) {
					const [time, price] = record
					if (!times.includes(time)) {
						times.push(time)
						prices.push({ time, price })
					}
				}
			}
		}
		prices.sort((a, b) => b.time - a.time)
		return prices
	}

	/**
	 * Get Days Out List
	 */

	private getDaysOutList(times: number[]) {
		const nowMs = this.getTimeMs()
		const daysOutList: number[] = []
		const firstCutoff = coinGeckoDayCutoffs[0]
		const firstCutoffMs = firstCutoff * ONE_DAY
		const secondCutoff = coinGeckoDayCutoffs[1]
		const secondCutoffMs = secondCutoff * ONE_DAY

		// Get Days Out
		const getDaysOut = (diff: number) => Math.ceil(diff / ONE_DAY) + 1

		let firstDaysSearch = 0
		let secondDaysSearch = 0
		let secondDaysMaxDiff = 0

		// Iterate Times
		for (const time of times) {
			const diff = nowMs - time
			if (!firstDaysSearch && diff <= firstCutoffMs) {
				firstDaysSearch = firstCutoff
			} else if (
				diff > firstCutoffMs &&
				diff <= secondCutoffMs &&
				diff > secondDaysMaxDiff
			) {
				secondDaysMaxDiff = diff
				secondDaysSearch = getDaysOut(diff)
				if (secondDaysSearch >= secondCutoff) {
					secondDaysSearch = secondCutoff
					break
				}
			}
		}

		// Get Max Days Out
		const minMs = times.length ? Math.min(...times) : 0
		const maxDiff = minMs ? Math.abs(nowMs - minMs) : 0
		const maxDays = maxDiff ? getDaysOut(maxDiff) : 0

		// Add Days Out
		if (firstDaysSearch) daysOutList.push(firstDaysSearch)
		if (secondDaysSearch) daysOutList.push(secondDaysSearch)
		if (maxDays && maxDays > secondCutoff) daysOutList.push(maxDays)
		return daysOutList
	}

	/**
	 * Get Coin Gecko Endpoint
	 */

	private async getCoinGeckoEndpoint(
		endpoint: keyof typeof ENDPOINTS,
		replaceArgs?: any,
		params?: any
	): Promise<any> {
		const url = getFormattedURL(ENDPOINTS[endpoint], replaceArgs)

		// Get URL
		const getUrl = async () => {
			this.manageApiLimits()
			return await this.getEndpoint(
				'coinGecko',
				url as keyof typeof ENDPOINTS,
				params
			)
		}

		// Manage API Limits
		const nowMs = this.getTimeMs()
		const diffMs = this.nextApiCallMs - nowMs

		if (diffMs <= 0) {
			return await getUrl()
		} else {
			await waitMs(diffMs)
			return await this.getCoinGeckoEndpoint(endpoint, replaceArgs, params)
		}
	}

	/**
	 * Manage API Limits
	 */

	private manageApiLimits() {
		const nowMs = this.getTimeMs()
		const currentBlockMs = nowMs - coinGeckoLimits.ms

		// Remove Old Calls
		for (let i = 0; i < this.recentApiCalls.length; i++) {
			const callMs = this.recentApiCalls[0]
			if (callMs < currentBlockMs) {
				this.recentApiCalls.splice(0, 1)
			} else {
				break
			}
		}

		// Check if block is over call limit
		this.recentApiCalls.push(nowMs)
		const numCalls = this.recentApiCalls.length
		if (numCalls > coinGeckoLimits.calls) {
			// Remove Excess Calls
			const excessCalls = numCalls - coinGeckoLimits.calls
			for (let i = 0; i < excessCalls; i++) {
				this.recentApiCalls.splice(0, 1)
			}

			// Set Next API Call Time
			this.nextApiCallMs = this.recentApiCalls[0] + coinGeckoLimits.ms
		}
	}

	/**
	 * Add Token Time
	 */

	private addTokenTime(
		tokenTimes: TokenTimes,
		tokenName: string,
		time: number
	) {
		if (!tokenTimes[tokenName]) {
			tokenTimes[tokenName] = [time]
		} else {
			if (!tokenTimes[tokenName].includes(time)) {
				tokenTimes[tokenName].push(time)
			}
		}
	}

	/**
	 * Is Valid Future Time
	 */

	private isValidFutureTime(transTime: number, localTime: number) {
		return localTime > transTime && localTime - transTime < ONE_DAY
	}

	/**
	 * Is Valid Past Time
	 */

	private isValidPastTime(transTime: number, localTime: number) {
		return transTime > localTime && transTime - localTime < ONE_DAY
	}

	/**
	 * Get Time in ms
	 */

	private getTimeMs(dateStr?: string) {
		return dateStr ? new Date(dateStr).getTime() : new Date().getTime()
	}
}
