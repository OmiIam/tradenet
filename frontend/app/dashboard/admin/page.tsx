'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  ArrowLeftRight, 
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  Database,
  Globe
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  totalBalance: number;
  todayTransactions: number;
  todayVolume: number;
  pendingTransactions: number;
  systemAlerts: number;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'large_transaction' | 'failed_login' | 'account_locked' | 'admin_action';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Mock data for now - will be replaced with API calls
      const mockStats: AdminStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalAccounts: 2891,
        totalBalance: 45678901.23,
        todayTransactions: 2156,
        todayVolume: 8945672.50,
        pendingTransactions: 12,
        systemAlerts: 3
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'user_created',
          message: 'New user registration: john.doe@email.com',
          timestamp: '2024-01-16T14:30:00Z',
          severity: 'low'
        },
        {
          id: '2',
          type: 'large_transaction',
          message: 'Large transaction detected: $50,000 transfer',
          timestamp: '2024-01-16T14:25:00Z',
          severity: 'medium'
        },
        {
          id: '3',
          type: 'failed_login',
          message: 'Multiple failed login attempts from IP 192.168.1.100',
          timestamp: '2024-01-16T14:20:00Z',
          severity: 'high'
        },
        {
          id: '4',
          type: 'admin_action',
          message: 'Account balance updated by admin: Account #1234',
          timestamp: '2024-01-16T14:15:00Z',
          severity: 'medium'
        },
        {
          id: '5',
          type: 'account_locked',
          message: 'Account automatically locked due to suspicious activity',
          timestamp: '2024-01-16T14:10:00Z',
          severity: 'high'
        }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'large_transaction':
        return <ArrowLeftRight className="w-5 h-5 text-orange-600" />;
      case 'failed_login':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'account_locked':
        return <Shield className="w-5 h-5 text-red-600" />;
      case 'admin_action':
        return <Activity className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(8)].map((_, i) => (
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load admin data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-600 mt-1">
          System overview and key performance metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.2%
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatNumber(stats.activeUsers)} active users
          </p>
        </motion.div>

        {/* Total Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3.8%
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Accounts</h3>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalAccounts)}</p>
          <p className="text-sm text-gray-500 mt-1">All account types</p>
        </motion.div>

        {/* Total Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.1%
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBalance)}</p>
          <p className="text-sm text-gray-500 mt-1">System-wide balance</p>
        </motion.div>

        {/* Today's Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-red-600 text-sm">
                <TrendingDown className="w-4 h-4 mr-1" />
                -2.1%
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Today's Transactions</h3>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.todayTransactions)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatCurrency(stats.todayVolume)} volume
          </p>
        </motion.div>

        {/* Pending Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-yellow-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Transactions</h3>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.pendingTransactions)}</p>
          <p className="text-sm text-gray-500 mt-1">Require attention</p>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-red-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">System Alerts</h3>
          <p className="text-2xl font-bold text-red-600">{formatNumber(stats.systemAlerts)}</p>
          <p className="text-sm text-gray-500 mt-1">Critical issues</p>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">System Health</h3>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-xl font-bold text-green-600">Healthy</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">99.9% uptime</p>
        </motion.div>

        {/* Database Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-indigo-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Database</h3>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-xl font-bold text-green-600">Operational</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">2.1GB used</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-xl border-l-4 ${getSeverityColor(activity.severity)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${
                    activity.severity === 'high' ? 'bg-red-100 text-red-800' :
                    activity.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {activity.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
            View Detailed Activity Log
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-6"
        >
          {/* System Actions */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium">User Management</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
                <CreditCard className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium">Account Overview</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
                <ArrowLeftRight className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium">Transaction Monitor</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium">System Reports</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">API Services</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Security</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Secure</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Monitoring</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}