import MultiChain from './'

// Main

const main = async () => {
	const wallet = new MultiChain()
	await wallet.driver()
	console.log(wallet.assets)
	return true
}

// Run

main()
