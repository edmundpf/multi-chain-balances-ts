"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPrice = exports.selectPrices = exports.prepareDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = require("path");
const os_1 = require("os");
const sqlite_1 = require("sqlite");
// Init
dotenv_1.default.config();
let db;
/**
 * Constants
 */
const DB_LOCATION = process.env.DB_LOCATION
    ? path_1.resolve(process.env.DB_LOCATION)
    : path_1.resolve(`${os_1.homedir()}/.defi-prices.db`);
const TABLE_NAME = 'prices';
/**
 * Statements
 */
// Select Table Name
const selectTableNameStmt = /*sql*/ `
SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
`;
// Create Table
const createTableStmt = /*sql*/ `
CREATE TABLE ${TABLE_NAME} (
	symbol TEXT NOT NULL,
	time INTEGER NOT NULL,
	price NUMERIC NOT NULL,
	PRIMARY KEY (symbol, time)
)
`;
// Select Prices by Token
const selectPricesStmt = /*sql*/ `
SELECT * FROM ${TABLE_NAME}
WHERE symbol = ?
ORDER BY time ASC
`;
// Insert Price Record
const insertPriceStmt = /*sql*/ `
INSERT INTO ${TABLE_NAME} (symbol, time, price)
VALUES(?, ?, ?)
`;
/**
 * Open DB
 */
const openDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!db) {
            db = yield sqlite_1.open({
                filename: DB_LOCATION,
                driver: sqlite3_1.default.Database,
            });
        }
    }
    catch (err) {
        // Do Nothing
    }
});
/**
 * Create Table
 */
const createTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield db.all(selectTableNameStmt, [TABLE_NAME]);
        if (!(records === null || records === void 0 ? void 0 : records.length)) {
            try {
                yield db.exec(createTableStmt);
                return true;
            }
            catch (err) {
                return false;
            }
        }
        return true;
    }
    catch (err) {
        return false;
    }
});
/**
 * Prepare DB
 */
const prepareDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield openDB();
    if (db) {
        return yield createTable();
    }
    return false;
});
exports.prepareDB = prepareDB;
/**
 * Select Prices
 */
const selectPrices = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield db.all(selectPricesStmt, [symbol]));
    }
    catch (err) {
        return [];
    }
});
exports.selectPrices = selectPrices;
/**
 * Insert Price
 */
const insertPrice = (record) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.run(insertPriceStmt, record.symbol, record.time, record.price);
    }
    catch (err) {
        // Do Nothing
    }
});
exports.insertPrice = insertPrice;
// Main
// const main = async () => {
// 	const ready = await prepare()
// 	if (ready) {
// 		await insertPrice({
// 			symbol: 'BTC',
// 			time: 1630847991233,
// 			price: 50000,
// 		})
// 		const prices = await selectPrices('BTC')
// 		console.log(prices)
// 	}
// }
// Run
// main()
