import sqlite3 from 'sqlite3'
import { resolve } from 'path'
import { homedir } from 'os'
import { DEFAULT_DB_FILE } from './values'
import { ENV_DB_LOCATION } from './envValues'
import { open, Database } from 'sqlite'
import { LocalPriceData, LocalContractData } from './types'

// Init

let db: Database<sqlite3.Database, sqlite3.Statement>

/**
 * Constants
 */

const DB_LOCATION = ENV_DB_LOCATION
	? resolve(ENV_DB_LOCATION)
	: resolve(`${homedir()}/${DEFAULT_DB_FILE}`)
const PRICES_TABLE_NAME = 'prices'
const CONTRACTS_TABLE_NAME = 'contracts'

/**
 * Statements
 */

// Select Table Name

const selectTableNameStmt = /*sql*/ `
SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
`

// Create Prices Table

const createPricesTableStmt = /*sql*/ `
CREATE TABLE ${PRICES_TABLE_NAME} (
	symbol TEXT NOT NULL,
	time INTEGER NOT NULL,
	price NUMERIC NOT NULL,
	PRIMARY KEY (symbol, time)
)
`

// Select Prices by Token

const selectPricesStmt = /*sql*/ `
SELECT * FROM ${PRICES_TABLE_NAME}
WHERE symbol = ?
ORDER BY time ASC
`

// Insert Price Record

const insertPriceStmt = /*sql*/ `
INSERT INTO ${PRICES_TABLE_NAME} (symbol, time, price)
VALUES(?, ?, ?)
`

// Create Contracts Table

const createContractsTableStmt = /*sql*/ `
CREATE TABLE ${CONTRACTS_TABLE_NAME} (
	blockchain TEXT NOT NULL,
	symbol TEXT NOT NULL,
	address TEXT NOT NULL,
	PRIMARY KEY (blockchain, symbol, address)
)
`

// Select Contracts

const selectContractsStmt = /*sql*/ `
SELECT * FROM ${CONTRACTS_TABLE_NAME}
ORDER BY blockchain ASC, symbol ASC, address ASC
`

// Insert Contract Record

const insertContractStmt = /*sql*/ `
INSERT INTO ${CONTRACTS_TABLE_NAME} (blockchain, symbol, address)
VALUES(?, ?, ?)
`

/**
 * Open DB
 */

const openDB = async () => {
	try {
		if (!db) {
			db = await open({
				filename: DB_LOCATION,
				driver: sqlite3.Database,
			})
		}
	} catch (err) {
		// Do Nothing
	}
}

/**
 * Create Tables
 */

const createTables = async () => {
	try {
		let priceSuccess = false
		let contractSuccess = false
		const res = await Promise.all([
			db.all(selectTableNameStmt, [PRICES_TABLE_NAME]),
			db.all(selectTableNameStmt, [CONTRACTS_TABLE_NAME]),
		])
		const priceRecords = res[0]
		const contractRecords = res[1]
		if (!priceRecords?.length) {
			try {
				await db.exec(createPricesTableStmt)
				priceSuccess = true
			} catch (err) {
				// Do Nothing
			}
		}
		if (!contractRecords?.length) {
			try {
				await db.exec(createContractsTableStmt)
				contractSuccess = true
			} catch (err) {
				// Do Nothing
			}
		}
		return priceSuccess && contractSuccess
	} catch (err) {
		return false
	}
}

/**
 * Prepare DB
 */

export const prepareDB = async () => {
	await openDB()
	if (db) {
		return await createTables()
	}
	return false
}

/**
 * Select Prices
 */

export const selectPrices = async (
	symbol: string
): Promise<LocalPriceData[]> => {
	try {
		return await db.all(selectPricesStmt, [symbol])
	} catch (err) {
		return []
	}
}

/**
 * Insert Price
 */

export const insertPrice = async (record: LocalPriceData) => {
	try {
		await db.run(insertPriceStmt, record.symbol, record.time, record.price)
	} catch (err) {
		// Do Nothing
	}
}

/**
 * Select Contracts
 */

export const selectContracts = async (): Promise<LocalContractData[]> => {
	try {
		return await db.all(selectContractsStmt)
	} catch (err) {
		return []
	}
}

/**
 * Insert Contract
 */

export const insertContract = async (record: LocalContractData) => {
	try {
		await db.run(
			insertContractStmt,
			record.blockchain,
			record.symbol,
			record.address
		)
	} catch (err) {
		// Do Nothing
	}
}
