import DefiBalances from './DefiBalances'
import {
	NATIVE_TOKENS,
	ENDPOINTS,
	APEBOARD_CHAIN_ALIASES,
	defaultHistoryRecord,
	FIAT_CURRENCY,
} from './values'
import {
	DebankTransfer,
	DebankHistory,
	DebankTokens,
	DebankTransResponse,
	ApeBoardTransfer,
	ApeBoardHistory,
	ApeBoardTransResponse,
	TokenRecords,
	HistoryRecord,
	Chains,
} from './types'

/**
 * DefiTransactions Class
 */

export default class DefiTransactions extends DefiBalances {
	/**
	 * Get Transactions
	 */

	async getTransactions(useDebank = true) {
		const debankRequests: (Promise<DebankTransResponse> | undefined)[] = []
		const apeBoardRequests: (Promise<ApeBoardTransResponse> | undefined)[] = []
		const rawChains: (DebankHistory[] | ApeBoardHistory[] | undefined)[] = []
		const debankTokens: DebankTokens[] = []
		// Get Info from Debank
		const getInfoFromDebank = async () => {
			for (const index in this.chainNames) {
				const chainName = this.chainNames[index]
				if (!rawChains[index]) {
					debankRequests.push(
						this.getPrivateDebankEndpoint('debankHistory', { chain: chainName })
					)
				} else {
					debankRequests.push(undefined)
				}
			}
			const res = await Promise.all(debankRequests)
			const isFilled = rawChains.length == this.chainNames.length
			for (const index in res) {
				const result = res[index]
				if (result?.data?.history_list && !(result as any)?.error_msg) {
					rawChains[index] = result.data.history_list
				} else if (!rawChains[index]) {
					rawChains[index] = isFilled ? [] : undefined
				}
				debankTokens.push(result?.data?.token_dict || {})
			}
		}

		// Get Info from Ape Board
		const getInfoFromApeBoard = async () => {
			for (const index in this.chainNames) {
				const chainName = this.chainNames[index]
				const chainAlias = APEBOARD_CHAIN_ALIASES[chainName]
				if (!rawChains[index]) {
					const endpoint =
						`${ENDPOINTS['apeBoardHistory']}/${chainAlias}` as keyof typeof ENDPOINTS
					apeBoardRequests.push(this.getApeBoardEndpoint(endpoint))
				} else {
					apeBoardRequests.push(undefined)
				}
			}
			const res = await Promise.all(apeBoardRequests)
			const isFilled = rawChains.length == this.chainNames.length
			for (const index in res) {
				const result = res[index]
				if (
					result &&
					!(result as any)?.statusCode &&
					!(result as any)?.hasError
				) {
					rawChains[index] = result
				} else if (!rawChains[index]) {
					rawChains[index] = isFilled ? [] : undefined
				}
			}
		}

		// Get Info
		if (useDebank) {
			await getInfoFromDebank()
			await getInfoFromApeBoard()
		} else {
			await getInfoFromApeBoard()
			await getInfoFromDebank()
		}

		// Iterate Chain Results
		for (const index in rawChains) {
			const chainName = this.chainNames[index]
			const records = rawChains[index] as ApeBoardHistory[] | DebankHistory[]
			const transactionHashes: string[] = []
			let historyRecords: HistoryRecord[] = this.chains[chainName].transactions

			// Get Token Addresses
			const tokenAddresses = this.getTokenAddresses(
				records,
				debankTokens[index]
			)

			// Get existing hashes from imported history records
			if (historyRecords.length) {
				for (const record of historyRecords) {
					const { id } = record
					if (!transactionHashes.includes(id)) transactionHashes.push(id)
				}
			}

			// Iterate Records
			for (const record of records) {
				// Skip existing hashes
				if (
					transactionHashes.length &&
					transactionHashes.includes(this.getTransactionID(record))
				) {
					continue
				}

				// Sterilize Records
				const { nestedRecord, dustTokens } = this.sterilizeHistoryRecord(
					record,
					chainName,
					debankTokens[index],
					tokenAddresses
				)
				const splitRecords = this.splitHistoryRecord(nestedRecord)
				let dustRecords: HistoryRecord[] = []
				if (Object.keys(dustTokens).length) {
					const { nestedRecord: nestedDustRecord } =
						this.sterilizeHistoryRecord(
							record,
							chainName,
							debankTokens[index],
							tokenAddresses,
							dustTokens
						)
					dustRecords = this.splitHistoryRecord(nestedDustRecord)
				}
				historyRecords = [...historyRecords, ...splitRecords, ...dustRecords]
			}
			this.chains[chainName].transactions = historyRecords.sort((a, b) =>
				a.date < b.date ? 1 : -1
			)
		}
	}

	/**
	 * Get Unknown Tokens
	 */

	getUnknownTokens() {
		const initInfo = {
			firstTransIsReceive: false,
			hasSwapOrSend: false,
			price: 0,
		}
		const tokenInfo: { [index: string]: typeof initInfo } = {}
		for (const chainNm in this.chains) {
			const chainName = chainNm as keyof Chains
			const chain = this.chains[chainName]
			for (let i = chain.transactions.length - 1; i >= 0; i--) {
				const transaction = chain.transactions[i]
				const { quoteSymbol, quotePriceUSD, baseSymbol, type } = transaction
				const quoteName = this.sterilizeTokenNameNoStub(quoteSymbol)
				const baseName = this.sterilizeTokenNameNoStub(baseSymbol)
				const quoteIsNative = this.isNativeToken(quoteName)
				const isReceive = type == 'receive'
				const isSwapOrSend = ['swap', 'send'].includes(type)
				if (!quoteIsNative && !tokenInfo[quoteName]) {
					tokenInfo[quoteName] = {
						...initInfo,
						firstTransIsReceive: isReceive,
						price: quotePriceUSD,
					}
				}
				if (
					tokenInfo[quoteName] &&
					tokenInfo[quoteName].firstTransIsReceive &&
					isSwapOrSend &&
					!tokenInfo[quoteName].hasSwapOrSend
				) {
					tokenInfo[quoteName].hasSwapOrSend = true
				} else if (
					tokenInfo[baseName] &&
					tokenInfo[baseName].firstTransIsReceive &&
					isSwapOrSend &&
					!tokenInfo[baseName].hasSwapOrSend
				) {
					tokenInfo[baseName].hasSwapOrSend = true
				}
			}
		}
		for (const tokenName in tokenInfo) {
			const token = tokenInfo[tokenName]
			if (token.firstTransIsReceive && !token.hasSwapOrSend) {
				const isStableCoin = this.isStableCoin(tokenName, token.price || 1)
				if (!isStableCoin) this.unknownTokens.push(tokenName)
			}
		}
	}

	/**
	 * Sterilize History Record
	 */

	private sterilizeHistoryRecord(
		record: DebankHistory | ApeBoardHistory,
		chainName: keyof typeof NATIVE_TOKENS,
		tokenSymbols: DebankTokens,
		tokenAddresses: ReturnType<DefiTransactions['getTokenAddresses']>,
		dustInfo?: TokenRecords
	) {
		const debankRec = record as DebankHistory
		const apeBoardRec = record as ApeBoardHistory
		const tokens: TokenRecords = { ...dustInfo }
		const dustTokens: TokenRecords = {}

		// Add Token
		const addToken = (
			info: ReturnType<DefiTransactions['sterilizeDebankTransfer']>
		) => {
			const { token, quantity } = info
			if (quantity != 0 && quantity != tokens[token]?.quantity) {
				const tokenQuantity = (tokens[token]?.quantity || 0) + quantity
				tokens[token] = {
					amount: 0,
					quantity: tokenQuantity,
					price: 0,
				}
			}
		}

		// Get Universal Info
		let type =
			debankRec.cate_id ||
			debankRec.tx?.name ||
			apeBoardRec.interactions?.[0]?.function ||
			''
		const hash = this.getTransactionID(record)
		const date = new Date(
			debankRec.time_at * 1000 || apeBoardRec.timestamp
		).toISOString()
		let toAddress = (
			debankRec.tx?.to_addr ||
			apeBoardRec.interactions?.[0]?.to ||
			this.address
		).toLowerCase()
		let fromAddress = (
			debankRec.tx?.from_addr ||
			debankRec.other_addr ||
			apeBoardRec.interactions?.[0]?.from ||
			this.address
		).toLowerCase()
		const feeSymbol = NATIVE_TOKENS[chainName]
		let feeQuantity =
			debankRec.tx?.eth_gas_fee || apeBoardRec.fee?.[0]?.amount || 0
		let feePriceUSD = apeBoardRec.fee?.[0]?.price || 0
		let feeValueUSD = debankRec.tx?.usd_gas_fee || 0

		// Dust Info
		if (dustInfo) {
			if (toAddress != this.address) {
				fromAddress = toAddress
				toAddress = this.address
			}
			feeQuantity = feePriceUSD = feeValueUSD = 0
		}

		// Normal Records
		else {
			feePriceUSD = feePriceUSD || feeValueUSD / feeQuantity || 0
			feeValueUSD = feeValueUSD || feeQuantity * feePriceUSD || 0

			// Get Tokens Info
			if (apeBoardRec.transfers) {
				for (const record of apeBoardRec.transfers) {
					const tokenInfo = this.sterilizeApeBoardTransfer(
						record,
						chainName,
						tokenAddresses
					)
					addToken(tokenInfo)
				}
			} else {
				for (const record of debankRec.sends) {
					const tokenInfo = this.sterilizeDebankTransfer(
						record,
						chainName,
						true,
						tokenSymbols,
						tokenAddresses
					)
					addToken(tokenInfo)
				}
				for (const record of debankRec.receives) {
					const tokenInfo = this.sterilizeDebankTransfer(
						record,
						chainName,
						false,
						tokenSymbols,
						tokenAddresses
					)
					addToken(tokenInfo)
				}
			}
		}

		// Sterilize Type
		type = this.sterilizeTransactionType(type, tokens)

		// Merge Wrapped/Unwrapped Token Dust from Swaps
		const tokenNames = Object.keys(tokens)
		if (type == 'swap' && tokenNames.length > 2) {
			for (const wrappedTokenName in tokens) {
				if (wrappedTokenName[0] == 'W') {
					const unwrappedTokenName = wrappedTokenName.substring(1)
					if (tokenNames.includes(unwrappedTokenName)) {
						const { quantity: wrappedQuantity } = tokens[wrappedTokenName]
						const { quantity: unwrappedQuantity } = tokens[unwrappedTokenName]
						if (Math.abs(unwrappedQuantity) >= Math.abs(wrappedQuantity)) {
							dustTokens[wrappedTokenName] = { ...tokens[wrappedTokenName] }
							delete tokens[wrappedTokenName]
						} else {
							dustTokens[unwrappedTokenName] = { ...tokens[unwrappedTokenName] }
							delete tokens[unwrappedTokenName]
						}
					}
				}
			}
		}

		// Get Direction
		const direction = ['receive', 'swap'].includes(type) ? 'credit' : 'debit'

		// Format Result
		return {
			dustTokens,
			nestedRecord: {
				...defaultHistoryRecord,
				id: hash,
				date,
				feeSymbol,
				type,
				direction,
				feeQuantity,
				feeValueUSD,
				feePriceUSD,
				chain: chainName,
				fromAddress,
				toAddress,
				tokens,
			} as HistoryRecord,
		}
	}

	/**
	 * Split History Record
	 */

	private splitHistoryRecord(record: HistoryRecord) {
		const splitRecords: HistoryRecord[] = []

		// Get Quantity
		const getQuantity = (oldQuantity: number, numRecords: number) =>
			oldQuantity / numRecords

		// Get Fees
		const getFees = (feeQuantity: number, feePrice: number) =>
			feeQuantity * feePrice

		// Get Ticker
		const getTicker = (quote: string, base: string) => {
			const hasDashes = quote.includes('-') || base.includes('-')
			return hasDashes ? `${quote}/${base}` : `${quote}-${base}`
		}

		if (record.tokens) {
			// Swaps
			if (record.type == 'swap') {
				const debitTokens: string[] = []
				const creditTokens: string[] = []
				let iterTokens = creditTokens
				let compareToken = ''
				let compareIsBase = true

				// Get Debit & Credit Tokens
				for (const tokenName in record.tokens) {
					const token = record.tokens[tokenName]
					const isDebit = token.quantity < 0
					if (isDebit) debitTokens.push(tokenName)
					else creditTokens.push(tokenName)
				}

				// Multiple Buy Tokens or 1-1 Swap
				if (creditTokens.length >= debitTokens.length) {
					compareToken = debitTokens[0]
				}

				// Multiple Sell Tokens
				else if (debitTokens.length > creditTokens.length) {
					compareToken = creditTokens[0]
					iterTokens = debitTokens
					compareIsBase = false
				}

				// Iterate Tokens
				for (const tokenName of iterTokens) {
					const quote = compareIsBase ? tokenName : compareToken
					const base = compareIsBase ? compareToken : tokenName
					const quoteQuantity = compareIsBase
						? record.tokens[quote].quantity
						: getQuantity(record.tokens[quote].quantity, iterTokens.length)
					const baseQuantity = compareIsBase
						? getQuantity(record.tokens[base].quantity, iterTokens.length)
						: record.tokens[base].quantity
					const feeQuantity = getQuantity(record.feeQuantity, iterTokens.length)
					const feeValueUSD = getFees(feeQuantity, record.feePriceUSD)
					const ticker = getTicker(quote, base)
					const splitRecord: HistoryRecord = {
						...record,
						ticker,
						quoteSymbol: quote,
						baseSymbol: base,
						quoteQuantity,
						baseQuantity,
						basePriceUSD: base == FIAT_CURRENCY ? 1 : 0,
						feeValueUSD,
						feeQuantity,
					}
					delete splitRecord.tokens
					splitRecords.push(splitRecord)
				}
			}

			// Sends/Receives
			else if (['send', 'receive'].includes(record.type)) {
				const numTokens = Object.keys(record.tokens).length
				for (const tokenName in record.tokens) {
					const curToken = record.tokens[tokenName]
					const quote = tokenName
					const base = record.baseSymbol
					const quoteQuantity = curToken.quantity
					const feeQuantity = getQuantity(record.feeQuantity, numTokens)
					const feeValueUSD = getFees(feeQuantity, record.feePriceUSD)
					const ticker = getTicker(quote, base)
					const splitRecord: HistoryRecord = {
						...record,
						ticker,
						quoteSymbol: quote,
						quoteQuantity,
						feeQuantity,
						feeValueUSD,
					}
					delete splitRecord.tokens
					splitRecords.push(splitRecord)
				}
			}

			// Failures & Approvals
			else {
				const splitRecord = record
				delete splitRecord.tokens
				splitRecords.push(splitRecord)
			}
		}
		return splitRecords
	}

	/**
	 * Get Token Addresses
	 */

	private getTokenAddresses(
		records: ApeBoardHistory[] | DebankHistory[],
		tokenSymbols: DebankTokens
	) {
		const symbols: { [index: string]: string[] } = {}
		// Add Contract
		const addContract = (symbol: string, address: string) => {
			const upperSymbol = symbol.toUpperCase()
			const lowerAddress = address.toLowerCase()
			const isContract = this.isContract(lowerAddress)
			if (upperSymbol && isContract) {
				if (!symbols[upperSymbol]) {
					symbols[upperSymbol] = [lowerAddress]
				} else if (!symbols[upperSymbol].includes(lowerAddress)) {
					symbols[upperSymbol].push(lowerAddress)
				}
			}
		}

		// Iterate Records
		for (const record of records) {
			const debankRec = record as DebankHistory
			const apeBoardRec = record as ApeBoardHistory
			if (debankRec?.sends?.length) {
				for (const transfer of debankRec.sends) {
					const address = transfer.token_id || ''
					const symbol = tokenSymbols[address].symbol || ''
					addContract(symbol, address)
				}
			}
			if (debankRec?.receives?.length) {
				for (const transfer of debankRec.sends) {
					const address = transfer.token_id || ''
					const symbol = tokenSymbols[address].symbol || ''
					addContract(symbol, address)
				}
			}
			if (apeBoardRec?.transfers?.length) {
				for (const transfer of apeBoardRec.transfers) {
					const address = transfer.tokenAddress || ''
					const symbol = transfer.symbol || ''
					addContract(symbol, address)
				}
			}
		}
		return symbols
	}

	/**
	 * Get Token Name
	 */

	private getTokenName(
		symbol: string,
		address: string,
		chainName: keyof Chains,
		tokenAddresses: ReturnType<DefiTransactions['getTokenAddresses']>
	) {
		let newSymbol = (symbol || '').replace(/ /g, '-')
		const upperSymbol = newSymbol.toUpperCase()
		const upperChain = chainName.toUpperCase()
		const lowerAddress = (address || '').toLowerCase()

		// Capitalize Native Tokens
		const isNativeToken = this.isNativeToken(upperSymbol)
		if (isNativeToken) newSymbol = upperSymbol

		// Rename Duplicate Symbols
		if (tokenAddresses[upperSymbol] && tokenAddresses[upperSymbol].length > 1) {
			const addressStub = this.getAddressStub(lowerAddress)
			newSymbol = `${newSymbol}-${upperChain}-0x${addressStub}`
		}

		// Add New Token Addresses
		if (this.chains[chainName].tokenAddresses[newSymbol] == null) {
			this.chains[chainName].tokenAddresses[newSymbol] = this.isContract(
				lowerAddress
			)
				? lowerAddress
				: ''
		}
		return newSymbol || lowerAddress
	}

	/**
	 * Sterilize Ape Board Transfer
	 */

	private sterilizeApeBoardTransfer(
		record: ApeBoardTransfer,
		chainName: keyof Chains,
		tokenAddresses: ReturnType<DefiTransactions['getTokenAddresses']>
	) {
		const { symbol, tokenAddress, balance, type } = record
		const token = this.getTokenName(
			symbol,
			tokenAddress,
			chainName,
			tokenAddresses
		)
		const isDebit = type == 'out'
		const quantity = isDebit ? balance * -1 : balance
		return {
			token,
			quantity,
		}
	}

	/**
	 * Sterilize Debank Transfer
	 */

	private sterilizeDebankTransfer(
		record: DebankTransfer,
		chainName: keyof Chains,
		isSend = true,
		tokenSymbols: DebankTokens,
		tokenAddresses: ReturnType<DefiTransactions['getTokenAddresses']>
	) {
		const { amount, token_id: tokenId } = record
		const token = this.getTokenName(
			tokenSymbols[tokenId].symbol,
			tokenId,
			chainName,
			tokenAddresses
		)
		const quantity = isSend ? amount * -1 : amount
		return {
			token,
			quantity,
		}
	}

	/**
	 * Sterilize Transaction Type
	 */

	private sterilizeTransactionType(type: string, tokens: TokenRecords) {
		let newType = type
		const tokenKeys = Object.keys(tokens)
		const numTokens = tokenKeys.length

		// Check for Debits & Credits
		let hasDebit = false
		let hasCredit = false
		for (const tokenKey in tokens) {
			const token = tokens[tokenKey]
			if (token.quantity > 0) hasCredit = true
			else if (token.quantity < 0) hasDebit = true
			if (hasDebit && hasCredit) break
		}

		// Receive
		if (numTokens >= 1 && hasCredit && !hasDebit) {
			newType = 'receive'
		}

		// Send
		else if (numTokens >= 1 && hasDebit && !hasCredit) {
			newType = 'send'
		}

		// Swap
		else if (numTokens > 1 && hasDebit && hasCredit) {
			newType = 'swap'
		}

		// Failure
		else if (type != 'approve' && !numTokens) {
			newType = 'failure'
		}
		return newType
	}

	/**
	 * Get Private Debank Endpoint
	 */

	private async getPrivateDebankEndpoint(
		endpoint: keyof typeof ENDPOINTS,
		params?: any
	) {
		return await this.getEndpoint('debankPrivate', endpoint, {
			...params,
			user_addr: this.address,
		})
	}

	/**
	 * Get Transaction ID
	 */

	private getTransactionID(record: DebankHistory | ApeBoardHistory) {
		return (
			(record as DebankHistory).id ||
			(record as ApeBoardHistory).hash ||
			''
		).toLowerCase()
	}

	/**
	 * Is Contract
	 */

	private isContract(address: string) {
		return address.startsWith('0x')
	}
}
