import DefiInfo from './'

// Init

const info = new DefiInfo()

// Main

const main = async (getTransactions = false, useDebank = true) => {
	if (getTransactions) {
		await info.getTransactions(useDebank)
		for (const chainName in info.chains) {
			console.log(
				info.chains[chainName as keyof typeof info.chains].transactions
			)
		}
	} else {
		await info.getBalances()
		console.log(info.assets)
	}
}

// Run

main(true, false)
