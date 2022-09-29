"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_GET_TRANS_FROM_CHAINS = exports.ENV_PROXY_PORT = exports.ENV_PROXY_ADDRESS = exports.ENV_DB_LOCATION = exports.ENV_DEBANK_WAIT_MS = exports.ENV_MIN_VALUE = exports.ENV_ADDRESS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const values_1 = require("./values");
// Init
dotenv_1.default.config();
// Environment Address
exports.ENV_ADDRESS = process.env.MULTI_CHAIN_ADDRESS || '';
// Environment Minimum Token Value
exports.ENV_MIN_VALUE = process.env.MULTI_CHAIN_MIN_VALUE != null
    ? Number(process.env.MULTI_CHAIN_MIN_VALUE)
    : values_1.DEFAULT_MIN_VALUE;
// Environment Debank Wait ms
exports.ENV_DEBANK_WAIT_MS = process.env.MULTI_CHAIN_DEBANK_WAIT_MS
    ? Number(process.env.MULTI_CHAIN_DEBANK_WAIT_MS)
    : 0;
// Environment Database Location
exports.ENV_DB_LOCATION = process.env.MULTI_CHAIN_DB_LOCATION || '';
// Environment Proxy Address
exports.ENV_PROXY_ADDRESS = process.env.MULTI_CHAIN_PROXY_ADDRESS || '';
// Environment Proxy Port
exports.ENV_PROXY_PORT = process.env.MULTI_CHAIN_PROXY_PORT
    ? Number(process.env.MULTI_CHAIN_PROXY_PORT)
    : 8118;
// Environment Get Transactions from Chains
exports.ENV_GET_TRANS_FROM_CHAINS = (() => {
    let chains = [];
    try {
        chains = JSON.parse(process.env.MULTI_CHAIN_GET_TRANS_FROM_CHAINS || '');
    }
    catch (err) {
        // Do Nothing
    }
    return chains;
})();
