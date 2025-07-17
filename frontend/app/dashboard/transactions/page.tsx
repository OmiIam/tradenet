'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  Filter,
  Search,
  Download,
  Calendar,
  CreditCard,
  DollarSign,
  ArrowRight,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Transaction, Account, TransactionFilters } from '@/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: '',
    endDate: '',
    category: '',
    transactionType: undefined,
    status: undefined
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

      const mockTransactions: Transaction[] = [
        {
          id: 1,
          accountId: 1,
          transactionType: 'credit',
          amount: 2500.00,
          balanceAfter: 15420.50,
          description: 'Salary Deposit',
          referenceNumber: 'REF123456',
          category: 'income',
          status: 'completed',
          transactionDate: '2024-01-15T08:00:00Z',
          createdAt: '2024-01-15T08:00:00Z',
          accountName: 'Primary Checking'
        },
        {
          id: 2,
          accountId: 1,
          transactionType: 'debit',
          amount: -150.00,
          balanceAfter: 14920.50,
          description: 'Grocery Store Purchase',
          referenceNumber: 'REF123457',
          category: 'food',
          status: 'completed',
          transactionDate: '2024-01-14T10:30:00Z',
          createdAt: '2024-01-14T10:30:00Z',
          accountName: 'Primary Checking'
        },
        {
          id: 3,
          accountId: 1,
          transactionType: 'debit',
          amount: -89.99,
          balanceAfter: 14830.51,
          description: 'Gas Station Payment',
          referenceNumber: 'REF123458',
          category: 'transportation',
          status: 'completed',
          transactionDate: '2024-01-13T16:45:00Z',
          createdAt: '2024-01-13T16:45:00Z',
          accountName: 'Primary Checking'
        },
        {
          id: 4,
          accountId: 2,
          transactionType: 'credit',
          amount: 500.00,
          balanceAfter: 25000.00,
          description: 'Monthly Savings Transfer',
          referenceNumber: 'REF123459',
          category: 'transfer',
          status: 'completed',
          transactionDate: '2024-01-12T12:00:00Z',
          createdAt: '2024-01-12T12:00:00Z',
          accountName: 'Emergency Savings'
        },
        {
          id: 5,
          accountId: 1,
          transactionType: 'debit',
          amount: -1200.00,
          balanceAfter: 13920.51,
          description: 'Rent Payment',
          referenceNumber: 'REF123460',
          category: 'housing',
          status: 'completed',
          transactionDate: '2024-01-01T09:00:00Z',
          createdAt: '2024-01-01T09:00:00Z',
          accountName: 'Primary Checking'
        },
        {
          id: 6,
          accountId: 1,
          transactionType: 'debit',
          amount: -75.50,
          balanceAfter: 15345.00,
          description: 'Online Shopping',
          referenceNumber: 'REF123461',
          category: 'shopping',
          status: 'pending',
          transactionDate: '2024-01-16T14:20:00Z',
          createdAt: '2024-01-16T14:20:00Z',
          accountName: 'Primary Checking'
        }
      ];

      setAccounts(mockAccounts);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.referenceNumber && transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAccount = !selectedAccount || transaction.accountId === selectedAccount;
    const matchesType = !filters.transactionType || transaction.transactionType === filters.transactionType;
    const matchesStatus = !filters.status || transaction.status === filters.status;
    const matchesCategory = !filters.category || transaction.category === filters.category;
    
    const matchesDateRange = (!filters.startDate || new Date(transaction.transactionDate) >= new Date(filters.startDate)) &&
                            (!filters.endDate || new Date(transaction.transactionDate) <= new Date(filters.endDate));

    return matchesSearch && matchesAccount && matchesType && matchesStatus && matchesCategory && matchesDateRange;
  });

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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'debit':
        return <ArrowDownLeft className="w-5 h-5 text-red-600" />;
      default:
        return <ArrowRight className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'income': 'bg-green-100 text-green-800',
      'food': 'bg-orange-100 text-orange-800',
      'transportation': 'bg-blue-100 text-blue-800',
      'housing': 'bg-purple-100 text-purple-800',
      'shopping': 'bg-pink-100 text-pink-800',
      'transfer': 'bg-indigo-100 text-indigo-800',
      'utilities': 'bg-yellow-100 text-yellow-800',
      'entertainment': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const exportTransactions = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Balance', 'Status', 'Reference'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        formatDate(transaction.transactionDate),
        `"${transaction.description}"`,
        transaction.category,
        transaction.transactionType,
        transaction.amount,
        transaction.balanceAfter,
        transaction.status,
        transaction.referenceNumber || ''
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-20 bg-gray-200 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your transaction history.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportTransactions}
            className="p-3 bg-white/80 backdrop-blur-md border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Download className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 backdrop-blur-md border border-blue-200 rounded-xl transition-colors ${
              showFilters ? 'bg-banking-accent text-white' : 'bg-white/80 hover:bg-blue-50 text-blue-600'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Account Filter */}
          <select
            value={selectedAccount || ''}
            onChange={(e) => setSelectedAccount(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
          >
            <option value="">All Accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountName}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.transactionType || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              transactionType: e.target.value as 'debit' | 'credit' | undefined 
            }))}
            className="px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-blue-200/50"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="income">Income</option>
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="housing">Housing</option>
                  <option value="shopping">Shopping</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: e.target.value as 'pending' | 'completed' | 'failed' | undefined 
                  }))}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilters({});
                  setSearchTerm('');
                  setSelectedAccount(null);
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Credits</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              filteredTransactions
                .filter(t => t.transactionType === 'credit')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredTransactions.filter(t => t.transactionType === 'credit').length} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-red-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Debits</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(
              Math.abs(filteredTransactions
                .filter(t => t.transactionType === 'debit')
                .reduce((sum, t) => sum + t.amount, 0))
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredTransactions.filter(t => t.transactionType === 'debit').length} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Net Change</h3>
          <p className={`text-2xl font-bold ${
            filteredTransactions.reduce((sum, t) => sum + t.amount, 0) >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredTransactions.length} total transactions
          </p>
        </motion.div>
      </div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-blue-200/50">
          <h2 className="text-xl font-bold text-gray-900">
            Transactions ({filteredTransactions.length})
          </h2>
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
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {transaction.description}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(transaction.category)}`}>
                          {transaction.category}
                        </span>
                        <span className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize">{transaction.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(transaction.transactionDate)}</span>
                        <span>•</span>
                        <span>{transaction.accountName}</span>
                        {transaction.referenceNumber && (
                          <>
                            <span>•</span>
                            <span>{transaction.referenceNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No transactions found</p>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="p-6 border-t border-blue-200/50 text-center">
            <button className="bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
              Load More Transactions
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}