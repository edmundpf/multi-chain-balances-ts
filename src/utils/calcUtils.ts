import { ONE_DAY } from './values'

// Is Valid Future Time
export const isValidFutureTime = (transTime: number, localTime: number) =>
	localTime > transTime && localTime - transTime < ONE_DAY

// Is Valid Past Time
export const isValidPastTime = (transTime: number, localTime: number) =>
	transTime > localTime && transTime - localTime < ONE_DAY

// Get Time in Milliseconds
export const getTimeMs = (dateStr?: string) =>
	dateStr ? new Date(dateStr).getTime() : new Date().getTime()
