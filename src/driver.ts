import DefiInfo from './'

// Init

const info = new DefiInfo()

// Main

const main = async (
	useDebank = true,
	getTransactions = false,
	logTransactions = false
) => {
	if (getTransactions) {
		await info.getTransactions(useDebank)
		await info.getPriceData()
		if (logTransactions) logTrans()
	} else {
		await info.getBalances()
		console.log(info.assets)
	}
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

main(true, true, true)
