import DefiBalances from './DefiBalances'
import {
	NATIVE_TOKENS,
	ENDPOINTS,
	APEBOARD_CHAIN_ALIASES,
	defaultHistoryRecord,
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
				if (result && !(result as any)?.statusCode) {
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
			let historyRecords: HistoryRecord[] = []
			for (const record of records) {
				const nestedRecord = this.sterilizeHistoryRecord(
					record,
					chainName,
					debankTokens[index]
				)
				const splitRecords = this.splitHistoryRecord(nestedRecord)
				historyRecords = [...historyRecords, ...splitRecords]
			}
			this.chains[chainName].transactions = historyRecords
		}
	}

	/**
	 * Sterilize History Record
	 */

	sterilizeHistoryRecord(
		record: DebankHistory | ApeBoardHistory,
		chainName: keyof typeof NATIVE_TOKENS,
		tokenSymbols: DebankTokens
	) {
		const debankRec = record as DebankHistory
		const apeBoardRec = record as ApeBoardHistory
		const tokens: TokenRecords = {}

		// Add Token
		const addToken = (
			info: ReturnType<DefiTransactions['sterilizeDebankTransfer']>
		) => {
			const { token, quantity } = info
			if (quantity != 0) {
				tokens[token] = {
					amount: 0,
					quantity,
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
		const hash = debankRec.id || apeBoardRec.hash || ''
		const date = new Date(
			debankRec.time_at * 1000 || apeBoardRec.timestamp
		).toISOString()
		const toAddress =
			debankRec.tx?.to_addr || apeBoardRec.interactions?.[0]?.to || this.address
		const fromAddress =
			debankRec.tx?.from_addr ||
			debankRec.other_addr ||
			apeBoardRec.interactions?.[0]?.from ||
			this.address
		const feeToken = NATIVE_TOKENS[chainName]
		const feeQuantity =
			debankRec.tx?.eth_gas_fee || apeBoardRec.fee?.[0]?.amount || 0
		let feePrice = apeBoardRec.fee?.[0]?.price || 0
		let fees = debankRec.tx?.usd_gas_fee || 0
		feePrice = feePrice || fees / feeQuantity || 0
		fees = fees || feeQuantity * feePrice || 0

		// Get Tokens Info
		if (apeBoardRec.transfers) {
			for (const record of apeBoardRec.transfers) {
				const tokenInfo = this.sterilizeApeBoardTransfer(record)
				addToken(tokenInfo)
			}
		} else {
			for (const record of debankRec.sends) {
				const tokenInfo = this.sterilizeDebankTransfer(
					record,
					true,
					tokenSymbols
				)
				addToken(tokenInfo)
			}
			for (const record of debankRec.receives) {
				const tokenInfo = this.sterilizeDebankTransfer(
					record,
					false,
					tokenSymbols
				)
				addToken(tokenInfo)
			}
		}

		// Sterilize Type
		type = this.sterilizeTransactionType(type, tokens)

		// Get Direction
		const direction = ['receive', 'swap'].includes(type) ? 'credit' : 'debit'

		// Format Result
		return {
			...defaultHistoryRecord,
			id: hash,
			date,
			type,
			direction,
			tokens,
			basePrice: 0,
			fees,
			feeQuantity,
			feePrice,
			feeToken,
			chain: chainName,
			fromAddress,
			toAddress,
		} as HistoryRecord
	}

	/**
	 * Split History Record
	 */

	splitHistoryRecord(record: HistoryRecord) {
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
					const quantity = compareIsBase
						? record.tokens[quote].quantity
						: getQuantity(record.tokens[quote].quantity, iterTokens.length)
					const baseQuantity = compareIsBase
						? getQuantity(record.tokens[base].quantity, iterTokens.length)
						: record.tokens[base].quantity
					const feeQuantity = getQuantity(record.feeQuantity, iterTokens.length)
					const fees = getFees(feeQuantity, record.feePrice)
					const ticker = getTicker(quote, base)
					const splitRecord = {
						...record,
						ticker,
						quote,
						base,
						quantity,
						baseQuantity,
						fees,
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
					const base = record.base
					const quantity = curToken.quantity
					const feeQuantity = getQuantity(record.feeQuantity, numTokens)
					const fees = getFees(feeQuantity, record.feePrice)
					const ticker = getTicker(quote, base)
					const splitRecord = {
						...record,
						ticker,
						quote,
						quantity,
						fees,
						feeQuantity,
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
	 * Sterilize Ape Board Transfer
	 */

	sterilizeApeBoardTransfer(record: ApeBoardTransfer) {
		const { symbol, tokenAddress, balance, type } = record
		const token = (symbol || tokenAddress).toUpperCase()
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

	sterilizeDebankTransfer(
		record: DebankTransfer,
		isSend = true,
		tokenSymbols: DebankTokens
	) {
		const { amount, token_id: tokenId } = record
		const token = (tokenSymbols[tokenId].symbol || tokenId).toUpperCase()
		const quantity = isSend ? amount * -1 : amount
		return {
			token,
			quantity,
		}
	}

	/**
	 * Sterilize Transaction Type
	 */

	sterilizeTransactionType(type: string, tokens: TokenRecords) {
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
}
