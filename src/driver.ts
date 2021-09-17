import DefiInfo from './'
import { DriverArgs } from './utils/types'

// Test Type

type Test = {
	logTransactions?: boolean
	logAssets?: boolean
}

// Init

const info = new DefiInfo()

// Main

const main = async (args?: DriverArgs & Test) => {
	const { logTransactions, logAssets } = {
		logTransactions: false,
		logAssets: false,
		...args,
	}
	await info.driver(args)
	if (logTransactions) logTrans()
	if (logAssets) console.log(info.assets)

	// Test Logs
}

// Log Transactions

const logTrans = () => {
	const priceDecimals = 4
	const valueDecimals = 10
	const columnPadding = 20
	const line = '-'.repeat(columnPadding * 4)
	for (const chainNm in info.chains) {
		const chainName = chainNm as keyof typeof info.chains
		for (const transaction of info.chains[chainName].transactions) {
			const {
				quoteSymbol,
				quotePriceUSD,
				quoteValueUSD,
				baseSymbol,
				basePriceUSD,
				baseValueUSD,
			} = transaction
			const quote = quoteSymbol.padEnd(columnPadding * 1.5, ' ')
			const base = baseSymbol.padEnd(columnPadding * 1.5, ' ')
			const quoteVal = quoteValueUSD
				.toFixed(valueDecimals)
				.padStart(columnPadding, ' ')
			const quotePrice = quotePriceUSD
				.toFixed(priceDecimals)
				.padStart(columnPadding, ' ')
			const baseVal = baseValueUSD
				.toFixed(valueDecimals)
				.padStart(columnPadding, ' ')
			const basePrice = basePriceUSD
				.toFixed(priceDecimals)
				.padStart(columnPadding, ' ')
			console.log(line)
			console.log(quote, '|', quoteVal, '|', quotePrice)
			console.log(base, '|', baseVal, '|', basePrice)
			console.log(line, '\n')
		}
	}
}

// Run

main({
	useDebank: true,
	filterUnknownTokens: true,
	getBalances: true,
	getTransactions: true,
	getPrices: true,
	logTransactions: true,
	logAssets: false,
})
