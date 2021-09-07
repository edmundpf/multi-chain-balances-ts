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
			console.log(transaction)
		}
	}
}

// Run

main({
	useDebank: false,
	getTransactions: true,
	getPrices: false,
	getBalances: true,
	filterUnknownTokens: true,
	useTempTransactions: false,
	logTransactions: false,
	logAssets: true,
})
