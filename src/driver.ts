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
	if (logAssets) console.log(info.assets)
	if (logTransactions) logTrans()

	// Testing
}

// Log Transactions

const logTrans = () => {
	for (const chainNm in info.chains) {
		const chainName = chainNm as keyof typeof info.chains
		for (const transaction of info.chains[chainName].transactions) {
			if (
				transaction.type != 'swap' &&
				(transaction.quoteValueUSD || transaction.baseValueUSD)
			) {
				console.log('Quote', transaction.quoteSymbol, transaction.quoteValueUSD)
				console.log(
					'Base',
					transaction.baseSymbol,
					transaction.baseValueUSD,
					'\n'
				)
			}
		}
	}
}

// Run

main({
	useDebank: false,
	getTransactions: true,
	getPrices: true,
	getBalances: false,
	filterUnknownTokens: false,
	useTempTransactions: true,
	logTransactions: false,
	logAssets: false,
})
