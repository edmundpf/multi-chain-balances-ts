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

// Environment Database Location
export const ENV_DB_LOCATION = process.env.MULTI_CHAIN_DB_LOCATION || ''
