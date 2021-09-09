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
const _1 = __importDefault(require("./"));
// Init
const info = new _1.default();
// Main
const main = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { logTransactions, logAssets } = Object.assign({ logTransactions: false, logAssets: false }, args);
    yield info.driver(args);
    if (logAssets)
        console.log(info.assets);
    if (logTransactions)
        logTrans();
    // Testing
});
// Log Transactions
const logTrans = () => {
    const priceDecimals = 4;
    const valueDecimals = 10;
    const columnPadding = 20;
    const line = '-'.repeat(columnPadding * 4);
    for (const chainNm in info.chains) {
        const chainName = chainNm;
        for (const transaction of info.chains[chainName].transactions) {
            const { quoteSymbol, quotePriceUSD, quoteValueUSD, baseSymbol, basePriceUSD, baseValueUSD, } = transaction;
            const quote = quoteSymbol.padEnd(columnPadding, ' ');
            const base = baseSymbol.padEnd(columnPadding, ' ');
            const quoteVal = quoteValueUSD.toFixed(valueDecimals).padEnd(columnPadding, ' ');
            const quotePrice = quotePriceUSD.toFixed(priceDecimals).padEnd(columnPadding, ' ');
            const baseVal = baseValueUSD.toFixed(valueDecimals).padEnd(columnPadding, ' ');
            const basePrice = basePriceUSD.toFixed(priceDecimals).padEnd(columnPadding, ' ');
            console.log(line);
            console.log(quote, '|', quoteVal, '|', quotePrice);
            console.log(base, '|', baseVal, '|', basePrice);
            console.log(line, '\n');
        }
    }
};
// Run
main({
    useDebank: false,
    getTransactions: false,
    getPrices: true,
    getBalances: false,
    filterUnknownTokens: false,
    useTempTransactions: true,
    logTransactions: true,
    logAssets: false,
});
