'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  CreditCard, 
  ArrowLeftRight, 
  UserCheck,
  FileText,
  Settings,
  BarChart3,
  AlertTriangle,
  Activity,
  Database,
  Lock
} from 'lucide-react';
import { AuthUser } from '@/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const adminNavItems: AdminNavItem[] = [
    {
      id: 'overview',
      label: 'Admin Overview',
      href: '/dashboard/admin',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'System overview and key metrics'
    },
    {
      id: 'users',
      label: 'User Management',
      href: '/dashboard/admin/users',
      icon: <Users className="w-5 h-5" />,
      description: 'Manage user accounts and permissions'
    },
    {
      id: 'accounts',
      label: 'Account Management',
      href: '/dashboard/admin/accounts',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'View and edit account balances'
    },
    {
      id: 'transactions',
      label: 'Transaction Management',
      href: '/dashboard/admin/transactions',
      icon: <ArrowLeftRight className="w-5 h-5" />,
      description: 'Monitor and edit transactions'
    },
    {
      id: 'payees',
      label: 'Payee Management',
      href: '/dashboard/admin/payees',
      icon: <UserCheck className="w-5 h-5" />,
      description: 'Manage payee information'
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      href: '/dashboard/admin/audit',
      icon: <FileText className="w-5 h-5" />,
      description: 'View system audit trails'
    },
    {
      id: 'security',
      label: 'Security',
      href: '/dashboard/admin/security',
      icon: <Lock className="w-5 h-5" />,
      description: 'Security settings and monitoring'
    },
    {
      id: 'system',
      label: 'System Settings',
      href: '/dashboard/admin/system',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configure system parameters'
    }
  ];

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.isAdmin) {
          setUser(data.user);
        } else {
          // Not an admin, redirect to dashboard
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-red-100">Prime Edge Banking Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-red-100">System Administrator</p>
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-80 bg-white/95 backdrop-blur-xl border-r border-red-200/50 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      block p-4 rounded-xl transition-all duration-200 group
                      ${isActive
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'hover:bg-red-50 text-gray-700 hover:text-red-900'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`
                        ${isActive ? 'text-white' : 'text-red-500 group-hover:text-red-600'}
                      `}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <p className={`text-sm ml-8 ${
                      isActive ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="p-6 border-t border-red-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-bold text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Accounts</span>
                <span className="text-sm font-bold text-gray-900">2,891</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Actions</span>
                <span className="text-sm font-bold text-orange-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}