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
exports.getBeefyVaults = exports.getBeefyApy = exports.getProtocolList = exports.getKnownTokenList = exports.getTokenList = exports.getBeefyEndpoint = exports.getPrivateDebankEndpoint = exports.getDebankEndpoint = exports.getEndpoint = exports.getFormattedURL = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = require("path");
const values_1 = require("./values");
const { readFile, writeFile } = fs_1.promises;
/**
 * Misc
 */
// Get Formatted URL
const getFormattedURL = (endpoint, replaceArgs) => {
    let url = endpoint;
    if (replaceArgs) {
        for (const key in replaceArgs) {
            if (url.includes(key)) {
                url = url.replace(key, replaceArgs[key]);
            }
        }
    }
    return url;
};
exports.getFormattedURL = getFormattedURL;
// Get Endpoint
const getEndpoint = (api, endpoint, params, headers) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const apiUrl = values_1.APIS[api];
        const stub = values_1.ENDPOINTS[endpoint] || endpoint;
        let paramStr = params ? new URLSearchParams(params).toString() : '';
        if (paramStr)
            paramStr = '?' + paramStr;
        const fullUrl = `${apiUrl}/${stub}${paramStr}`;
        return (((_a = (yield axios_1.default.get(fullUrl, headers ? { headers } : undefined))) === null || _a === void 0 ? void 0 : _a.data) || {});
    }
    catch (err) {
        return Object.assign(Object.assign({}, (((_c = (_b = err) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.data) || {})), { hasError: true });
    }
});
exports.getEndpoint = getEndpoint;
/**
 * API Methods
 */
// Get Debank Endpoint
const getDebankEndpoint = (endpoint, address, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.getEndpoint('debank', endpoint, Object.assign(Object.assign({}, args), { id: address }));
});
exports.getDebankEndpoint = getDebankEndpoint;
// Get Private Debank Endpoint
const getPrivateDebankEndpoint = (endpoint, address, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.getEndpoint('debankPrivate', endpoint, Object.assign(Object.assign({}, args), { user_addr: address }));
});
exports.getPrivateDebankEndpoint = getPrivateDebankEndpoint;
// Get Beefy Endpoint
const getBeefyEndpoint = (endpoint) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getEndpoint('beefy', endpoint); });
exports.getBeefyEndpoint = getBeefyEndpoint;
/**
 * Debank Calls
 */
// Get Token List
const getTokenList = (address) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getDebankEndpoint('tokenList', address); });
exports.getTokenList = getTokenList;
// Get Known Token List
const getKnownTokenList = (address) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getDebankEndpoint('tokenList', address, { is_all: false }); });
exports.getKnownTokenList = getKnownTokenList;
// Get Protocol List
const getProtocolList = (address) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getDebankEndpoint('protocolList', address); });
exports.getProtocolList = getProtocolList;
/**
 * Beefy Calls
 */
// Get Beefy APY
const getBeefyApy = () => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getBeefyEndpoint('beefyApy'); });
exports.getBeefyApy = getBeefyApy;
// Get Beefy Vaults
const getBeefyVaults = () => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    let savedVaults = {};
    const vaultFile = path_1.resolve(values_1.SAVED_VAULTS_FILE);
    // Get Saved Vaults
    try {
        savedVaults = JSON.parse(yield readFile(vaultFile, 'utf-8'));
    }
    catch (err) {
        // Do Nothing
    }
    // Init Vaults
    const vaults = Object.assign({}, savedVaults);
    // Iterage URL's
    for (const key in values_1.BEEFY_VAULT_URLS) {
        // Get Plain Text
        const pool = values_1.BEEFY_VAULT_URLS[key];
        const jsText = ((_e = (_d = (yield axios_1.default.get(`${values_1.APIS.githubVaults}/${pool}_pools.js`, {
            responseType: 'text',
        }))) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.trim()) || '';
        // Parse Text
        if (jsText.includes('[')) {
            try {
                const data = eval(jsText.substring(jsText.indexOf('['), jsText.length - 1));
                // Add Vault
                for (const record of data) {
                    const { id, earnedToken } = record;
                    const formattedToken = earnedToken.toLowerCase().replace(/w/g, '');
                    vaults[formattedToken] = id;
                }
            }
            catch (err) {
                // Do Nothing
            }
        }
    }
    // Write File
    writeFile(vaultFile, JSON.stringify(vaults, null, 2));
    return vaults;
});
exports.getBeefyVaults = getBeefyVaults;
