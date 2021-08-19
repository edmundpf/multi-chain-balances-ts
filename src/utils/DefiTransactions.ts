import DefiBalances from './DefiBalances'
import { readFileSync } from 'fs'
import {
	checkBuy,
	checkSell,
	checkFee,
	getTokenName,
	getTicker,
	setDeposit,
} from './transactions'
import { ENDPOINTS, initTrans, defaultHistoryRecord } from './values'
import { DefiTransaction, HistoryRecord, TokenRecords } from './types'

// Init

const DUMMY_TRANSACTIONS_FILE = 'trans.json'

/**
 * DefiTransactions Class
 */

export default class DefiTransactions extends DefiBalances {
	// Properties

	transactions = initTrans()

	/**
	 * Get Transactions
	 */

	async getTransactions(useReq = true) {
		const requests: Promise<any>[] = []

		if (useReq) {
			// Defi Taxes Request
			const processRequest = this.getDefiTaxesEndpoint.bind(
				this,
				'defiTaxesProcess'
			)

			// Chain Aliases
			const chainAliases = {
				bsc: 'BSC',
				eth: 'ETH',
				matic: 'Polygon',
			}

			// Send Requests
			for (const chainName of this.chainNames) {
				requests.push(
					processRequest({ chain: chainAliases[chainName] || chainName })
				)
			}
		}

		// Resolve Requests
		const res: Array<DefiTransaction[]> = useReq
			? await Promise.all(requests)
			: JSON.parse(readFileSync(DUMMY_TRANSACTIONS_FILE, 'utf-8'))

		// Iterate Chains
		for (const index in res) {
			const result = res[index]
			const chainName = this.chainNames[index]
			for (const record of result) {
				// Transaction Details
				const { hash, rows, type: transType, ts: timeNum } = record

				// Transaction Properties
				const date = new Date(Number(timeNum) * 1000).toISOString()
				const type = transType || ''
				const transRec: HistoryRecord = {
					...defaultHistoryRecord,
					id: hash,
					date,
					type,
					chain: chainName,
				}

				// Addresses
				let toAddress = ''
				let fromAddress = ''

				// Token Info
				const tokens: TokenRecords = {}
				const tokenTypes = {
					buys: [] as string[],
					sells: [] as string[],
				}

				// Token Checks
				for (const row of rows) {
					const tokenName = getTokenName(row)

					// Get Buy Tokens
					if (checkBuy(row) && !tokenTypes.buys.includes(tokenName)) {
						tokenTypes.buys.push(tokenName)
					}

					// Get Sell Tokens
					else if (checkSell(row) && !tokenTypes.sells.includes(tokenName)) {
						tokenTypes.sells.push(tokenName)
					}
				}

				// Iterate Rows
				for (const row of rows) {
					// Row Details
					const { to, from, value, rate, treatment } = row

					// Row Properties
					const token = getTokenName(row)
					const isFee = checkFee(row)
					const hasBuys = tokenTypes.buys.includes(token)
					const hasSells = tokenTypes.sells.includes(token)
					const quantity = value || 0
					const price = rate || 0
					const amount = quantity * price

					// Swap
					if (type == 'swap') {
						transRec.type == 'swap'
						transRec.direction == 'buy'
						transRec.fills = 1

						// Quote Token
						if (!isFee && hasBuys && !hasSells) {
							tokens[token] = {
								quantity,
								amount,
								price,
								fills: 1,
								type: 'quote',
							}
						}

						// Base Token
						else if (!isFee && hasSells) {
							const isBuy = checkBuy(row)
							const adjQuantity = isBuy ? quantity * -1 : quantity
							const adjAmount = adjQuantity * price
							if (!isBuy) {
								toAddress = to || ''
								fromAddress = from || ''
							}
							if (!tokens[token]) {
								tokens[token] = {
									quantity: adjQuantity,
									amount: adjAmount,
									price,
									fills: 1,
									type: 'base',
								}
							} else {
								const {
									quantity: prevQuantity,
									amount: prevAmount,
									price: prevPrice,
									fills: prevFills,
								} = tokens[token]
								const newFills = prevFills + 1
								tokens[token].fills = newFills
								tokens[token].quantity = adjQuantity + prevQuantity
								tokens[token].amount = adjAmount + prevAmount
								tokens[token].price = (prevPrice * prevFills + price) / newFills
							}
						}

						// Fee Token
						else if (isFee) {
							transRec.feeToken = token
							transRec.fees = amount
							transRec.feeQuantity = quantity
							transRec.feePrice = price
						}
					}

					// Fees
					else if (type == 'fee') {
						transRec.type = 'fee'
						transRec.direction = 'buy'
						transRec.feeToken = token
						transRec.fees = amount
						transRec.feeQuantity = quantity
						transRec.feePrice = price
						transRec.fromAddress = from || ''
						this.transactions[chainName].push(transRec)
						break
					}

					// Unknown
					else if (!type) {
						// Receive
						if (treatment == 'gift' && rows.length == 1) {
							setDeposit(transRec, {
								token,
								quantity,
								amount,
								price,
								from,
								to,
							})
							this.transactions[chainName].push(transRec)
							break
						}
					}

					// Deposits
					else if (type.includes('deposit') && rows.length == 1) {
						setDeposit(transRec, {
							token,
							quantity,
							amount,
							price,
							from,
							to,
						})
						console.log('DEPOSIT')
						this.transactions[chainName].push(transRec)
						break
					}
				}

				// Convert tokens to transaction
				if (Object.keys(tokens).length > 0) {
					for (const tokenName in tokens) {
						const { type, quantity, amount, price } = tokens[tokenName]
						if (type == 'quote') {
							transRec.quote = tokenName
							transRec.quantity = quantity
							transRec.amount = amount
							transRec.price = price
						} else if (type == 'base') {
							transRec.base = tokenName
							transRec.baseQuantity = quantity
							transRec.baseAmount = amount
							transRec.basePrice = price
						}
					}
					const ticker =
						transRec.quote && transRec.base
							? getTicker(transRec.quote, transRec.base)
							: transRec.quote || ''
					let curAmount = transRec.amount
						? transRec.amount
						: transRec.baseAmount
					let baseAmount = transRec.baseAmount
						? transRec.baseAmount
						: transRec.amount
					curAmount = curAmount > baseAmount ? baseAmount : curAmount
					baseAmount = curAmount
					const curPrice = transRec.price
						? transRec.price
						: curAmount / transRec.quantity
					const basePrice = transRec.basePrice
						? transRec.basePrice
						: baseAmount / transRec.baseQuantity

					// Update Transaction
					transRec.ticker = ticker
					transRec.fromAddress = fromAddress
					transRec.toAddress = toAddress
					transRec.amount = curAmount
					transRec.price = curPrice
					transRec.baseAmount = baseAmount
					transRec.basePrice = basePrice
					this.transactions[chainName].push(transRec)
				}
			}
		}
	}

	/**
	 * Get Defi Taxes Endpoint
	 */

	private async getDefiTaxesEndpoint(
		endpoint: keyof typeof ENDPOINTS,
		args: any
	) {
		return await this.getEndpoint('defiTaxes', endpoint, {
			address: this.address,
			...args,
		})
	}
}
