import dotenv from 'dotenv'
import { DEFAULT_MIN_VALUE } from './values'

// Init
dotenv.config()

// Environment Address
export const ENV_ADDRESS = process.env.MULTI_CHAIN_ADDRESS || ''

// Environment Minimum Token Value
export const ENV_MIN_VALUE =
	process.env.MULTI_CHAIN_MIN_VALUE != null
		? Number(process.env.MULTI_CHAIN_MIN_VALUE)
		: DEFAULT_MIN_VALUE

// Environment Debank Wait ms
export const ENV_DEBANK_WAIT_MS = process.env.MULTI_CHAIN_DEBANK_WAIT_MS
	? Number(process.env.MULTI_CHAIN_DEBANK_WAIT_MS)
	: 0

// Environment Database Location
export const ENV_DB_LOCATION = process.env.MULTI_CHAIN_DB_LOCATION || ''

// Environment Proxy Address
export const ENV_PROXY_ADDRESS = process.env.MULTI_CHAIN_PROXY_ADDRESS || ''

// Environment Proxy Port
export const ENV_PROXY_PORT = process.env.MULTI_CHAIN_PROXY_PORT
	? Number(process.env.MULTI_CHAIN_PROXY_PORT)
	: 8118

// Environment Get Transactions from Chains
export const ENV_GET_TRANS_FROM_CHAINS = (() => {
	let chains: string[] = []
	try {
		chains = JSON.parse(process.env.MULTI_CHAIN_GET_TRANS_FROM_CHAINS || '')
	} catch (err) {
		// Do Nothing
	}
	return chains
})()
