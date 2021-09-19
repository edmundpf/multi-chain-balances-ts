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
exports.insertContract = exports.selectContracts = exports.insertPrice = exports.selectPrices = exports.prepareDB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = require("path");
const os_1 = require("os");
const values_1 = require("./values");
const envValues_1 = require("./envValues");
const sqlite_1 = require("sqlite");
// Init
let db;
/**
 * Constants
 */
const DB_LOCATION = envValues_1.ENV_DB_LOCATION
    ? path_1.resolve(envValues_1.ENV_DB_LOCATION)
    : path_1.resolve(`${os_1.homedir()}/${values_1.DEFAULT_DB_FILE}`);
const PRICES_TABLE_NAME = 'prices';
const CONTRACTS_TABLE_NAME = 'contracts';
/**
 * Statements
 */
// Select Table Name
const selectTableNameStmt = /*sql*/ `
SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
`;
// Create Prices Table
const createPricesTableStmt = /*sql*/ `
CREATE TABLE ${PRICES_TABLE_NAME} (
	symbol TEXT NOT NULL,
	time INTEGER NOT NULL,
	price NUMERIC NOT NULL,
	PRIMARY KEY (symbol, time)
)
`;
// Select Prices by Token
const selectPricesStmt = /*sql*/ `
SELECT * FROM ${PRICES_TABLE_NAME}
WHERE symbol = ?
ORDER BY time ASC
`;
// Insert Price Record
const insertPriceStmt = /*sql*/ `
INSERT INTO ${PRICES_TABLE_NAME} (symbol, time, price)
VALUES(?, ?, ?)
`;
// Create Contracts Table
const createContractsTableStmt = /*sql*/ `
CREATE TABLE ${CONTRACTS_TABLE_NAME} (
	blockchain TEXT NOT NULL,
	symbol TEXT NOT NULL,
	address TEXT NOT NULL,
	PRIMARY KEY (blockchain, symbol, address)
)
`;
// Select Contracts
const selectContractsStmt = /*sql*/ `
SELECT * FROM ${CONTRACTS_TABLE_NAME}
ORDER BY blockchain ASC, symbol ASC, address ASC
`;
// Insert Contract Record
const insertContractStmt = /*sql*/ `
INSERT INTO ${CONTRACTS_TABLE_NAME} (blockchain, symbol, address)
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
 * Create Tables
 */
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let priceSuccess = false;
        let contractSuccess = false;
        const res = yield Promise.all([
            db.all(selectTableNameStmt, [PRICES_TABLE_NAME]),
            db.all(selectTableNameStmt, [CONTRACTS_TABLE_NAME]),
        ]);
        const priceRecords = res[0];
        const contractRecords = res[1];
        if (!(priceRecords === null || priceRecords === void 0 ? void 0 : priceRecords.length)) {
            try {
                yield db.exec(createPricesTableStmt);
                priceSuccess = true;
            }
            catch (err) {
                // Do Nothing
            }
        }
        if (!(contractRecords === null || contractRecords === void 0 ? void 0 : contractRecords.length)) {
            try {
                yield db.exec(createContractsTableStmt);
                contractSuccess = true;
            }
            catch (err) {
                // Do Nothing
            }
        }
        return priceSuccess && contractSuccess;
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
        return yield createTables();
    }
    return false;
});
exports.prepareDB = prepareDB;
/**
 * Select Prices
 */
const selectPrices = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db.all(selectPricesStmt, [symbol]);
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
/**
 * Select Contracts
 */
const selectContracts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db.all(selectContractsStmt);
    }
    catch (err) {
        return [];
    }
});
exports.selectContracts = selectContracts;
/**
 * Insert Contract
 */
const insertContract = (record) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.run(insertContractStmt, record.blockchain, record.symbol, record.address);
    }
    catch (err) {
        // Do Nothing
    }
});
exports.insertContract = insertContract;
