import dotenv from 'dotenv'
import { DEFAULT_MIN_VALUE } from './values'

// Init
dotenv.config()

// Environment Address
export const ENV_ADDRESS = process.env.ADDRESS || ''

// Environment Minimum Token Value
export const ENV_MIN_VALUE = Number(process.env.MIN_VALUE) || DEFAULT_MIN_VALUE

// Environment Database Location
export const ENV_DB_LOCATION = process.env.DB_LOCATION || ''
