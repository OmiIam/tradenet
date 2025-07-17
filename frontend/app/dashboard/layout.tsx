'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  ArrowLeftRight, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  PieChart,
  Shield,
  Bell,
  User,
  Building,
  Calculator,
  FileText,
  HelpCircle
} from 'lucide-react';
import { AuthUser } from '@/types';
import { authApi } from '@/lib/api/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'accounts',
      label: 'Accounts',
      href: '/dashboard/accounts',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'transactions',
      label: 'Transactions',
      href: '/dashboard/transactions',
      icon: <ArrowLeftRight className="w-5 h-5" />
    },
    {
      id: 'transfers',
      label: 'Transfer Money',
      href: '/dashboard/transfers',
      icon: <ArrowLeftRight className="w-5 h-5" />
    },
    {
      id: 'payees',
      label: 'Payees',
      href: '/dashboard/payees',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <PieChart className="w-5 h-5" />
    },
    {
      id: 'statements',
      label: 'Statements',
      href: '/dashboard/statements',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      href: '/dashboard/admin',
      icon: <Shield className="w-5 h-5" />,
      adminOnly: true
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'help',
      label: 'Help & Support',
      href: '/dashboard/help',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authApi.me();
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      router.push('/login');
    }
  };

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (item.adminOnly && (!user || !user.isAdmin)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-banking-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-blue-200/50 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-blue-600" />
          </button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-banking-deepBlue to-banking-accent rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-banking-deepBlue">Prime Edge</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 rounded-lg">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-banking-deepBlue">
              {user?.firstName}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 h-full bg-white/95 backdrop-blur-xl border-r border-blue-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent 
                items={filteredSidebarItems}
                user={user}
                pathname={pathname}
                onLogout={handleLogout}
                isMobile={true}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 h-screen bg-white/95 backdrop-blur-xl border-r border-blue-200/50 sticky top-0">
          <SidebarContent 
            items={filteredSidebarItems}
            user={user}
            pathname={pathname}
            onLogout={handleLogout}
            isMobile={false}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-0">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  items: SidebarItem[];
  user: AuthUser | null;
  pathname: string;
  onLogout: () => void;
  isMobile: boolean;
  onClose?: () => void;
}

function SidebarContent({ items, user, pathname, onLogout, isMobile, onClose }: SidebarContentProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-200/50">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3" onClick={onClose}>
            <div className="w-10 h-10 bg-gradient-to-r from-banking-deepBlue to-banking-accent rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-banking-deepBlue">Prime Edge</h1>
              <p className="text-sm text-blue-600">Banking</p>
            </div>
          </Link>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-blue-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-blue-600">{user?.email}</p>
            {user?.isAdmin && (
              <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full mt-1">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white shadow-lg'
                  : 'hover:bg-blue-100 text-gray-700 hover:text-blue-900'
                }
              `}
            >
              <span className={`
                ${isActive ? 'text-white' : 'text-blue-500 group-hover:text-blue-600'}
              `}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className={`
                  ml-auto text-xs px-2 py-1 rounded-full
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-banking-accent text-white'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-blue-200/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}