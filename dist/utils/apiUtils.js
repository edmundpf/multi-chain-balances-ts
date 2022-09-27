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
exports.getBeefyVaultsFromGithub = exports.getBeefyVaults = exports.getBeefyApy = exports.getHistory = exports.getProtocolList = exports.getTokenList = exports.getBeefyEndpoint = exports.getDebankEndpoint = exports.getEndpoint = exports.getFormattedURL = void 0;
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
        const defaultHeaders = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
            'sec-ch-ua-platform': '"macOS"',
        };
        return (((_a = (yield axios_1.default.get(fullUrl, headers ? Object.assign(Object.assign({}, defaultHeaders), headers) : defaultHeaders))) === null || _a === void 0 ? void 0 : _a.data) || {});
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
const getDebankEndpoint = (endpoint, address, args, hasShortAddressArg = false) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield exports.getEndpoint('debank', endpoint, Object.assign(Object.assign({}, args), { [hasShortAddressArg ? 'addr' : 'user_addr']: address }));
    if (result === null || result === void 0 ? void 0 : result.hasError)
        console.log('ERROR:', endpoint, args);
    return result;
});
exports.getDebankEndpoint = getDebankEndpoint;
// Get Beefy Endpoint
const getBeefyEndpoint = (endpoint) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getEndpoint('beefy', endpoint); });
exports.getBeefyEndpoint = getBeefyEndpoint;
/**
 * Debank Calls
 */
// Get Known Token List from Chain
const getKnownTokenListFromChain = (address, chainName) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    return ((_d = (yield exports.getDebankEndpoint('tokenList', address, {
        chain: chainName,
        is_all: false,
    }))) === null || _d === void 0 ? void 0 : _d.data) || [];
});
// Get Token List from all Chains
const getTokenListFromAllChains = (address, chainNames) => __awaiter(void 0, void 0, void 0, function* () {
    let tokens = [];
    const responses = [];
    // Iterate Chains
    for (const chainName of chainNames) {
        responses.push(yield getKnownTokenListFromChain(address, chainName));
    }
    // Iterate Responses
    for (const response of responses) {
        if (response.length)
            tokens = [...tokens, ...response];
    }
    return tokens;
});
// Get Single Page History
const getSinglePageHistory = (address, chainName, startTime = 0) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const response = ((_e = (yield exports.getDebankEndpoint('history', address, {
        chain: chainName,
        page_count: 20,
        start_time: startTime,
    }))) === null || _e === void 0 ? void 0 : _e.data) || {};
    const history = response.history_list || [];
    const tokens = response.token_dict || {};
    const lastTime = history.length ? history[history.length - 1].time_at || 0 : 0;
    return {
        tokens,
        history,
        lastTime,
    };
});
// Get Token List
const getTokenList = (address, chainNames) => __awaiter(void 0, void 0, void 0, function* () { return yield getTokenListFromAllChains(address, chainNames); });
exports.getTokenList = getTokenList;
// Get Protocol List
const getProtocolList = (address) => __awaiter(void 0, void 0, void 0, function* () { var _f; return ((_f = (yield exports.getDebankEndpoint('protocolList', address))) === null || _f === void 0 ? void 0 : _f.data) || []; });
exports.getProtocolList = getProtocolList;
// Get History
const getHistory = (address, chainName, getSinglePage = true) => __awaiter(void 0, void 0, void 0, function* () {
    let startTime = 0;
    let shouldEnd = false;
    let allTokens = {};
    let allHistory = [];
    while (!shouldEnd) {
        const { tokens, history, lastTime } = yield getSinglePageHistory(address, chainName, startTime);
        allTokens = Object.assign(Object.assign({}, tokens), allTokens);
        allHistory = [...allHistory, ...history];
        shouldEnd =
            getSinglePage ||
                !history.length ||
                !lastTime ||
                (startTime && lastTime >= startTime)
                ? true
                : false;
        startTime = shouldEnd ? startTime : lastTime;
    }
    return { history: allHistory, tokens: allTokens };
});
exports.getHistory = getHistory;
/**
 * Beefy Calls
 */
// Get Beefy APY
const getBeefyApy = () => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getBeefyEndpoint('beefyApy'); });
exports.getBeefyApy = getBeefyApy;
// Get Beefy Vaults
const getBeefyVaults = () => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getBeefyEndpoint('beefyVaults'); });
exports.getBeefyVaults = getBeefyVaults;
// Get Beefy Vaults from Github
const getBeefyVaultsFromGithub = () => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
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
        const jsText = ((_h = (_g = (yield axios_1.default.get(`${values_1.APIS.githubVaults}/${pool}_pools.js`, {
            responseType: 'text',
        }))) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.trim()) || '';
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
exports.getBeefyVaultsFromGithub = getBeefyVaultsFromGithub;
