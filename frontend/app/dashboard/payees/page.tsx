'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Building,
  User,
  Zap,
  Shield,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';
import { Payee, CreatePayee } from '@/types';

export default function PayeesPage() {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayee, setEditingPayee] = useState<Payee | null>(null);
  const [newPayee, setNewPayee] = useState<CreatePayee>({
    name: '',
    payeeType: 'person'
  });

  useEffect(() => {
    fetchPayees();
  }, []);

  const fetchPayees = async () => {
    try {
      // Mock data for now - will be replaced with API call
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
          address: '123 Main St, New York, NY 10001',
          memo: 'College roommate',
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
          phone: '(800) 555-0123',
          email: 'billing@electricco.com',
          address: '456 Power St, New York, NY 10002',
          memo: 'Monthly electricity bill',
          isVerified: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 3,
          userId: 1,
          name: 'Sarah Johnson',
          accountNumber: '5555666677',
          routingNumber: '021000021',
          bankName: 'Wells Fargo',
          payeeType: 'person',
          phone: '(555) 987-6543',
          email: 'sarah.j@email.com',
          memo: 'Sister',
          isVerified: false,
          isActive: true,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z'
        },
        {
          id: 4,
          userId: 1,
          name: 'ABC Corporation',
          accountNumber: '1111222233',
          routingNumber: '021000021',
          bankName: 'Citibank',
          payeeType: 'business',
          phone: '(555) 444-5555',
          email: 'payments@abccorp.com',
          address: '789 Business Ave, New York, NY 10003',
          memo: 'Vendor payments',
          isVerified: true,
          isActive: true,
          createdAt: '2023-12-15T00:00:00Z',
          updatedAt: '2024-01-05T00:00:00Z'
        }
      ];

      setPayees(mockPayees);
    } catch (error) {
      console.error('Failed to fetch payees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      const newPayeeData = {
        id: Date.now(),
        userId: 1,
        ...newPayee,
        payeeType: newPayee.payeeType || 'person',
        isVerified: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setPayees(prev => [newPayeeData, ...prev]);
      setShowAddModal(false);
      setNewPayee({ name: '', payeeType: 'person' });
    } catch (error) {
      console.error('Failed to add payee:', error);
    }
  };

  const handleEditPayee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayee) return;

    try {
      // Simulate API call
      const updatedPayee = {
        ...editingPayee,
        updatedAt: new Date().toISOString()
      };

      setPayees(prev => prev.map(p => p.id === editingPayee.id ? updatedPayee : p));
      setEditingPayee(null);
    } catch (error) {
      console.error('Failed to update payee:', error);
    }
  };

  const handleDeletePayee = async (payeeId: number) => {
    if (!confirm('Are you sure you want to delete this payee?')) return;

    try {
      // Simulate API call
      setPayees(prev => prev.filter(p => p.id !== payeeId));
    } catch (error) {
      console.error('Failed to delete payee:', error);
    }
  };

  const filteredPayees = payees.filter(payee => {
    const matchesSearch = payee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payee.email && payee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (payee.bankName && payee.bankName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || payee.payeeType === filterType;
    
    return matchesSearch && matchesType;
  });

  const getPayeeIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-5 h-5" />;
      case 'business':
        return <Building className="w-5 h-5" />;
      case 'utility':
        return <Zap className="w-5 h-5" />;
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
        return 'from-blue-500 to-indigo-500';
      case 'government':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-20 bg-gray-200 rounded-xl mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Payees</h1>
          <p className="text-gray-600 mt-1">
            Manage your saved payees for quick transfers.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Add Payee
        </motion.button>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search payees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
          >
            <option value="all">All Types</option>
            <option value="person">People</option>
            <option value="business">Businesses</option>
            <option value="utility">Utilities</option>
            <option value="government">Government</option>
          </select>
        </div>
      </motion.div>

      {/* Payees Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPayees.map((payee) => (
          <motion.div
            key={payee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getPayeeTypeColor(payee.payeeType)} rounded-xl flex items-center justify-center text-white`}>
                {getPayeeIcon(payee.payeeType)}
              </div>
              <div className="flex items-center space-x-2">
                {payee.isVerified && (
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                )}
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{payee.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{payee.payeeType}</p>
              </div>

              {payee.bankName && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{payee.bankName}</span>
                </div>
              )}

              {payee.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{payee.email}</span>
                </div>
              )}

              {payee.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{payee.phone}</span>
                </div>
              )}

              {payee.memo && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">{payee.memo}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingPayee(payee)}
                  className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Edit3 className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePayee(payee.id)}
                  className="flex-1 bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPayees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payees found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Add your first payee to get started with quick transfers.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Your First Payee
            </button>
          )}
        </div>
      )}

      {/* Add Payee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Payee</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPayee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newPayee.name}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={newPayee.payeeType}
                    onChange={(e) => setNewPayee(prev => ({ 
                      ...prev, 
                      payeeType: e.target.value as 'person' | 'business' | 'utility' | 'government' 
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="person">Person</option>
                    <option value="business">Business</option>
                    <option value="utility">Utility</option>
                    <option value="government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={newPayee.accountNumber || ''}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={newPayee.routingNumber || ''}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, routingNumber: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={newPayee.bankName || ''}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, bankName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newPayee.email || ''}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newPayee.phone || ''}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memo
                  </label>
                  <textarea
                    value={newPayee.memo || ''}
                    onChange={(e) => setNewPayee(prev => ({ ...prev, memo: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Optional note about this payee"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Add Payee
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Payee Modal */}
      <AnimatePresence>
        {editingPayee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingPayee(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Payee</h2>
                <button
                  onClick={() => setEditingPayee(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditPayee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editingPayee.name}
                    onChange={(e) => setEditingPayee(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingPayee.email || ''}
                    onChange={(e) => setEditingPayee(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingPayee.phone || ''}
                    onChange={(e) => setEditingPayee(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memo
                  </label>
                  <textarea
                    value={editingPayee.memo || ''}
                    onChange={(e) => setEditingPayee(prev => prev ? ({ ...prev, memo: e.target.value }) : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingPayee(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Save Changes
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