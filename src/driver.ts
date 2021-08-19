import DefiInfo from './'

// Init

const info = new DefiInfo()

// Main

const main = async (getTransactions = false, useReq = true) => {
	if (getTransactions) {
		await transactions(useReq)
	} else {
		await info.getBalances()
	}
}

// Transactions

const transactions = async (useReq = true) => {
	let total = 0
	await info.getTransactions(useReq)
	for (const chainName in info.transactions) {
		if (chainName == 'matic') continue
		for (
			const record of info.transactions[chainName as keyof typeof info.transactions]
		) {
			const { type, amount, fromAddress } = record
			if (type == 'deposit') {
				if (chainName == 'bsc' && !fromAddress.startsWith('0X000')) continue
				console.log(record)
				total += amount
			}
		}
	}
}

// Run

main(true, true)
