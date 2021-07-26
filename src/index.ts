import MultiChain from './utils/MultiChain'

// Main

const main = async () => {
	const wallet = new MultiChain()
	await wallet.driver()
}

// Run

main()

// Export

export default MultiChain
