import axios from 'axios'
import fetch from 'node-fetch'
import { DebankHistory } from './types'
import { APIS, ENDPOINTS, getDebankHeaders } from './values'

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
	headers?: any,
	useFetch = false
) => {
	try {
		let response: any = {}
		const apiUrl = APIS[api]
		const stub = ENDPOINTS[endpoint] || endpoint
		let paramStr = params ? new URLSearchParams(params).toString() : ''
		if (paramStr) paramStr = '?' + paramStr
		const fullUrl = `${apiUrl}/${stub}${paramStr}`
		if (useFetch) {
			const config: any = { method: 'GET' }
			const fetchRes = await fetch(
				fullUrl,
				headers ? { ...config, headers } : config
			)
			response = (await fetchRes.json()) || {}
		} else {
			response =
				(await axios.get(fullUrl, headers ? { headers } : undefined))?.data ||
				{}
		}
		return response
	} catch (err) {
		console.error(err)
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
		headers,
		true
	)
	console.log(result.hasError ? 'Error' : 'Success', endpoint, args)
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
