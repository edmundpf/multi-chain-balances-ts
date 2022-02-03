"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeMs = exports.isValidPastTime = exports.isValidFutureTime = void 0;
const values_1 = require("./values");
// Is Valid Future Time
const isValidFutureTime = (transTime, localTime) => localTime > transTime && localTime - transTime < values_1.ONE_DAY;
exports.isValidFutureTime = isValidFutureTime;
// Is Valid Past Time
const isValidPastTime = (transTime, localTime) => transTime > localTime && transTime - localTime < values_1.ONE_DAY;
exports.isValidPastTime = isValidPastTime;
// Get Time in Milliseconds
const getTimeMs = (dateStr) => dateStr ? new Date(dateStr).getTime() : new Date().getTime();
exports.getTimeMs = getTimeMs;
