'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff,
  Plus,
  MoreVertical,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  Building,
  Filter,
  Search
} from 'lucide-react';
import { Account, Transaction } from '@/types';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount.id);
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      // Mock data for now - will be replaced with API call
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
        },
        {
          id: 3,
          userId: 1,
          accountNumber: '4532 9012 3456 7890',
          accountType: 'cd',
          accountName: '12-Month CD',
          balance: 10000.00,
          availableBalance: 0,
          interestRate: 4.5,
          minimumBalance: 1000,
          monthlyFee: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      ];

      setAccounts(mockAccounts);
      if (mockAccounts.length > 0) {
        setSelectedAccount(mockAccounts[0]);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId: number) => {
    try {
      // Mock data for now - will be replaced with API call
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          accountId: accountId,
          transactionType: 'debit',
          amount: -150.00,
          balanceAfter: 15420.50,
          description: 'Grocery Store Purchase',
          category: 'food',
          status: 'completed',
          transactionDate: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          accountId: accountId,
          transactionType: 'credit',
          amount: 2500.00,
          balanceAfter: 15570.50,
          description: 'Salary Deposit',
          category: 'income',
          status: 'completed',
          transactionDate: '2024-01-15T08:00:00Z',
          createdAt: '2024-01-15T08:00:00Z'
        },
        {
          id: 3,
          accountId: accountId,
          transactionType: 'debit',
          amount: -89.99,
          balanceAfter: 13070.51,
          description: 'Gas Station',
          category: 'transportation',
          status: 'completed',
          transactionDate: '2024-01-14T16:45:00Z',
          createdAt: '2024-01-14T16:45:00Z'
        },
        {
          id: 4,
          accountId: accountId,
          transactionType: 'debit',
          amount: -1200.00,
          balanceAfter: 13160.50,
          description: 'Rent Payment',
          category: 'housing',
          status: 'completed',
          transactionDate: '2024-01-01T09:00:00Z',
          createdAt: '2024-01-01T09:00:00Z'
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="w-6 h-6" />;
      case 'savings':
        return <PieChart className="w-6 h-6" />;
      case 'business':
        return <Building className="w-6 h-6" />;
      case 'cd':
        return <Calendar className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'debit':
        return <ArrowDownLeft className="w-5 h-5 text-red-600" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'from-blue-500 to-cyan-500';
      case 'savings':
        return 'from-green-500 to-emerald-500';
      case 'business':
        return 'from-purple-500 to-violet-500';
      case 'cd':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.transactionType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Accounts</h1>
          <p className="text-gray-600 mt-1">
            Manage your accounts and view transaction history.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="p-3 bg-white/80 backdrop-blur-md border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
          >
            {balanceVisible ? (
              <Eye className="w-5 h-5 text-blue-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-blue-600" />
            )}
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Open New Account
          </motion.button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {accounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              relative overflow-hidden bg-gradient-to-br ${getAccountTypeColor(account.accountType)} 
              rounded-2xl p-6 text-white shadow-xl cursor-pointer
              ${selectedAccount?.id === account.id ? 'ring-4 ring-white/50 scale-105' : 'hover:scale-102'}
              transition-all duration-300
            `}
            onClick={() => setSelectedAccount(account)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {getAccountIcon(account.accountType)}
              </div>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{account.accountName}</h3>
                <p className="text-white/80 font-mono text-sm">
                  {account.accountNumber}
                </p>
              </div>

              <div>
                <p className="text-white/80 text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold">
                  {balanceVisible ? formatCurrency(account.availableBalance) : '••••••'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/80 text-xs">Interest Rate</p>
                  <p className="font-medium">{account.interestRate}% APY</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs">Account Type</p>
                  <p className="font-medium capitalize">{account.accountType}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction History */}
      {selectedAccount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200/50 shadow-lg"
        >
          <div className="p-6 border-b border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Transaction History - {selectedAccount.accountName}
              </h2>
              <div className="flex items-center space-x-3">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {transaction.description}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.transactionDate)} • {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.transactionType === 'credit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.transactionType === 'credit' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-sm text-gray-500">
                        Balance: {formatCurrency(transaction.balanceAfter)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions found matching your criteria.</p>
              </div>
            )}
          </div>

          {filteredTransactions.length > 0 && (
            <div className="p-6 border-t border-blue-200/50">
              <button className="w-full bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
                Load More Transactions
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}