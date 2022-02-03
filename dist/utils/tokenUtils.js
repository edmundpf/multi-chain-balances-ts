"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContract = exports.isUnknownToken = exports.isStableCoin = exports.isNativeToken = exports.isContract = exports.sterilizeTokenNameNoStub = exports.sterilizeTokenName = exports.getAddressStub = exports.symbolWithDashes = void 0;
const values_1 = require("./values");
/**
 * Formatting
 */
// Symbol With Dashes
const symbolWithDashes = (symbol) => (symbol || '').replace(/ /g, '-');
exports.symbolWithDashes = symbolWithDashes;
// Get Address Stub
const getAddressStub = (address) => address.toLowerCase().includes('0x')
    ? address.substring(2, 6).toUpperCase()
    : address.substring(0, 4).toUpperCase();
exports.getAddressStub = getAddressStub;
// Sterilize Token Name
const sterilizeTokenName = (token) => exports.symbolWithDashes(token).toUpperCase();
exports.sterilizeTokenName = sterilizeTokenName;
// Remove Token Contract Stub
const sterilizeTokenNameNoStub = (tokenName) => {
    let curName = tokenName;
    if (tokenName.includes('-')) {
        let dashParts = tokenName.split('-');
        const lastPart = dashParts[dashParts.length - 1];
        const isPool = lastPart == 'Pool';
        const hasStub = lastPart.startsWith('0x') && lastPart.length == 6;
        if (!isPool && hasStub) {
            dashParts = dashParts.slice(0, dashParts.length - 2);
            curName = dashParts.join('-');
        }
    }
    return exports.sterilizeTokenName(curName);
};
exports.sterilizeTokenNameNoStub = sterilizeTokenNameNoStub;
/**
 * Validation
 */
// Is Contract
const isContract = (address) => address.startsWith('0x');
exports.isContract = isContract;
// Is Native Token
const isNativeToken = (tokenName) => Object.values(values_1.NATIVE_TOKENS).includes(tokenName);
exports.isNativeToken = isNativeToken;
// Is Stablecoin
const isStableCoin = (tokenName, price) => {
    const upperToken = tokenName.toUpperCase();
    const isNormalStable = upperToken.includes(values_1.FIAT_CURRENCY);
    const isOtherStable = values_1.stableCoinConfig.otherCoins.includes(tokenName);
    const withinError = price >= 1 - values_1.stableCoinConfig.errorPercent &&
        price <= 1 + values_1.stableCoinConfig.errorPercent;
    return (isNormalStable || isOtherStable) && withinError;
};
exports.isStableCoin = isStableCoin;
// Is Unknown Token
const isUnknownToken = (unknownTokens, symbol) => {
    const sterileSymbol = exports.sterilizeTokenNameNoStub(symbol);
    return unknownTokens.includes(sterileSymbol);
};
exports.isUnknownToken = isUnknownToken;
/**
 * Misc
 */
// Add Contract Symbol/Address
const addContract = (symbols, symbol, address) => {
    if (symbol) {
        const upperSymbol = exports.symbolWithDashes(symbol).toUpperCase();
        const lowerAddress = address.toLowerCase();
        const addressIsContract = exports.isContract(lowerAddress);
        if (addressIsContract) {
            if (!symbols[upperSymbol]) {
                symbols[upperSymbol] = [lowerAddress];
            }
            else if (!symbols[upperSymbol].includes(lowerAddress)) {
                symbols[upperSymbol].push(lowerAddress);
            }
        }
    }
};
exports.addContract = addContract;
