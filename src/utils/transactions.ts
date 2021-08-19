import { DefiRow, HistoryRecord } from './types'

/**
 * Is Beefy Receipt
 */

export const isBeefyReceipt = (row: DefiRow) =>
	row.token_name && row.token_name.includes('moo')

/**
 * Is LP
 */

export const isLP = (row: DefiRow) =>
	row.token_name && row.token_name.toUpperCase().includes('LP')

/**
 * Is Buy
 */

export const checkBuy = (row: DefiRow) => row.treatment == 'buy'

/**
 * Is Sell
 */

export const checkSell = (row: DefiRow) => row.treatment == 'sell'

/**
 * Check Fee
 */

export const checkFee = (row: DefiRow) => row.treatment == 'burn'

/**
 * Get Token Name
 */

export const getTokenName = (row: DefiRow) =>
	row.token_name ? row.token_name.toUpperCase() : row.token_contract || ''

/**
 * Get Ticker
 */

export const getTicker = (quote: string, base: string) => `${quote}-${base}`

/**
 * Set Deposit
 */

export const setDeposit = (
	transRec: HistoryRecord,
	info: {
		token: string
		quantity: number
		amount: number
		price: number
		from: string
		to?: string
	}
) => {
	const { token, quantity, amount, price, from, to } = info
	transRec.type = 'deposit'
	transRec.direction = 'buy'
	transRec.quote = token
	transRec.ticker = getTicker(transRec.quote, transRec.base)
	transRec.quantity = quantity
	transRec.amount = amount
	transRec.price = price
	transRec.baseAmount = amount
	transRec.baseQuantity = amount
	transRec.basePrice = 1
	transRec.fills = 1
	transRec.fromAddress = from || ''
	transRec.toAddress = to || ''
}
