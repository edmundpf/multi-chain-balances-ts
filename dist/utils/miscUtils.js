"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeToDecimal = exports.waitMs = exports.hasNumber = exports.titleCase = void 0;
const lodash_startcase_1 = __importDefault(require("lodash.startcase"));
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
// Title Case
const titleCase = (str) => lodash_startcase_1.default(lodash_camelcase_1.default(str));
exports.titleCase = titleCase;
// Has Number
const hasNumber = (str) => /\d/.test(str);
exports.hasNumber = hasNumber;
// Wait Milliseconds
const waitMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.waitMs = waitMs;
// Native to Decimal
const nativeToDecimal = (nativeNum, decimals = 18) => {
    const nativeStr = String(nativeNum).padStart(decimals, '0');
    const startStr = nativeStr.substring(0, nativeStr.length - decimals) || '0';
    const endStr = nativeStr.substring(nativeStr.length - decimals);
    return Number(startStr + '.' + endStr);
};
exports.nativeToDecimal = nativeToDecimal;
