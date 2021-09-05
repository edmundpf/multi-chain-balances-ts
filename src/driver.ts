import DefiInfo from './'

// Init

const info = new DefiInfo()

// Main

const main = async (getTransactions = false, useDebank = true) => {
	if (getTransactions) {
		await info.getTransactions(useDebank)
		for (const chainName in info.chains) {
			const chain = info.chains[chainName as keyof typeof info.chains]
			console.log(chain.transactions)
		}
	} else {
		await info.getBalances()
		console.log(info.assets)
	}
}

// Run

main(true, false)
