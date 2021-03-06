import startCase from 'lodash.startcase'
import camelCase from 'lodash.camelcase'

// Title Case
export const titleCase = (str: string) => startCase(camelCase(str))

// Has Number
export const hasNumber = (str: string) => /\d/.test(str)

// Wait Milliseconds
export const waitMs = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))
