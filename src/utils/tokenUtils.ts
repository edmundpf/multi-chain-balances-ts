import { TokenAddresses } from './types'
import { NATIVE_TOKENS, FIAT_CURRENCY, stableCoinConfig } from './values'

/**
 * Formatting
 */

// Symbol With Dashes
export const symbolWithDashes = (symbol: string) =>
	(symbol || '').replace(/ /g, '-')

// Get Address Stub
export const getAddressStub = (address: string) =>
	address.toLowerCase().includes('0x')
		? address.substring(2, 6).toUpperCase()
		: address.substring(0, 4).toUpperCase()

// Sterilize Token Name
export const sterilizeTokenName = (token: string) =>
	symbolWithDashes(token).toUpperCase()

// Remove Token Contract Stub
export const sterilizeTokenNameNoStub = (tokenName: string) => {
	let curName = tokenName
	if (tokenName.includes('-')) {
		let dashParts = tokenName.split('-')
		const lastPart = dashParts[dashParts.length - 1]
		const isPool = lastPart == 'Pool'
		const hasStub = lastPart.startsWith('0x') && lastPart.length == 6
		if (!isPool && hasStub) {
			dashParts = dashParts.slice(0, dashParts.length - 2)
			curName = dashParts.join('-')
		}
	}
	return sterilizeTokenName(curName)
}

/**
 * Validation
 */

// Is Contract
export const isContract = (address: string) => address.startsWith('0x')

// Is Native Token
export const isNativeToken = (tokenName: string) =>
	Object.values(NATIVE_TOKENS).includes(tokenName)

// Is Stablecoin
export const isStableCoin = (tokenName: string, price: number) => {
	const upperToken = tokenName.toUpperCase()
	const isNormalStable = upperToken.includes(FIAT_CURRENCY)
	const isOtherStable = stableCoinConfig.otherCoins.includes(tokenName)
	const withinError =
		price >= 1 - stableCoinConfig.errorPercent &&
		price <= 1 + stableCoinConfig.errorPercent
	return (isNormalStable || isOtherStable) && withinError
}

// Is Unknown Token
export const isUnknownToken = (unknownTokens: string[], symbol: string) => {
	const sterileSymbol = sterilizeTokenNameNoStub(symbol)
	return unknownTokens.includes(sterileSymbol)
}

/**
 * Misc
 */

// Add Contract Symbol/Address
export const addContract = (
	symbols: TokenAddresses,
	symbol: string,
	address: string
) => {
	if (symbol) {
		const upperSymbol = symbolWithDashes(symbol).toUpperCase()
		const lowerAddress = address.toLowerCase()
		const addressIsContract = isContract(lowerAddress)
		if (addressIsContract) {
			if (!symbols[upperSymbol]) {
				symbols[upperSymbol] = [lowerAddress]
			} else if (!symbols[upperSymbol].includes(lowerAddress)) {
				symbols[upperSymbol].push(lowerAddress)
			}
		}
	}
}
