'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Fingerprint, 
  Smartphone, 
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { authApi } from '@/lib/api/auth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loginType, setLoginType] = useState<'personal' | 'business'>('personal');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const data = await authApi.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (data.success) {
        // Successful login - redirect to dashboard
        if (data.user.isAdmin) {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrors({
          general: 'Login failed. Please check your credentials.'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Simplified Background */}
      <div className="absolute inset-0 gradient-minimal" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          
          {/* Left Column - Enhanced Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block text-gray-900"
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Logo size="lg" variant="dark" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Secure Banking
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">at Your Fingertips</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Access your accounts safely and securely with our{' '}
              <span className="font-semibold text-gray-900">advanced authentication system</span>.
            </motion.p>
            
            <div className="space-y-6">
              {[
                { icon: <Shield className="w-6 h-6" />, text: 'Bank-grade security', desc: 'Military-grade encryption' },
                { icon: <Fingerprint className="w-6 h-6" />, text: 'Biometric authentication', desc: 'Touch ID & Face ID support' },
                { icon: <Lock className="w-6 h-6" />, text: 'Multi-factor protection', desc: 'Advanced security layers' },
                { icon: <Smartphone className="w-6 h-6" />, text: 'Mobile-first design', desc: 'Optimized for all devices' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 border border-blue-200">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-bold text-lg mb-1">{feature.text}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl minimal-hover">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-6 text-center">
                <Logo size="sm" variant="dark" />
              </div>

              {/* Login Type Toggle */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg p-1 border border-gray-300 gap-1 sm:gap-0">
                  <button
                    type="button"
                    onClick={() => setLoginType('personal')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === 'personal'
                        ? 'bg-white text-banking-navy shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('business')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === 'business'
                        ? 'bg-white text-banking-navy shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Business
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Sign in to your {loginType} banking account
              </p>

              {/* General Error Message */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{errors.general}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-banking-slate w-5 h-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 sm:py-4 border rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </motion.div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-banking-slate w-5 h-5" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 sm:py-4 border rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:border-transparent transition-all duration-200 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-banking-slate hover:text-banking-navy"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </motion.div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-banking-accent border-gray-300 rounded focus:ring-banking-accent"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 sm:py-4 text-base sm:text-lg font-medium"
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>


              {/* Sign Up Link */}
              <div className="mt-6 sm:mt-8 text-center">
                <span className="text-gray-600 text-sm sm:text-base">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                  Sign up here
                </Link>
              </div>


              {/* Security Notice */}
              <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Secure Connection</p>
                    <p className="text-xs text-green-700">Your data is protected with 256-bit SSL encryption</p>
                  </div>
                </div>
              </div>

              {/* Help & Support */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Need help signing in?</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <Link href="/help" className="text-blue-600 hover:text-blue-700">Contact Support</Link>
                  <Link href="/help/login" className="text-blue-600 hover:text-blue-700">Login Help</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;