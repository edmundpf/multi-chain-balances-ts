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
    for (const chainNm in info.chains) {
        const chainName = chainNm;
        for (const transaction of info.chains[chainName].transactions) {
            if (transaction.type != 'swap' &&
                (transaction.quoteValueUSD || transaction.baseValueUSD)) {
                console.log('Quote', transaction.quoteSymbol, transaction.quoteValueUSD);
                console.log('Base', transaction.baseSymbol, transaction.baseValueUSD, '\n');
            }
        }
    }
};
// Run
main({
    useDebank: false,
    getTransactions: true,
    getPrices: true,
    getBalances: false,
    filterUnknownTokens: false,
    useTempTransactions: true,
    logTransactions: false,
    logAssets: false,
});
