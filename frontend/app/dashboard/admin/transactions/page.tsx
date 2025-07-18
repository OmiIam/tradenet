'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  Filter,
  Edit3,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  X,
  Save,
  RefreshCw,
  Calendar,
  DollarSign
} from 'lucide-react';
import { AdminTransaction, TransactionUpdate } from '@/types';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionUpdate, setTransactionUpdate] = useState<TransactionUpdate>({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Fetch real transactions from backend
      const response = await fetch('/api/admin/transactions', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match AdminTransaction interface
        const enrichedTransactions: AdminTransaction[] = data.transactions.map((transaction: any) => ({
          id: transaction.id,
          accountId: transaction.accountId,
          userName: transaction.userName || '',
          userEmail: transaction.userEmail || '',
          accountName: transaction.accountName || '',
          accountNumber: transaction.accountNumber ? `****${transaction.accountNumber.slice(-4)}` : `****${String(transaction.accountId).slice(-4)}`,
          transactionType: transaction.transactionType,
          amount: transaction.amount,
          balanceAfter: transaction.balanceAfter,
          description: transaction.description,
          referenceNumber: `TXN${transaction.id.toString().padStart(6, '0')}`,
          category: transaction.category,
          status: transaction.status,
          transactionDate: transaction.transactionDate,
          createdAt: transaction.createdAt,
          createdBy: transaction.createdBy
        }));
        setTransactions(enrichedTransactions);
      } else {
        console.error('Failed to fetch transactions');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction: AdminTransaction) => {
    setSelectedTransaction(transaction);
    setTransactionUpdate({
      description: transaction.description,
      category: transaction.category,
      notes: transaction.notes,
      status: transaction.status
    });
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the transaction in the list
      setTransactions(prev => prev.map(transaction => 
        transaction.id === selectedTransaction.id 
          ? { 
              ...transaction, 
              description: transactionUpdate.description || transaction.description,
              category: transactionUpdate.category || transaction.category,
              notes: transactionUpdate.notes || transaction.notes,
              status: transactionUpdate.status || transaction.status
            }
          : transaction
      ));

      setShowEditModal(false);
      setSelectedTransaction(null);
      setTransactionUpdate({});
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (!confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API call
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.referenceNumber && transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || transaction.transactionType === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
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
        return <ArrowUpRight className="w-5 h-5 text-gray-600" />;
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
      'business': 'bg-emerald-100 text-emerald-800',
      'entertainment': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Calculate summary stats
  const totalCredits = filteredTransactions
    .filter(t => t.transactionType === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = Math.abs(filteredTransactions
    .filter(t => t.transactionType === 'debit')
    .reduce((sum, t) => sum + t.amount, 0));

  const pendingCount = filteredTransactions.filter(t => t.status === 'pending').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all system transactions.
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Credits</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredTransactions.filter(t => t.transactionType === 'credit').length} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-red-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Debits</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredTransactions.filter(t => t.transactionType === 'debit').length} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-yellow-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Transactions</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-sm text-gray-500 mt-1">Require attention</p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-red-200/50 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, user, category, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl border border-red-200/50 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-red-200/50">
          <h2 className="text-xl font-bold text-gray-900">
            Transactions ({filteredTransactions.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Account</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </span>
                          {transaction.referenceNumber && (
                            <span className="text-xs text-gray-500">{transaction.referenceNumber}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.userName}</p>
                      <p className="text-sm text-gray-500">{transaction.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.accountName}</p>
                      <p className="text-sm text-gray-500">{transaction.accountNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.transactionDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Transaction"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No transactions found</p>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </motion.div>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {showEditModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Transaction</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getTransactionIcon(selectedTransaction.transactionType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedTransaction.description}</h3>
                    <p className="text-sm text-gray-500">{selectedTransaction.userName}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Amount: <span className="font-bold">{formatCurrency(selectedTransaction.amount)}</span>
                </p>
              </div>

              <form onSubmit={handleUpdateTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={transactionUpdate.description || ''}
                    onChange={(e) => setTransactionUpdate(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={transactionUpdate.category || ''}
                    onChange={(e) => setTransactionUpdate(prev => ({ 
                      ...prev, 
                      category: e.target.value 
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="income">Income</option>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="housing">Housing</option>
                    <option value="shopping">Shopping</option>
                    <option value="utilities">Utilities</option>
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={transactionUpdate.status || ''}
                    onChange={(e) => setTransactionUpdate(prev => ({ 
                      ...prev, 
                      status: e.target.value as 'pending' | 'completed' | 'failed' | 'cancelled'
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={transactionUpdate.notes || ''}
                    onChange={(e) => setTransactionUpdate(prev => ({ 
                      ...prev, 
                      notes: e.target.value 
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Optional notes about this transaction..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>
                        Transaction edits will be logged in the audit trail. 
                        Only edit transactions when necessary and with proper authorization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Transaction</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}