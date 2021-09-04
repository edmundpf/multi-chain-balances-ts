import DefiBalances from './DefiBalances';
import { NATIVE_TOKENS } from './values';
import { DebankTransfer, DebankHistory, DebankTokens, ApeBoardTransfer, ApeBoardHistory, TokenRecords, HistoryRecord } from './types';
/**
 * DefiTransactions Class
 */
export default class DefiTransactions extends DefiBalances {
    /**
     * Get Transactions
     */
    getTransactions(useDebank?: boolean): Promise<void>;
    /**
     * Sterilize History Record
     */
    sterilizeHistoryRecord(record: DebankHistory | ApeBoardHistory, chainName: keyof typeof NATIVE_TOKENS, tokenSymbols: DebankTokens): HistoryRecord;
    /**
     * Split History Record
     */
    splitHistoryRecord(record: HistoryRecord): HistoryRecord[];
    /**
     * Sterilize Ape Board Transfer
     */
    sterilizeApeBoardTransfer(record: ApeBoardTransfer): {
        token: string;
        quantity: number;
    };
    /**
     * Sterilize Debank Transfer
     */
    sterilizeDebankTransfer(record: DebankTransfer, isSend: boolean | undefined, tokenSymbols: DebankTokens): {
        token: string;
        quantity: number;
    };
    /**
     * Sterilize Transaction Type
     */
    sterilizeTransactionType(type: string, tokens: TokenRecords): string;
}
