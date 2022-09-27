import startCase from 'lodash.startcase'
import camelCase from 'lodash.camelcase'

// Title Case
export const titleCase = (str: string) => startCase(camelCase(str))

// Has Number
export const hasNumber = (str: string) => /\d/.test(str)

// Wait Milliseconds
export const waitMs = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

// Native to Decimal
export const nativeToDecimal = (nativeNum: number | string, decimals = 18) => {
	const nativeStr = String(nativeNum).padStart(decimals, '0')
	const startStr = nativeStr.substring(0, nativeStr.length - decimals) || '0'
	const endStr = nativeStr.substring(nativeStr.length - decimals)
	return Number(startStr + '.' + endStr)
}
