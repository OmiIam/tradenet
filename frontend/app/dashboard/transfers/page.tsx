'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, 
  CreditCard, 
  Users, 
  Plus, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { Account, Payee, TransferForm } from '@/types';

export default function TransfersPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [transferForm, setTransferForm] = useState<TransferForm>({
    fromAccountId: 0,
    amount: 0,
    description: '',
    category: 'transfer'
  });
  const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data for now - will be replaced with API calls
      const mockAccounts: Account[] = [
        {
          id: 1,
          userId: 1,
          accountNumber: '4532 1234 5678 9012',
          accountType: 'checking',
          accountName: 'Primary Checking',
          balance: 15420.50,
          availableBalance: 15420.50,
          interestRate: 0.01,
          minimumBalance: 100,
          monthlyFee: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          userId: 1,
          accountNumber: '4532 5678 9012 3456',
          accountType: 'savings',
          accountName: 'Emergency Savings',
          balance: 25000.00,
          availableBalance: 25000.00,
          interestRate: 2.5,
          minimumBalance: 500,
          monthlyFee: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      ];

      const mockPayees: Payee[] = [
        {
          id: 1,
          userId: 1,
          name: 'John Smith',
          accountNumber: '1234567890',
          routingNumber: '021000021',
          bankName: 'Chase Bank',
          payeeType: 'person',
          phone: '(555) 123-4567',
          email: 'john.smith@email.com',
          isVerified: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          userId: 1,
          name: 'Electric Company',
          accountNumber: '9876543210',
          routingNumber: '021000021',
          bankName: 'Bank of America',
          payeeType: 'utility',
          isVerified: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      ];

      setAccounts(mockAccounts);
      setPayees(mockPayees);
      if (mockAccounts.length > 0) {
        setTransferForm(prev => ({ ...prev, fromAccountId: mockAccounts[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setTransferForm({
          fromAccountId: accounts[0]?.id || 0,
          amount: 0,
          description: '',
          category: 'transfer'
        });
        setTransferType('internal');
      }, 3000);
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="w-5 h-5" />;
      case 'savings':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const selectedFromAccount = accounts.find(account => account.id === transferForm.fromAccountId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your transfer of {formatCurrency(transferForm.amount)} has been processed successfully.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg max-w-md mx-auto"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{formatCurrency(transferForm.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-semibold">{selectedFromAccount?.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-semibold">{transferForm.description}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfer Money</h1>
          <p className="text-gray-600 mt-1">
            Send money between your accounts or to external payees.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-blue-200/50 shadow-lg"
          >
            {/* Transfer Type Selector */}
            <div className="flex mb-8">
              <button
                onClick={() => setTransferType('internal')}
                className={`flex-1 py-3 px-6 rounded-l-xl font-medium transition-colors ${
                  transferType === 'internal'
                    ? 'bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5 inline mr-2" />
                Between My Accounts
              </button>
              <button
                onClick={() => setTransferType('external')}
                className={`flex-1 py-3 px-6 rounded-r-xl font-medium transition-colors ${
                  transferType === 'external'
                    ? 'bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                To External Payee
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Account
                </label>
                <select
                  value={transferForm.fromAccountId}
                  onChange={(e) => setTransferForm(prev => ({ 
                    ...prev, 
                    fromAccountId: parseInt(e.target.value) 
                  }))}
                  className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountName} - {formatCurrency(account.availableBalance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Account/Payee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {transferType === 'internal' ? 'To Account' : 'To Payee'}
                </label>
                {transferType === 'internal' ? (
                  <select
                    value={transferForm.toAccountId || ''}
                    onChange={(e) => setTransferForm(prev => ({ 
                      ...prev, 
                      toAccountId: parseInt(e.target.value),
                      payeeId: undefined
                    }))}
                    className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select destination account</option>
                    {accounts
                      .filter(account => account.id !== transferForm.fromAccountId)
                      .map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountName} - {formatCurrency(account.balance)}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div>
                    <select
                      value={transferForm.payeeId || ''}
                      onChange={(e) => setTransferForm(prev => ({ 
                        ...prev, 
                        payeeId: parseInt(e.target.value),
                        toAccountId: undefined
                      }))}
                      className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select payee</option>
                      {payees.map((payee) => (
                        <option key={payee.id} value={payee.id}>
                          {payee.name} - {payee.bankName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add New Payee
                    </button>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedFromAccount?.availableBalance || 0}
                    value={transferForm.amount || ''}
                    onChange={(e) => setTransferForm(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full pl-12 pr-4 py-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                {selectedFromAccount && (
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {formatCurrency(selectedFromAccount.availableBalance)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={transferForm.description}
                  onChange={(e) => setTransferForm(prev => ({ 
                    ...prev, 
                    description: e.target.value 
                  }))}
                  className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's this transfer for?"
                  required
                />
              </div>

              {/* Schedule Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Transfer (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={transferForm.scheduledDate || ''}
                  onChange={(e) => setTransferForm(prev => ({ 
                    ...prev, 
                    scheduledDate: e.target.value 
                  }))}
                  className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting || transferForm.amount <= 0}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Clock className="w-5 h-5 inline mr-2 animate-spin" />
                    Processing Transfer...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 inline mr-2" />
                    Transfer {transferForm.amount > 0 ? formatCurrency(transferForm.amount) : 'Money'}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transfer Type:</span>
                <span className="font-medium capitalize">{transferType}</span>
              </div>
              
              {selectedFromAccount && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">From:</span>
                  <div className="text-right">
                    <p className="font-medium">{selectedFromAccount.accountName}</p>
                    <p className="text-sm text-gray-500">{selectedFromAccount.accountNumber}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-xl text-blue-600">
                  {transferForm.amount > 0 ? formatCurrency(transferForm.amount) : '$0.00'}
                </span>
              </div>
              
              {transferForm.scheduledDate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">
                    {new Date(transferForm.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Transfer Information</p>
                  <p>
                    {transferType === 'internal' 
                      ? 'Internal transfers are processed instantly.'
                      : 'External transfers may take 1-3 business days to complete.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">Manage Payees</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">Scheduled Transfers</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-lg transition-colors">
                <ArrowLeftRight className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">Transfer History</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}