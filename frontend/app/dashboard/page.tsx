'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
  DollarSign,
  PieChart,
  Calendar,
  Clock
} from 'lucide-react';
import { DashboardOverview, AccountSummary, Transaction } from '@/types';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/overview', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data');
        // Fall back to mock data for development
        const mockData: DashboardOverview = {
          user: {
            id: 1,
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            isAdmin: false,
            accountType: 'personal'
          },
          accounts: [
            {
              id: 1,
              accountNumber: '****1234',
              accountType: 'checking',
              accountName: 'Primary Checking',
              balance: 15420.50,
              availableBalance: 15420.50
            },
            {
              id: 2,
              accountNumber: '****5678',
              accountType: 'savings',
              accountName: 'Emergency Savings',
              balance: 25000.00,
              availableBalance: 25000.00
            }
          ],
          totalBalance: 40420.50,
          recentTransactions: [
            {
              id: 1,
              accountId: 1,
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
              accountId: 1,
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
              accountId: 2,
              transactionType: 'credit',
              amount: 500.00,
              balanceAfter: 25000.00,
              description: 'Monthly Savings Transfer',
              category: 'transfer',
              status: 'completed',
              transactionDate: '2024-01-14T12:00:00Z',
              createdAt: '2024-01-14T12:00:00Z'
            }
          ],
          monthlySpending: 3250.75,
          monthlyIncome: 5500.00,
          pendingTransactions: 2
        };
        setDashboardData(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="w-5 h-5" />;
      case 'savings':
        return <PieChart className="w-5 h-5" />;
      case 'business':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'debit':
        return <ArrowDownLeft className="w-4 h-4 text-red-600" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.user.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your accounts today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Quick Transfer
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-banking-deepBlue to-banking-accent rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {balanceVisible ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">
            {balanceVisible ? formatCurrency(dashboardData.totalBalance) : '••••••'}
          </p>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Income</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(dashboardData.monthlyIncome)}
          </p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </motion.div>

        {/* Monthly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-red-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Spending</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(dashboardData.monthlySpending)}
          </p>
          <p className="text-sm text-red-600 mt-1">-8% from last month</p>
        </motion.div>

        {/* Pending Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-yellow-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardData.pendingTransactions}
          </p>
          <p className="text-sm text-yellow-600 mt-1">Transactions</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Accounts Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Accounts</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                    {getAccountIcon(account.accountType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
                    <p className="text-sm text-gray-600">{account.accountNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {balanceVisible ? formatCurrency(account.balance) : '••••••'}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{account.accountType}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
            Open New Account
          </button>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.transactionType)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <p className="text-sm text-gray-500">{formatDate(transaction.transactionDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.transactionType === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.transactionType === 'credit' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 border border-blue-300 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors">
            View Transaction History
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-900">Transfer Money</span>
          </button>

          <button className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-900">Add Payee</span>
          </button>

          <button className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-900">Schedule Payment</span>
          </button>

          <button className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-900">View Analytics</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}