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
const main = (getTransactions = false, useDebank = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (getTransactions) {
        yield info.getTransactions(useDebank);
        for (const chainName in info.chains) {
            const chain = info.chains[chainName];
            console.log(chain.transactions);
        }
    }
    else {
        yield info.getBalances();
        console.log(info.assets);
    }
});
// Run
main(true, false);
