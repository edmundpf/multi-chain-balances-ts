import DefiInfo from './'

// Init

const info = new DefiInfo()

// Main

const main = async (getTransactions = false) => {
	if (getTransactions) {
		await transactions()
	} else {
		await info.getBalances()
		console.log(info.assets)
	}
}

// Transactions

const transactions = async () => {
	await info.getTransactions()
}

// Run

main(false)
