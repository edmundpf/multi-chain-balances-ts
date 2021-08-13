import MultiChain from './'

// Main

const main = async () => {
	const wallet = new MultiChain()
	await wallet.driver()
	// console.log(wallet.assets)
	// console.log(wallet.transactions.bsc)
	for (const record of wallet.transactions.bsc) {
		console.log(
			record.quote,
			record.base,
			record.amount,
			record.baseAmount,
			record.fees,
		)
	}
	return true
}

// Run

main()
