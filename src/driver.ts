import DefiInfo from './'
import { DriverArgs } from './utils/types'

// Test Type

type Test = {
	logTransactions?: boolean
	logChainDeposits?: boolean
	logAssets?: boolean
}

// Init

const info = new DefiInfo()

// Main

const main = async (args?: DriverArgs & Test) => {
	const { logTransactions, logChainDeposits, logAssets } = {
		logTransactions: false,
		logChainDeposits: false,
		logAssets: false,
		...args,
	}
	await info.driver(args)
	if (logTransactions) logTrans()
	if (logChainDeposits) logDeposits()
	if (logAssets) console.log(info.assets)

	// Testing
}

// Log Deposits

const logDeposits = () => {
	for (const chainName of info.chainNames) {
		const deposits = info.chains[chainName].deposits
		console.log(chainName, deposits)
	}
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
			const quote = quoteSymbol.padEnd(columnPadding, ' ')
			const base = baseSymbol.padEnd(columnPadding, ' ')
			const quoteVal = quoteValueUSD
				.toFixed(valueDecimals)
				.padEnd(columnPadding, ' ')
			const quotePrice = quotePriceUSD
				.toFixed(priceDecimals)
				.padEnd(columnPadding, ' ')
			const baseVal = baseValueUSD
				.toFixed(valueDecimals)
				.padEnd(columnPadding, ' ')
			const basePrice = basePriceUSD
				.toFixed(priceDecimals)
				.padEnd(columnPadding, ' ')
			console.log(line)
			console.log(quote, '|', quoteVal, '|', quotePrice)
			console.log(base, '|', baseVal, '|', basePrice)
			console.log(line, '\n')
		}
	}
}

// Run

main({
	useDebank: false,
	useTempTransactions: false,
	filterUnknownTokens: true,
	getBalances: true,
	getTransactions: true,
	getPrices: true,
	logTransactions: true,
	logAssets: true,
	logChainDeposits: true,
})
