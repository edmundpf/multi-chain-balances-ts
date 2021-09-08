import DefiTransactions from './DefiTransactions'
import { waitMs } from './misc'
import { writeFileSync, readFileSync } from 'fs'
import { prepareDB, selectPrices, insertPrice } from './priceData'
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
} from './types'
import {
	ENDPOINTS,
	coinGeckoLimits,
	coinGeckoDayCutoffs,
	ONE_DAY,
	FIAT_CURRENCY,
	defaultDriverArgs,
	slippageConfig,
	TEMP_TRANSACTION_FILE,
} from './values'

/**
 * DefiPrices Class
 */

export default class DefiPrices extends DefiTransactions {
	// Properties

	private nextApiCallMs = 0
	private recentApiCalls: number[] = []

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
			useTempTransactions,
		} = {
			...defaultDriverArgs,
			...args,
		}
		if (getTransactions && !useTempTransactions) {
			await this.getTransactions(useDebank)
		}
		if (filterUnknownTokens) this.getUnknownTokens()
		if (getPrices) await this.getPriceData(useTempTransactions)
		if (getBalances) await this.getBalances()
	}

	/**
	 * Get Price Data
	 */

	private async getPriceData(useTempTransactions = false) {
		if (!useTempTransactions || !this.readTempFile()) {
			await prepareDB()
			const supportedTokens = await this.getSupportedTokens()
			const supportedTokenNames = Object.keys(supportedTokens)
			const transTokenTimes = this.getTokenTransactionTimes(supportedTokenNames)
			const transTokenNames = Object.keys(transTokenTimes)
			const localPrices = await this.getLocalPrices(transTokenNames)
			const { transPrices, missingTimes } = this.linkLocalPrices(
				transTokenTimes,
				localPrices
			)
			const daysOutLists = this.getAllDaysOutLists(missingTimes)
			const apiPrices = await this.getAllTokenPrices(
				daysOutLists,
				supportedTokens
			)
			const insertRecords = this.getInsertRecords(localPrices, apiPrices)
			const mergedPrices = this.mergeApiAndLocalPrices(localPrices, apiPrices)
			this.linkMergedPrices(transPrices, mergedPrices)
			this.updateTransactionData(transPrices)
			this.inferTransactionPrices()
			await this.syncMissingPrices(insertRecords)
			this.writeTempFile()
		} else {
			this.inferTransactionPrices()
		}
	}

	/**
	 * Read Temp File
	 */

	private readTempFile() {
		try {
			const data = JSON.parse(readFileSync(TEMP_TRANSACTION_FILE, 'utf-8'))
			for (const chainNm in data) {
				const chainName = chainNm as keyof Chains
				this.chains[chainName].transactions = data[chainName] as HistoryRecord[]
			}
			return true
		} catch (err) {
			return false
		}
	}

	/**
	 * Write Temp File
	 */

	private writeTempFile() {
		const data: { [index: string]: HistoryRecord[] } = {}
		for (const chainName of this.chainNames) {
			data[chainName] = this.chains[chainName].transactions
		}
		writeFileSync(TEMP_TRANSACTION_FILE, JSON.stringify(data, null, 2))
	}

	/**
	 * Get Supported Tokens
	 */

	private async getSupportedTokens() {
		const supportedTokens: StringDict = {}
		const res: CoinGeckoToken[] = await this.getCoinGeckoEndpoint(
			'coinGeckoList'
		)
		if (res?.length) {
			for (const record of res) {
				const tokenName = this.sterilizeTokenName(record.symbol)
				if (tokenName && !supportedTokens[tokenName]) {
					supportedTokens[tokenName] = record.id
				}
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
				const { quoteSymbol, baseSymbol, feeSymbol, feePriceUSD, date } =
					transaction
				const time = this.getTimeMs(date)
				const hasFeePrice = feePriceUSD ? true : false
				const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol, chainName)
				const baseName = this.sterilizeTokenNameNoStub(baseSymbol, chainName)
				const quoteSupported = supportedTokenNames.includes(quoteName)
				const baseSupported = supportedTokenNames.includes(baseName)
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
			type: 'quote' | 'base'
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
						date,
					} = transaction
					const time = this.getTimeMs(date)
					const quoteName = this.sterilizeTokenNameNoStub(
						quoteSymbol,
						chainName
					)
					const baseName = this.sterilizeTokenNameNoStub(baseSymbol, chainName)
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
					else if (!baseFeeMatch && baseTokenMatch) {
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
	}

	/**
	 * Infer Transaction Prices
	 */

	private inferTransactionPrices() {
		// Iterate Chains
		for (const chainName of this.chainNames) {
			const transRecs: {
				[index: string]: {
					recs: HistoryRecord[]
					quoteSymbols: string[]
					baseSymbols: string[]
				}
			} = {}
			const transactions = this.chains[chainName].transactions

			// Get Transactions by Hash
			for (const record of transactions) {
				const { id, quoteSymbol, baseSymbol, type } = record
				if (type == 'swap') {
					if (!transRecs[id]) {
						transRecs[id] = {
							recs: [],
							quoteSymbols: [],
							baseSymbols: [],
						}
					}
					transRecs[id].recs.push(record)
					if (!transRecs[id].quoteSymbols.includes(quoteSymbol)) {
						transRecs[id].quoteSymbols.push(quoteSymbol)
					}
					if (!transRecs[id].baseSymbols.includes(baseSymbol)) {
						transRecs[id].baseSymbols.push(baseSymbol)
					}
				}
			}

			// Iterate by Transaction Hash
			for (const id in transRecs) {
				const { recs, quoteSymbols, baseSymbols } = transRecs[id]
				const transCount = recs.length

				// Single Coin Swap
				if (quoteSymbols.length == baseSymbols.length) {
					this.inferSingleSwap(recs[0])
				}

				// Multi Coin Swap
				else if (quoteSymbols.length != baseSymbols.length) {
					const compIsBase = quoteSymbols.length > baseSymbols.length
					const multiInfo = {
						completeIndexes: [] as number[],
						missingIndexes: [] as number[],
						eligibleIndexes: [] as number[],
						ineligibleIndexes: [] as number[],
						eligibleTotal: 0,
						ineligibleTotal: 0,
						completeCount: 0,
						missingCount: 0,
						eligibleCount: 0,
						ineligibleCount: 0,
					}
					let absCompValueUSD = 0

					// Set Multi Info
					const setMultiInfo = (
						symbol: string,
						price: number,
						compValue: number,
						index: number
					) => {
						if (!price) {
							multiInfo.missingIndexes.push(index)
						} else {
							const isStableCoin = this.isStableCoin(symbol, price)
							const absRecValueUSD = Math.abs(compValue)
							multiInfo.completeIndexes.push(index)
							absCompValueUSD += absRecValueUSD
							if (!isStableCoin) {
								multiInfo.eligibleIndexes.push(index)
								multiInfo.eligibleTotal += absRecValueUSD
							} else {
								multiInfo.ineligibleIndexes.push(index)
								multiInfo.ineligibleTotal += absRecValueUSD
							}
						}
					}

					// Get Missing Indexes and Eligible Indexes
					for (const i in recs) {
						const index = Number(i)
						const record = recs[index]
						const {
							quoteSymbol,
							quotePriceUSD,
							quoteValueUSD,
							baseSymbol,
							basePriceUSD,
							baseValueUSD,
						} = record

						// Single Base Token
						if (compIsBase) {
							setMultiInfo(quoteSymbol, quotePriceUSD, baseValueUSD, index)
						}

						// Single Quote Token
						else {
							setMultiInfo(baseSymbol, basePriceUSD, quoteValueUSD, index)
						}
					}

					// Set Counts
					multiInfo.completeCount = multiInfo.completeIndexes.length
					multiInfo.missingCount = multiInfo.missingIndexes.length
					multiInfo.eligibleCount = multiInfo.eligibleIndexes.length
					multiInfo.ineligibleCount = multiInfo.ineligibleIndexes.length

					// Single Token has Price
					if (absCompValueUSD) {
						// Base is Single Token
						if (compIsBase) {
							// To-Do
						}

						// Quote is Single Token
						else {
							// To-Do
						}
					}

					// Infer Single Token from Multi Prices
					else if (multiInfo.missingCount < transCount) {
						// To-Do
					}
				}
			}
		}
	}

	/**
	 * Infer Single Swap
	 */

	private inferSingleSwap(record: HistoryRecord) {
		// Set Value And Price
		const setValueAndPrice = (
			record: HistoryRecord,
			value: number,
			type: 'base' | 'quote'
		) => {
			if (type == 'quote') {
				const priceUSD = Math.abs(value / record.quoteQuantity)
				record.quoteValueUSD = record.quoteQuantity >= 0 ? value : value * -1
				record.quotePriceUSD = priceUSD
				if (record.quoteSymbol == record.feeSymbol) {
					record.feePriceUSD = record.quotePriceUSD
					record.feeValueUSD = record.feeQuantity * record.feePriceUSD
				}
			} else {
				const priceUSD = Math.abs(value / record.baseQuantity)
				record.baseValueUSD = record.baseQuantity >= 0 ? value : value * -1
				record.basePriceUSD = priceUSD
				if (record.baseSymbol == record.feeSymbol) {
					record.feePriceUSD = record.basePriceUSD
					record.feeValueUSD = record.feeQuantity * record.feePriceUSD
				}
			}
		}

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
			absQuoteValueUSD = Math.max(absBaseValueUSD * (1 - slippageConfig.low), 0)
			setValueAndPrice(record, absQuoteValueUSD, 'quote')
		}

		// Missing Base
		else if (absQuoteValueUSD && !absBaseValueUSD) {
			absBaseValueUSD = Math.max(absQuoteValueUSD * (1 + slippageConfig.low), 0)
			setValueAndPrice(record, absBaseValueUSD, 'base')
		}

		// Has Both Prices
		else if (
			absQuoteValueUSD &&
			absBaseValueUSD &&
			!(quoteIsStable && baseIsStable)
		) {
			// Calculate Slippage
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

			// Modify Slippage if not within low range and not stablecoins
			if (
				!(quoteIsStable && baseIsStable) &&
				(hasMediumSlippage || hasHighSlippage)
			) {
				let upperUSD = 0
				let lowerUSD = 0
				const slippageAdjust = hasMediumSlippage
					? slippageConfig.low
					: slippageConfig.high
				if (!quoteIsStable && !baseIsStable) {
					upperUSD = mid + slippageConfig.low / 2
					lowerUSD = Math.max(mid - slippageConfig.low / 2, 0)
				} else if (
					(quoteIsStable && lowerQuote) ||
					(baseIsStable && !lowerQuote)
				) {
					upperUSD = min + slippageAdjust
					lowerUSD = min
				} else if (
					(quoteIsStable && !lowerQuote) ||
					(baseIsStable && lowerQuote)
				) {
					upperUSD = max
					lowerUSD = Math.max(max - slippageAdjust, 0)
				}

				// Quote is lower
				if (lowerQuote) {
					setValueAndPrice(record, lowerUSD, 'quote')
					setValueAndPrice(record, upperUSD, 'base')
				}

				// Base is lower
				else {
					setValueAndPrice(record, upperUSD, 'quote')
					setValueAndPrice(record, lowerUSD, 'base')
				}
			}
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
	 * Get Days Out Lits
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
		// Format URL
		let url = ENDPOINTS[endpoint]
		if (replaceArgs) {
			for (const key in replaceArgs) {
				if (url.includes(key)) {
					url = url.replace(key, replaceArgs[key])
				}
			}
		}

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
