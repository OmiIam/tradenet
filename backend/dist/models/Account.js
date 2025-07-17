"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AccountSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    accountNumber: {
        type: String,
        required: [true, 'Account number is required'],
        unique: true,
        match: [/^\d{16}$/, 'Account number must be 16 digits'],
        index: true
    },
    accountType: {
        type: String,
        enum: {
            values: ['checking', 'savings', 'business', 'credit'],
            message: 'Account type must be checking, savings, business, or credit'
        },
        required: [true, 'Account type is required'],
        index: true
    },
    accountName: {
        type: String,
        required: [true, 'Account name is required'],
        trim: true,
        maxlength: [100, 'Account name cannot exceed 100 characters']
    },
    balance: {
        type: Number,
        required: [true, 'Balance is required'],
        default: 0,
        min: [0, 'Balance cannot be negative for most account types'],
        validate: {
            validator: function (value) {
                if (this.accountType === 'credit')
                    return true;
                return value >= 0;
            },
            message: 'Balance cannot be negative for non-credit accounts'
        }
    },
    availableBalance: {
        type: Number,
        required: [true, 'Available balance is required'],
        default: 0
    },
    interestRate: {
        type: Number,
        default: 0,
        min: [0, 'Interest rate cannot be negative'],
        max: [100, 'Interest rate cannot exceed 100%']
    },
    minimumBalance: {
        type: Number,
        default: 0,
        min: [0, 'Minimum balance cannot be negative']
    },
    monthlyFee: {
        type: Number,
        default: 0,
        min: [0, 'Monthly fee cannot be negative']
    },
    overdraftLimit: {
        type: Number,
        default: 0,
        min: [0, 'Overdraft limit cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'CAD'],
        maxlength: [3, 'Currency code must be 3 characters']
    },
    routingNumber: {
        type: String,
        required: [true, 'Routing number is required'],
        match: [/^\d{9}$/, 'Routing number must be 9 digits'],
        default: '021000021'
    },
    openedDate: {
        type: Date,
        default: Date.now
    },
    closedDate: {
        type: Date
    },
    lastTransactionDate: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});
AccountSchema.index({ userId: 1, isActive: 1 });
AccountSchema.index({ accountType: 1, isActive: 1 });
AccountSchema.index({ balance: -1 });
AccountSchema.index({ createdAt: -1 });
AccountSchema.virtual('maskedAccountNumber').get(function () {
    return '****' + this.accountNumber.slice(-4);
});
AccountSchema.virtual('status').get(function () {
    if (!this.isActive)
        return 'closed';
    if (this.isFrozen)
        return 'frozen';
    if (this.balance < this.minimumBalance)
        return 'below_minimum';
    return 'active';
});
AccountSchema.pre('save', function (next) {
    if (!this.accountNumber) {
        this.accountNumber = '4532' + Math.random().toString().slice(2, 14);
    }
    if (this.accountType === 'credit') {
        this.availableBalance = this.overdraftLimit + this.balance;
    }
    else {
        this.availableBalance = this.balance;
    }
    next();
});
AccountSchema.methods.canDebit = function (amount) {
    if (!this.isActive || this.isFrozen)
        return false;
    if (this.accountType === 'credit') {
        return Math.abs(this.balance - amount) <= this.overdraftLimit;
    }
    else {
        return (this.balance + this.overdraftLimit) >= amount;
    }
};
AccountSchema.methods.updateBalance = async function (amount, type) {
    const change = type === 'credit' ? amount : -amount;
    this.balance += change;
    this.lastTransactionDate = new Date();
    if (this.accountType === 'credit') {
        this.availableBalance = this.overdraftLimit + this.balance;
    }
    else {
        this.availableBalance = this.balance;
    }
    return this.save();
};
AccountSchema.statics.findActiveByUser = function (userId) {
    return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};
AccountSchema.statics.getTotalBalanceByUser = async function (userId) {
    const result = await this.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), isActive: true } },
        { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
};
exports.default = mongoose_1.default.model('Account', AccountSchema);
//# sourceMappingURL=Account.js.map