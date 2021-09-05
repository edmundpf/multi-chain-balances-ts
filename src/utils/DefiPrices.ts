import DefiTransactions from './DefiTransactions'
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
} from './types'
import {
	ENDPOINTS,
	coinGeckoLimits,
	coinGeckoDayCutoffs,
	ONE_DAY,
} from './values'

/**
 * DefiPrices Class
 */

export default class DefiPrices extends DefiTransactions {
	// Properties

	private nextApiCallMs = 0
	private recentApiCalls: number[] = []

	/**
	 * Get Price Data
	 */

	async getPriceData() {
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
		const mergedPrices = this.mergeApiAndLocalPrices(localPrices, apiPrices)
		const insertRecords = this.getInsertRecords(localPrices, apiPrices)
		this.linkMergedPrices(transPrices, mergedPrices)
		await this.syncMissingPrices(insertRecords)
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

				// Add Quote Time
				if (quoteSupported && !quoteHasNativePrice) {
					this.addTokenTime(tokenTimes, quoteName, time)
				}

				// Add Base Time
				if (baseSupported && !baseHasNativePrice) {
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
		const requests: Promise<PriceData[]>[] = []
		const tokenNames = Object.keys(daysOutLists)
		for (const tokenName in daysOutLists) {
			const daysOutList = daysOutLists[tokenName]
			if (daysOutList?.length) {
				requests.push(
					this.getTokenPrices(supportedTokens[tokenName], daysOutList)
				)
			}
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
		const mergedPrices: TokenPrices = localPrices
		for (const tokenName in apiPrices) {
			if (!mergedPrices[tokenName]) {
				mergedPrices[tokenName] = apiPrices[tokenName]
			} else {
				mergedPrices[tokenName] = [
					...mergedPrices[tokenName],
					...apiPrices[tokenName],
				].sort((a, b) => (a.time < b.time ? 1 : -1))
			}
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
						transTimes[index] = validLocalRecord
					}
				}
			}
		}
	}

	/**
	 * Get Insert Records
	 */

	private getInsertRecords(localPrices: TokenPrices, apiPrices: TokenPrices) {
		const localTimes: TokenTimes = {}
		const insertRecords: LocalPriceData[] = []

		// Get Local Times
		for (const tokenName in localPrices) {
			localTimes[tokenName] = []
			for (const record of localPrices[tokenName]) {
				localTimes[tokenName].push(record.time)
			}
		}

		// Compare API Times
		for (const tokenName in apiPrices) {
			const existingTimes = localTimes[tokenName]
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
		// Has Matching Price
		const hasMatchingPrice = (prices: PriceData[], time: number) => {
			for (const price of prices) {
				if (price.time == time) {
					return true
				}
			}
			return false
		}

		// Iterate Prices
		for (const tokenName in transPrices) {
			// Iterate Chains
			for (const chainNm in this.chainNames) {
				const chainName = chainNm as keyof Chains
				const chain = this.chains[chainName]

				// Iterate Transactions
				for (const transaction of chain.transactions) {
					const { quoteSymbol, baseSymbol, date } = transaction
					const time = this.getTimeMs(date)
					const quoteName = this.sterilizeTokenNameNoStub(
						quoteSymbol,
						chainName
					)
					const baseName = this.sterilizeTokenNameNoStub(baseSymbol, chainName)
					if (tokenName == quoteName) {
						if (hasMatchingPrice(transPrices[tokenName], time)) {
							// Price Here
						}
					} else if (tokenName == baseName) {
						if (hasMatchingPrice(transPrices[tokenName], time)) {
							// Price Here
						}
					}
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
					? validRecords.past
					: validRecords.future
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
		for (const daysOut of daysOutList) {
			requests.push(
				this.getCoinGeckoEndpoint(
					'coinGeckoPrices',
					{ $id: tokenId },
					{ vs_currency: 'usd', days: daysOut }
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
		const getDaysOut = (diff: number) => Math.floor(diff / ONE_DAY) + 1

		let firstDaysSearch = 0
		let secondDaysSearch = 0

		// Iterate Times
		for (const time of times) {
			const diff = nowMs - time
			if (!firstDaysSearch && diff <= firstCutoffMs) {
				firstDaysSearch = firstCutoff
			} else if (
				!secondDaysSearch &&
				diff > firstCutoffMs &&
				diff <= secondCutoffMs
			) {
				secondDaysSearch = getDaysOut(diff)
				break
			}
		}

		// Get Maxes
		const maxMs = times.length ? Math.max(...times) : 0
		const maxDiff = maxMs ? Math.abs(nowMs - maxMs) : 0
		const maxDays = maxDiff ? getDaysOut(maxDiff) : 0

		// Add Days Out
		if (firstDaysSearch) daysOutList.push(firstDaysSearch)
		if (secondDaysSearch) daysOutList.push(secondDaysSearch)
		if (maxDays) daysOutList.push(maxDays)
		return daysOutList
	}

	/**
	 * Get Coin Gecko Endpoint
	 */

	private async getCoinGeckoEndpoint(
		endpoint: keyof typeof ENDPOINTS,
		replaceArgs?: any,
		params?: any
	) {
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
		if (!this.nextApiCallMs) {
			return await getUrl()
		} else {
			const nowMs = this.getTimeMs()
			const diffMs = nowMs - this.nextApiCallMs
			return setTimeout(getUrl, diffMs)
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
	 * Sterilize Token Name
	 */

	private sterilizeTokenName(token: string) {
		return (token || '').replace(/ /g, '-').toUpperCase()
	}

	/**
	 * Remove Token Contract Stub
	 */

	private sterilizeTokenNameNoStub(tokenName: string, chainName: keyof Chains) {
		let curName = tokenName
		if (tokenName.includes('-')) {
			const dashParts = tokenName.split('-')
			const lastPart = dashParts[dashParts.length - 1]
			const addressStub = this.getAddressStub(
				this.chains[chainName].tokenAddresses[tokenName]
			)
			if (lastPart == addressStub) {
				dashParts.pop()
				curName = dashParts.join('-')
			}
		}
		return this.sterilizeTokenName(curName)
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
