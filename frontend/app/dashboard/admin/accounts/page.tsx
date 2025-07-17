'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search,
  Filter,
  Edit3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Building,
  User,
  PieChart,
  Calendar,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { AdminAccount, BalanceUpdate } from '@/types';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<AdminAccount | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState<BalanceUpdate>({
    accountId: 0,
    newBalance: 0,
    reason: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // Mock data for now - will be replaced with API call
      const mockAccounts: AdminAccount[] = [
        {
          id: 1,
          userId: 1,
          userEmail: 'john.doe@email.com',
          userName: 'John Doe',
          accountNumber: '4532 1234 5678 9012',
          accountType: 'checking',
          accountName: 'Primary Checking',
          balance: 15420.50,
          availableBalance: 15420.50,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          userId: 1,
          userEmail: 'john.doe@email.com',
          userName: 'John Doe',
          accountNumber: '4532 5678 9012 3456',
          accountType: 'savings',
          accountName: 'Emergency Savings',
          balance: 25000.00,
          availableBalance: 25000.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          userId: 2,
          userEmail: 'sarah.johnson@business.com',
          userName: 'Sarah Johnson',
          accountNumber: '4532 9012 3456 7890',
          accountType: 'business',
          accountName: 'Business Operations',
          balance: 125000.75,
          availableBalance: 125000.75,
          isActive: true,
          createdAt: '2023-12-15T00:00:00Z'
        },
        {
          id: 4,
          userId: 2,
          userEmail: 'sarah.johnson@business.com',
          userName: 'Sarah Johnson',
          accountNumber: '4532 3456 7890 1234',
          accountType: 'cd',
          accountName: '12-Month CD',
          balance: 50000.00,
          availableBalance: 0,
          isActive: true,
          createdAt: '2023-12-15T00:00:00Z'
        },
        {
          id: 5,
          userId: 4,
          userEmail: 'mike.wilson@email.com',
          userName: 'Mike Wilson',
          accountNumber: '4532 7890 1234 5678',
          accountType: 'checking',
          accountName: 'Personal Checking',
          balance: 5200.00,
          availableBalance: 5200.00,
          isActive: false,
          createdAt: '2023-11-20T00:00:00Z'
        }
      ];

      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBalance = (account: AdminAccount) => {
    setSelectedAccount(account);
    setBalanceUpdate({
      accountId: account.id,
      newBalance: account.balance,
      reason: ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the account in the list
      setAccounts(prev => prev.map(account => 
        account.id === balanceUpdate.accountId 
          ? { 
              ...account, 
              balance: balanceUpdate.newBalance,
              availableBalance: balanceUpdate.newBalance
            }
          : account
      ));

      setShowEditModal(false);
      setSelectedAccount(null);
      setBalanceUpdate({ accountId: 0, newBalance: 0, reason: '' });
    } catch (error) {
      console.error('Failed to update balance:', error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || account.accountType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && account.isActive) ||
                         (filterStatus === 'inactive' && !account.isActive);
    
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
      year: 'numeric'
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="w-5 h-5" />;
      case 'savings':
        return <PieChart className="w-5 h-5" />;
      case 'business':
        return <Building className="w-5 h-5" />;
      case 'cd':
        return <Calendar className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
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
        return 'from-orange-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  // Calculate summary stats
  const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = filteredAccounts.filter(account => account.isActive).length;
  const totalAccounts = filteredAccounts.length;

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
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage customer account balances and settings.
          </p>
        </div>
        <button
          onClick={fetchAccounts}
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
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Accounts</h3>
          <p className="text-2xl font-bold text-gray-900">{totalAccounts}</p>
          <p className="text-sm text-green-600 mt-1">{activeAccounts} active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.5%
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-gray-500 mt-1">All account types</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Average Balance</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalAccounts > 0 ? totalBalance / totalAccounts : 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per account</p>
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
              placeholder="Search by account holder, account name, or number..."
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
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="business">Business</option>
            <option value="cd">Certificate of Deposit</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </motion.div>

      {/* Accounts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredAccounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-red-200/50 shadow-lg overflow-hidden"
          >
            {/* Account Header */}
            <div className={`bg-gradient-to-r ${getAccountTypeColor(account.accountType)} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {getAccountIcon(account.accountType)}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  account.isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-red-500/20 text-red-100'
                }`}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{account.accountName}</h3>
              <p className="text-white/80 font-mono text-sm">{account.accountNumber}</p>
              <p className="text-white/80 text-sm capitalize mt-1">{account.accountType} Account</p>
            </div>

            {/* Account Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Holder</p>
                  <p className="font-semibold text-gray-900">{account.userName}</p>
                  <p className="text-sm text-gray-500">{account.userEmail}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(account.availableBalance)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Created: {formatDate(account.createdAt)}</span>
              </div>

              <button
                onClick={() => handleEditBalance(account)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Balance</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Edit Balance Modal */}
      <AnimatePresence>
        {showEditModal && selectedAccount && (
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
                <h2 className="text-2xl font-bold text-gray-900">Edit Account Balance</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getAccountTypeColor(selectedAccount.accountType)} rounded-lg flex items-center justify-center text-white`}>
                    {getAccountIcon(selectedAccount.accountType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedAccount.accountName}</h3>
                    <p className="text-sm text-gray-500">{selectedAccount.userName}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Current Balance: <span className="font-bold">{formatCurrency(selectedAccount.balance)}</span>
                </p>
              </div>

              <form onSubmit={handleUpdateBalance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Balance *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={balanceUpdate.newBalance}
                      onChange={(e) => setBalanceUpdate(prev => ({ 
                        ...prev, 
                        newBalance: parseFloat(e.target.value) || 0 
                      }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Change *
                  </label>
                  <textarea
                    value={balanceUpdate.reason}
                    onChange={(e) => setBalanceUpdate(prev => ({ 
                      ...prev, 
                      reason: e.target.value 
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Explain why you're changing this balance..."
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>
                        Changing account balances will be logged in the audit trail. 
                        Make sure you have proper authorization for this action.
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
                    disabled={updating || !balanceUpdate.reason.trim()}
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
                        <span>Update Balance</span>
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