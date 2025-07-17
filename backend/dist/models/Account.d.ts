import mongoose, { Document } from 'mongoose';
export interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    accountNumber: string;
    accountType: 'checking' | 'savings' | 'business' | 'credit';
    accountName: string;
    balance: number;
    availableBalance: number;
    interestRate: number;
    minimumBalance: number;
    monthlyFee: number;
    overdraftLimit: number;
    isActive: boolean;
    isFrozen: boolean;
    currency: string;
    routingNumber: string;
    openedDate: Date;
    closedDate?: Date;
    lastTransactionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    canDebit(amount: number): boolean;
    updateBalance(amount: number, type: 'debit' | 'credit'): Promise<void>;
}
declare const _default: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount, {}> & IAccount & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Account.d.ts.map