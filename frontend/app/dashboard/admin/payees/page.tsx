'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search,
  Filter,
  Edit3,
  Phone,
  Mail,
  Building,
  CreditCard,
  CheckCircle,
  XCircle,
  User,
  Shield,
  RefreshCw,
  X,
  Save
} from 'lucide-react';
import { AdminPayee } from '@/types';

interface PayeeUpdate {
  payeeId: number;
  isVerified: boolean;
  isActive: boolean;
}

export default function AdminPayeesPage() {
  const [payees, setPayees] = useState<AdminPayee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPayee, setSelectedPayee] = useState<AdminPayee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [payeeUpdate, setPayeeUpdate] = useState<PayeeUpdate>({
    payeeId: 0,
    isVerified: false,
    isActive: true
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPayees();
  }, []);

  const fetchPayees = async () => {
    try {
      // Fetch real payees from backend
      const response = await fetch('https://internet-banking-production-68f4.up.railway.app/api/admin/payees', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayees(data.payees || []);
      } else {
        console.error('Failed to fetch payees');
        setPayees([]);
      }
    } catch (error) {
      console.error('Failed to fetch payees:', error);
      setPayees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayee = (payee: AdminPayee) => {
    setSelectedPayee(payee);
    setPayeeUpdate({
      payeeId: payee.id,
      isVerified: payee.isVerified,
      isActive: payee.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdatePayee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayee) return;

    setUpdating(true);
    try {
      // Call the real backend API
      const response = await fetch('https://internet-banking-production-68f4.up.railway.app/api/admin/payees', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payeeId: payeeUpdate.payeeId,
          isVerified: payeeUpdate.isVerified,
          isActive: payeeUpdate.isActive
        }),
      });

      if (response.ok) {
        // Update the payee in the list
        setPayees(prev => prev.map(payee => 
          payee.id === payeeUpdate.payeeId 
            ? { 
                ...payee, 
                isVerified: payeeUpdate.isVerified,
                isActive: payeeUpdate.isActive
              }
            : payee
        ));

        setShowEditModal(false);
        setSelectedPayee(null);
        setPayeeUpdate({ payeeId: 0, isVerified: false, isActive: true });
      } else {
        console.error('Failed to update payee');
      }
    } catch (error) {
      console.error('Failed to update payee:', error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredPayees = payees.filter(payee => {
    const matchesSearch = payee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payee.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payee.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payee.bankName && payee.bankName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || payee.payeeType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'verified' && payee.isVerified) ||
                         (filterStatus === 'unverified' && !payee.isVerified) ||
                         (filterStatus === 'active' && payee.isActive) ||
                         (filterStatus === 'inactive' && !payee.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPayeeTypeIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-5 h-5" />;
      case 'business':
        return <Building className="w-5 h-5" />;
      case 'utility':
        return <Shield className="w-5 h-5" />;
      case 'government':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getPayeeTypeColor = (type: string) => {
    switch (type) {
      case 'person':
        return 'from-blue-500 to-cyan-500';
      case 'business':
        return 'from-purple-500 to-violet-500';
      case 'utility':
        return 'from-orange-500 to-amber-500';
      case 'government':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'text-red-600 bg-red-100';
    if (isVerified) return 'text-green-600 bg-green-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  // Calculate summary stats
  const totalPayees = filteredPayees.length;
  const verifiedPayees = filteredPayees.filter(payee => payee.isVerified).length;
  const activePayees = filteredPayees.filter(payee => payee.isActive).length;

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
          <h1 className="text-3xl font-bold text-gray-900">Payee Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage customer payees and verification status.
          </p>
        </div>
        <button
          onClick={fetchPayees}
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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Payees</h3>
          <p className="text-2xl font-bold text-gray-900">{totalPayees}</p>
          <p className="text-sm text-green-600 mt-1">{activePayees} active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Verified Payees</h3>
          <p className="text-2xl font-bold text-green-600">{verifiedPayees}</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalPayees > 0 ? Math.round((verifiedPayees / totalPayees) * 100) : 0}% of total
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
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Verification</h3>
          <p className="text-2xl font-bold text-yellow-600">{totalPayees - verifiedPayees}</p>
          <p className="text-sm text-gray-500 mt-1">Require review</p>
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
              placeholder="Search by payee name, user, or bank..."
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
            <option value="person">Person</option>
            <option value="business">Business</option>
            <option value="utility">Utility</option>
            <option value="government">Government</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </motion.div>

      {/* Payees Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredPayees.map((payee) => (
          <motion.div
            key={payee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-red-200/50 shadow-lg overflow-hidden"
          >
            {/* Payee Header */}
            <div className={`bg-gradient-to-r ${getPayeeTypeColor(payee.payeeType)} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {getPayeeTypeIcon(payee.payeeType)}
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    payee.isVerified 
                      ? 'bg-white/20 text-white' 
                      : 'bg-yellow-500/20 text-yellow-100'
                  }`}>
                    {payee.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    payee.isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-500/20 text-red-100'
                  }`}>
                    {payee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{payee.name}</h3>
              <p className="text-white/80 text-sm capitalize">{payee.payeeType} Payee</p>
            </div>

            {/* Payee Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Holder</p>
                  <p className="font-semibold text-gray-900">{payee.userName}</p>
                  <p className="text-sm text-gray-500">{payee.userEmail}</p>
                </div>
              </div>

              {payee.bankName && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Bank Information</p>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{payee.bankName}</span>
                  </div>
                </div>
              )}

              {(payee.accountNumber || payee.routingNumber) && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Account Details</p>
                  {payee.accountNumber && (
                    <div className="flex items-center space-x-2 mb-1">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 font-mono">****{payee.accountNumber.slice(-4)}</span>
                    </div>
                  )}
                  {payee.routingNumber && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Routing: {payee.routingNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {(payee.phone || payee.email) && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Contact Information</p>
                  {payee.phone && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{payee.phone}</span>
                    </div>
                  )}
                  {payee.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{payee.email}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Created: {formatDate(payee.createdAt)}</span>
              </div>

              <button
                onClick={() => handleEditPayee(payee)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Payee</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPayees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payees found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Edit Payee Modal */}
      <AnimatePresence>
        {showEditModal && selectedPayee && (
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
                <h2 className="text-2xl font-bold text-gray-900">Edit Payee</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getPayeeTypeColor(selectedPayee.payeeType)} rounded-lg flex items-center justify-center text-white`}>
                    {getPayeeTypeIcon(selectedPayee.payeeType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPayee.name}</h3>
                    <p className="text-sm text-gray-500">{selectedPayee.userName}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdatePayee} className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Verification Status
                    </label>
                    <p className="text-sm text-gray-500">Mark this payee as verified</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={payeeUpdate.isVerified}
                    onChange={(e) => setPayeeUpdate(prev => ({ 
                      ...prev, 
                      isVerified: e.target.checked 
                    }))}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Active Status
                    </label>
                    <p className="text-sm text-gray-500">Enable or disable this payee</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={payeeUpdate.isActive}
                    onChange={(e) => setPayeeUpdate(prev => ({ 
                      ...prev, 
                      isActive: e.target.checked 
                    }))}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
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
                        <span>Update Payee</span>
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