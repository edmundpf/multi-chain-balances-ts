import startCase from 'lodash.startcase'
import camelCase from 'lodash.camelcase'

/**
 * Title Case
 */

export const titleCase = (str: string) => startCase(camelCase(str))

/**
 * Has Number
 */

export const hasNumber = (str: string) => /\d/.test(str)

/**
 * Get Formatted URL
 */

export const getFormattedURL = (endpoint: string, replaceArgs: any) => {
	let url = endpoint
	if (replaceArgs) {
		for (const key in replaceArgs) {
			if (url.includes(key)) {
				url = url.replace(key, replaceArgs[key])
			}
		}
	}
	return url
}

/**
 * Wait ms
 */

export const waitMs = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))
