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
const DefiBalances_1 = __importDefault(require("./DefiBalances"));
const misc_1 = require("./misc");
const values_1 = require("./values");
/**
 * Harmony Class
 */
class Harmony extends DefiBalances_1.default {
    /**
     * Harmony Driver
     */
    harmonyDriver() {
        return __awaiter(this, void 0, void 0, function* () {
            const responses = yield Promise.all([
                this.getTokensInfo(),
                this.getVaultsInfo(),
            ]);
            const tokensResponse = responses[0];
            const vaultsResponse = responses[1];
            const parsedTokens = this.parseTokens(tokensResponse);
            this.parseVaults(vaultsResponse);
            return parsedTokens;
        });
    }
    /**
     * Get Tokens Info
     */
    getTokensInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getFarmArmyEndpoint('harmonyTokens');
        });
    }
    /**
     * Parse Tokens
     */
    parseTokens(response) {
        const parsedTokens = [];
        const tokens = (response === null || response === void 0 ? void 0 : response.tokens) || [];
        for (const token of tokens) {
            const { symbol, amount, usd } = token;
            const price = usd / amount;
            parsedTokens.push({
                chain: 'one',
                symbol: symbol.toUpperCase(),
                price,
                amount,
            });
        }
        return parsedTokens;
    }
    /**
     * Get Vaults Info
     */
    getVaultsInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getFarmArmyEndpoint('harmonyVaults');
        });
    }
    /**
     * Parse Vaults
     */
    parseVaults(response) {
        var _a, _b;
        const vaults = ((_a = response === null || response === void 0 ? void 0 : response.hbeefy) === null || _a === void 0 ? void 0 : _a.farms) || [];
        const platformUrl = ((_b = response === null || response === void 0 ? void 0 : response.hbeefy) === null || _b === void 0 ? void 0 : _b.url) || '';
        for (const vault of vaults) {
            const { deposit, farm, yield: yieldInfo } = vault;
            const symbol = `${farm.name.toUpperCase()}-Pool`;
            const value = deposit.usd || 0;
            const apy = yieldInfo.apy || 0;
            this.chains.one.vaults.push({
                symbol,
                value,
                platform: 'Beefy',
                platformUrl,
                apy,
                tokens: [],
            });
        }
    }
    /**
     * Get Farm.Army Endpoint
     */
    getFarmArmyEndpoint(endpoint, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = misc_1.getFormattedURL(values_1.ENDPOINTS[endpoint], { $address: this.address });
            return yield this.getEndpoint('farmArmy', url, params);
        });
    }
}
exports.default = Harmony;
