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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Enhanced Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #3b82f6 50%, #6366f1 75%, #8b5cf6 100%)',
          backgroundSize: '400% 400%'
        }}
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.3),transparent_50%)]"></div>
      </div>
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl z-0"
        animate={{ 
          y: [0, 40, 0], 
          x: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[32rem] h-[32rem] rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl z-0"
        animate={{ 
          y: [0, -30, 0], 
          x: [0, -40, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-[60%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-2xl z-0"
        animate={{ 
          y: [0, 20, 0], 
          x: [0, -20, 0],
          rotate: [0, 360]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full z-0"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-blue-300/30 rounded-full z-0"
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Enhanced Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block text-white"
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Logo size="lg" variant="light" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Secure Banking
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-100 text-glow">at Your Fingertips</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Access your accounts safely and securely with our{' '}
              <span className="font-semibold text-white">advanced authentication system</span>.
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
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                    <div className="text-white group-hover:text-blue-200 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{feature.text}</h3>
                    <p className="text-blue-200 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="card-banking p-8 shadow-2xl">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-8 text-center">
                <Logo size="md" variant="dark" />
              </div>

              {/* Login Type Toggle */}
              <div className="mb-8">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLoginType('personal')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === 'personal'
                        ? 'bg-white text-banking-navy shadow-sm'
                        : 'text-banking-slate hover:text-banking-navy'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('business')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === 'business'
                        ? 'bg-white text-banking-navy shadow-sm'
                        : 'text-banking-slate hover:text-banking-navy'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Business
                  </button>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-banking-navy mb-2">
                Welcome Back
              </h2>
              <p className="text-banking-slate mb-8">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-banking-navy mb-2">
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent transition-all duration-200 ${
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
                  <label htmlFor="password" className="block text-sm font-medium text-banking-navy mb-2">
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
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent transition-all duration-200 ${
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
                    <span className="ml-2 text-sm text-banking-slate">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-banking-accent hover:text-banking-deepBlue">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
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

              {/* Biometric Login */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center mb-4">
                  <span className="text-sm text-banking-slate">Or sign in with</span>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <motion.button
                    className="flex items-center space-x-2 bg-banking-accent/10 text-banking-accent px-4 py-2 rounded-lg hover:bg-banking-accent hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Fingerprint className="w-5 h-5" />
                    <span>Touch ID</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center space-x-2 bg-banking-accent/10 text-banking-accent px-4 py-2 rounded-lg hover:bg-banking-accent hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Face ID</span>
                  </motion.button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <span className="text-banking-slate">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-banking-accent hover:text-banking-deepBlue font-medium">
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
                <p className="text-sm text-banking-slate mb-2">Need help signing in?</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <Link href="/help" className="text-banking-accent hover:text-banking-deepBlue">Contact Support</Link>
                  <Link href="/help/login" className="text-banking-accent hover:text-banking-deepBlue">Login Help</Link>
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