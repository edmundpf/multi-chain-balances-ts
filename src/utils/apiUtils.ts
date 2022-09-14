import axios from 'axios'
import { promises } from 'fs'
import { resolve } from 'path'
import {
	APIS,
	ENDPOINTS,
	SAVED_VAULTS_FILE,
	BEEFY_VAULT_URLS,
} from './values'
const { readFile, writeFile } = promises

/**
 * Misc
 */

// Get Formatted URL
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

// Get Endpoint
export const getEndpoint = async (
	api: keyof typeof APIS,
	endpoint: keyof typeof ENDPOINTS,
	params?: any,
	headers?: any
) => {
	try {
		const apiUrl = APIS[api]
		const stub = ENDPOINTS[endpoint] || endpoint
		let paramStr = params ? new URLSearchParams(params).toString() : ''
		if (paramStr) paramStr = '?' + paramStr
		const fullUrl = `${apiUrl}/${stub}${paramStr}`
		return (
			(await axios.get(fullUrl, headers ? { headers } : undefined))?.data || {}
		)
	} catch (err) {
		return {
			...((err as any)?.response?.data || {}),
			hasError: true,
		}
	}
}

/**
 * API Methods
 */

// Get Debank Endpoint
export const getDebankEndpoint = async (
	endpoint: keyof typeof ENDPOINTS,
	address: string,
	args?: any
) =>
	await getEndpoint('debank', endpoint, {
		...args,
		id: address,
	})

// Get Private Debank Endpoint
export const getPrivateDebankEndpoint = async (
	endpoint: keyof typeof ENDPOINTS,
	address: string,
	args?: any
) =>
	await getEndpoint('debankPrivate', endpoint, {
		...args,
		user_addr: address,
	})

// Get Beefy Endpoint
export const getBeefyEndpoint = async (endpoint: keyof typeof ENDPOINTS) =>
	await getEndpoint('beefy', endpoint)

/**
 * Debank Calls
 */

// Get Token List
export const getTokenList = async (address: string) =>
	await getDebankEndpoint('tokenList', address)

// Get Known Token List
export const getKnownTokenList = async (address: string) =>
	await getDebankEndpoint('tokenList', address, { is_all: false })

// Get Protocol List
export const getProtocolList = async (address: string) =>
	await getDebankEndpoint('protocolList', address)

/**
 * Beefy Calls
 */

// Get Beefy APY
export const getBeefyApy = async () => await getBeefyEndpoint('beefyApy')

// Get Beefy Vaults
export const getBeefyVaults = async () => {
	let savedVaults: any = {}
	const vaultFile = resolve(SAVED_VAULTS_FILE)

	// Get Saved Vaults
	try {
		savedVaults = JSON.parse(await readFile(vaultFile, 'utf-8'))
	} catch (err) {
		// Do Nothing
	}

	// Init Vaults
	const vaults: any = { ...savedVaults }

	// Iterage URL's
	for (const key in BEEFY_VAULT_URLS) {
		// Get Plain Text
		const pool = BEEFY_VAULT_URLS[key as keyof typeof BEEFY_VAULT_URLS]
		const jsText =
			(
				await axios.get(`${APIS.githubVaults}/${pool}_pools.js`, {
					responseType: 'text',
				})
			)?.data?.trim() || ''

		// Parse Text
		if (jsText.includes('[')) {
			try {
				const data = eval(
					jsText.substring(jsText.indexOf('['), jsText.length - 1)
				)

				// Add Vault
				for (const record of data) {
					const { id, earnedToken } = record
					const formattedToken = earnedToken.toLowerCase().replace(/w/g, '')
					vaults[formattedToken] = id
				}
			} catch (err) {
				// Do Nothing
			}
		}
	}

	// Write File
	writeFile(vaultFile, JSON.stringify(vaults, null, 2))
	return vaults
}
