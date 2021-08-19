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
const main = (getTransactions = false, useReq = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (getTransactions) {
        yield transactions(useReq);
    }
    else {
        yield info.getBalances();
    }
});
// Transactions
const transactions = (useReq = true) => __awaiter(void 0, void 0, void 0, function* () {
    let total = 0;
    yield info.getTransactions(useReq);
    for (const chainName in info.transactions) {
        if (chainName == 'matic')
            continue;
        for (const record of info.transactions[chainName]) {
            const { type, amount, fromAddress } = record;
            if (type == 'deposit') {
                if (chainName == 'bsc' && !fromAddress.startsWith('0X000'))
                    continue;
                console.log(record);
                total += amount;
            }
        }
    }
    console.log('Total', total);
});
// Run
main(true, true);
