import dotenv from 'dotenv'
import sqlite3 from 'sqlite3'
import { resolve } from 'path'
import { homedir } from 'os'
import { LocalPriceData } from './types'
import { open, Database } from 'sqlite'

// Init

dotenv.config()
let db: Database<sqlite3.Database, sqlite3.Statement>

/**
 * Constants
 */

const DB_LOCATION = process.env.DB_LOCATION
	? resolve(process.env.DB_LOCATION)
	: resolve(`${homedir()}/.defi-prices.db`)
const TABLE_NAME = 'prices'

/**
 * Statements
 */

// Select Table Name

const selectTableNameStmt = /*sql*/ `
SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
`

// Create Table

const createTableStmt = /*sql*/ `
CREATE TABLE ${TABLE_NAME} (
	symbol TEXT NOT NULL,
	time INTEGER NOT NULL,
	price NUMERIC NOT NULL,
	PRIMARY KEY (symbol, time)
)
`

// Select Prices by Token

const selectPricesStmt = /*sql*/ `
SELECT * FROM ${TABLE_NAME}
WHERE symbol = ?
ORDER BY time ASC
`

// Insert Price Record

const insertPriceStmt = /*sql*/ `
INSERT INTO ${TABLE_NAME} (symbol, time, price)
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
 * Create Table
 */

const createTable = async () => {
	try {
		const records = await db.all(selectTableNameStmt, [TABLE_NAME])
		if (!records?.length) {
			try {
				await db.exec(createTableStmt)
				return true
			} catch (err) {
				return false
			}
		}
		return true
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
		return await createTable()
	}
	return false
}

/**
 * Select Prices
 */

export const selectPrices = async (symbol: string) => {
	try {
		return (await db.all(selectPricesStmt, [symbol])) as LocalPriceData[]
	} catch (err) {
		return [] as LocalPriceData[]
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
