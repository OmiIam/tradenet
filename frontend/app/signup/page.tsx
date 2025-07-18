'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Account Information
  accountType: 'personal' | 'business';
  initialDeposit: string;
  password: string;
  confirmPassword: string;
  
  // Business Information (if applicable)
  businessName?: string;
  businessType?: string;
  taxId?: string;
  
  // Agreements
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    accountType: 'personal',
    initialDeposit: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    taxId: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false
  });

  const steps = [
    { number: 1, title: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { number: 2, title: 'Address', icon: <MapPin className="w-5 h-5" /> },
    { number: 3, title: 'Account Setup', icon: <CreditCard className="w-5 h-5" /> },
    { number: 4, title: 'Verification', icon: <Shield className="w-5 h-5" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
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

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
        
      case 2:
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        break;
        
      case 3:
        if (!formData.initialDeposit) newErrors.initialDeposit = 'Initial deposit is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        
        if (formData.accountType === 'business') {
          if (!formData.businessName) newErrors.businessName = 'Business name is required';
          if (!formData.businessType) newErrors.businessType = 'Business type is required';
          if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
        }
        break;
        
      case 4:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setIsLoading(true);
      try {
        // TODO: Implement actual registration API call
        console.log('Form submitted:', formData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        // For now, just show success message
        alert('Account created successfully! Please check your email for verification.');
      } catch (error) {
        console.error('Registration failed:', error);
        setErrors({ general: 'Registration failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-banking-navy mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-banking-navy mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-banking-navy mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-banking-navy mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg text-banking-slate focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  {/* Add more states as needed */}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="accountType"
                    value="personal"
                    checked={formData.accountType === 'personal'}
                    onChange={handleInputChange}
                    className="text-banking-accent"
                  />
                  <User className="w-5 h-5 text-banking-slate" />
                  <span>Personal</span>
                </label>
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="accountType"
                    value="business"
                    checked={formData.accountType === 'business'}
                    onChange={handleInputChange}
                    className="text-banking-accent"
                  />
                  <Building2 className="w-5 h-5 text-banking-slate" />
                  <span>Business</span>
                </label>
              </div>
            </div>

            {formData.accountType === 'business' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-banking-navy mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                      errors.businessName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-banking-navy mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                      errors.businessType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Business Type</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="partnership">Partnership</option>
                    <option value="sole-proprietorship">Sole Proprietorship</option>
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-banking-navy mb-2">
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                      errors.taxId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.taxId && (
                    <p className="mt-1 text-sm text-red-500">{errors.taxId}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Initial Deposit
              </label>
              <input
                type="number"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                  errors.initialDeposit ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100.00"
                min="100"
              />
              {errors.initialDeposit && (
                <p className="mt-1 text-sm text-red-500">{errors.initialDeposit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-banking-slate"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-banking-navy mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-banking-slate"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-banking-navy mb-2">
                Review and Confirm
              </h3>
              <p className="text-banking-slate">
                Please review your information and accept the terms to complete your registration.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-banking-slate">Name:</span>
                  <p className="font-medium text-banking-navy">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-sm text-banking-slate">Email:</span>
                  <p className="font-medium text-banking-navy">{formData.email}</p>
                </div>
                <div>
                  <span className="text-sm text-banking-slate">Account Type:</span>
                  <p className="font-medium text-banking-navy capitalize">{formData.accountType}</p>
                </div>
                <div>
                  <span className="text-sm text-banking-slate">Initial Deposit:</span>
                  <p className="font-medium text-banking-navy">${formData.initialDeposit}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-banking-accent border-gray-300 rounded focus:ring-banking-accent mt-1"
                />
                <span className="text-sm text-banking-slate">
                  I agree to the <Link href="/terms" className="text-banking-accent hover:underline">Terms and Conditions</Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-sm text-red-500">{errors.termsAccepted}</p>
              )}

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-banking-accent border-gray-300 rounded focus:ring-banking-accent mt-1"
                />
                <span className="text-sm text-banking-slate">
                  I agree to the <Link href="/privacy" className="text-banking-accent hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.privacyAccepted && (
                <p className="text-sm text-red-500">{errors.privacyAccepted}</p>
              )}

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="marketingAccepted"
                  checked={formData.marketingAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-banking-accent border-gray-300 rounded focus:ring-banking-accent mt-1"
                />
                <span className="text-sm text-banking-slate">
                  I would like to receive marketing communications and updates (optional)
                </span>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
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

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Logo size="md" variant="light" />
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">
            Create Your Account
          </h1>
          <p className="text-blue-200">
            Join Prime Edge Banking and start your journey to financial success
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.number
                      ? 'bg-banking-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step.number ? 'text-banking-navy' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-banking-accent' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card-banking p-8 max-w-2xl mx-auto">
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
          
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-banking-slate hover:bg-gray-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </motion.button>
                )}
              </div>

              <div>
                {currentStep < steps.length ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <span className="text-blue-200">Already have an account? </span>
            <Link href="/login" className="text-blue-300 hover:text-white font-medium">
              Sign in here
            </Link>
          </div>

          {/* Help & Support */}
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-200 mb-2">Need assistance?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/help" className="text-blue-300 hover:text-white">Contact Support</Link>
              <Link href="/help/signup" className="text-blue-300 hover:text-white">Signup Help</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;