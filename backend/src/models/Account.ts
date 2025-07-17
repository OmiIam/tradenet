import mongoose, { Document, Schema } from 'mongoose';

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

  // Methods
  canDebit(amount: number): boolean;
  updateBalance(amount: number, type: 'debit' | 'credit'): Promise<void>;
}

const AccountSchema = new Schema<IAccount>({
  userId: {
    type: Schema.Types.ObjectId,
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
      validator: function(value: number) {
        // Credit accounts can have negative balances (debt)
        if (this.accountType === 'credit') return true;
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
    default: '021000021' // Bank of America routing number as default
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
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Compound indexes for performance
AccountSchema.index({ userId: 1, isActive: 1 });
AccountSchema.index({ accountType: 1, isActive: 1 });
AccountSchema.index({ balance: -1 });
AccountSchema.index({ createdAt: -1 });

// Virtual for masked account number
AccountSchema.virtual('maskedAccountNumber').get(function() {
  return '****' + this.accountNumber.slice(-4);
});

// Virtual for account status
AccountSchema.virtual('status').get(function() {
  if (!this.isActive) return 'closed';
  if (this.isFrozen) return 'frozen';
  if (this.balance < this.minimumBalance) return 'below_minimum';
  return 'active';
});

// Pre-save middleware to generate account number if not provided
AccountSchema.pre('save', function(next) {
  if (!this.accountNumber) {
    // Generate a 16-digit account number
    this.accountNumber = '4532' + Math.random().toString().slice(2, 14);
  }
  
  // Update available balance for credit accounts
  if (this.accountType === 'credit') {
    this.availableBalance = this.overdraftLimit + this.balance; // balance is negative for debt
  } else {
    this.availableBalance = this.balance;
  }
  
  next();
});

// Instance method to check if account can be debited
AccountSchema.methods.canDebit = function(amount: number): boolean {
  if (!this.isActive || this.isFrozen) return false;
  
  if (this.accountType === 'credit') {
    // For credit accounts, check against credit limit
    return Math.abs(this.balance - amount) <= this.overdraftLimit;
  } else {
    // For other accounts, check against available balance plus overdraft
    return (this.balance + this.overdraftLimit) >= amount;
  }
};

// Instance method to update balance
AccountSchema.methods.updateBalance = async function(amount: number, type: 'debit' | 'credit'): Promise<void> {
  const change = type === 'credit' ? amount : -amount;
  
  this.balance += change;
  this.lastTransactionDate = new Date();
  
  // Update available balance
  if (this.accountType === 'credit') {
    this.availableBalance = this.overdraftLimit + this.balance;
  } else {
    this.availableBalance = this.balance;
  }
  
  return this.save();
};

// Static method to find active accounts by user
AccountSchema.statics.findActiveByUser = function(userId: string) {
  return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

// Static method to get total balance by user
AccountSchema.statics.getTotalBalanceByUser = async function(userId: string): Promise<number> {
  const result = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
    { $group: { _id: null, total: { $sum: '$balance' } } }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

export default mongoose.model<IAccount>('Account', AccountSchema);