import axios from 'axios'
import { promises } from 'fs'
import { resolve } from 'path'
import { DebankHistory } from './types'
import {
	APIS,
	ENDPOINTS,
	SAVED_VAULTS_FILE,
	BEEFY_VAULT_URLS,
	getDebankHeaders,
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
	args?: any,
	hasShortAddressArg = false
) => {
	const headers = getDebankHeaders(address)
	const result = await getEndpoint(
		'debank',
		endpoint,
		{
			...args,
			[hasShortAddressArg ? 'addr' : 'user_addr']: address,
		},
		headers
	)
	console.log(endpoint, args)
	return result
}

// Get Beefy Endpoint
export const getBeefyEndpoint = async (endpoint: keyof typeof ENDPOINTS) =>
	await getEndpoint('beefy', endpoint)

/**
 * Debank Calls
 */

// Get Known Token List from Chain
const getKnownTokenListFromChain = async (address: string, chainName: string) =>
	(
		await getDebankEndpoint('tokenList', address, {
			chain: chainName,
			is_all: false,
		})
	)?.data || []

// Get Token List from all Chains
const getTokenListFromAllChains = async (
	address: string,
	chainNames: string[]
) => {
	let tokens: any[] = []
	const responses: any[][] = []

	// Iterate Chains
	for (const chainName of chainNames) {
		responses.push(await getKnownTokenListFromChain(address, chainName))
	}

	// Iterate Responses
	for (const response of responses) {
		if (response.length) tokens = [...tokens, ...response]
	}
	return tokens
}

// Get Single Page History
const getSinglePageHistory = async (
	address: string,
	chainName: string,
	startTime = 0
) => {
	const response =
		(
			await getDebankEndpoint('history', address, {
				chain: chainName,
				page_count: 20,
				start_time: startTime,
			})
		)?.data || {}
	const history: DebankHistory[] = response.history_list || []
	const tokens: any = response.token_dict || {}
	const lastTime = history.length ? history[history.length - 1].time_at || 0 : 0
	return {
		tokens,
		history,
		lastTime,
	}
}

// Get Token List
export const getTokenList = async (address: string, chainNames: string[]) =>
	await getTokenListFromAllChains(address, chainNames)

// Get Protocol List
export const getProtocolList = async (address: string) =>
	(await getDebankEndpoint('protocolList', address))?.data || []

// Get History
export const getHistory = async (
	address: string,
	chainName: string,
	getSinglePage = true
) => {
	let startTime = 0
	let shouldEnd = false
	let allTokens: any = {}
	let allHistory: DebankHistory[] = []
	while (!shouldEnd) {
		const { tokens, history, lastTime } = await getSinglePageHistory(
			address,
			chainName,
			startTime
		)
		allTokens = { ...tokens, ...allTokens }
		allHistory = [...allHistory, ...history]
		shouldEnd =
			getSinglePage ||
			!history.length ||
			!lastTime ||
			(startTime && lastTime >= startTime)
				? true
				: false
		startTime = shouldEnd ? startTime : lastTime
	}
	return { history: allHistory, tokens: allTokens }
}

/**
 * Beefy Calls
 */

// Get Beefy APY
export const getBeefyApy = async () => await getBeefyEndpoint('beefyApy')

// Get Beefy Vaults
export const getBeefyVaults = async () => await getBeefyEndpoint('beefyVaults')

// Get Beefy Vaults from Github
export const getBeefyVaultsFromGithub = async () => {
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
