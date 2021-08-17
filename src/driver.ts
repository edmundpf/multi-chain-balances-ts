import MultiChain from './'

// Main

const main = async () => {
	const wallet = new MultiChain()
	await wallet.driver()
	let total = 0
	for (const chainName in wallet.transactions) {
		if (chainName == 'matic') continue
		for (
			const record of wallet.transactions[chainName as keyof typeof wallet.transactions]
		) {
			const { type, amount, fromAddress } = record
			if (type == 'deposit') {
				if (chainName == 'bsc' && !fromAddress.startsWith('0X000')) continue
				console.log(record)
				total += amount
			}
		}
	}
	console.log(total)
	return true
}

// Run

main()
