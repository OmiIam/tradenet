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
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { authApi } from '@/lib/api/auth';

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
  const router = useRouter();
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
        const registrationData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          accountType: formData.accountType
        };

        const response = await authApi.register(registrationData);
        
        // Store access token if provided (for immediate login)
        if (response.user && typeof window !== 'undefined') {
          // Registration was successful, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Registration failed:', error);
        setErrors({ 
          general: error.message || 'Registration failed. Please try again.' 
        });
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
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                    errors.firstName ? 'border-red-500' : 'border-white/30'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                    errors.lastName ? 'border-red-500' : 'border-white/30'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                  errors.email ? 'border-red-500' : 'border-white/30'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                  errors.phone ? 'border-red-500' : 'border-white/30'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-white/30'
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
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                  errors.address ? 'border-red-500' : 'border-white/30'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                    errors.city ? 'border-red-500' : 'border-white/30'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg text-banking-slate focus:outline-none focus:ring-2 focus:ring-banking-accent ${
                    errors.state ? 'border-red-500' : 'border-white/30'
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
              <label className="block text-sm font-medium text-white mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                  errors.zipCode ? 'border-red-500' : 'border-white/30'
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
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-white mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                      errors.businessName ? 'border-red-500' : 'border-white/30'
                    }`}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                      errors.businessType ? 'border-red-500' : 'border-white/30'
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
                  <label className="block text-sm font-medium text-white mb-2">
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                      errors.taxId ? 'border-red-500' : 'border-white/30'
                    }`}
                  />
                  {errors.taxId && (
                    <p className="mt-1 text-sm text-red-500">{errors.taxId}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Initial Deposit
              </label>
              <input
                type="number"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                  errors.initialDeposit ? 'border-red-500' : 'border-white/30'
                }`}
                placeholder="100.00"
                min="100"
              />
              {errors.initialDeposit && (
                <p className="mt-1 text-sm text-red-500">{errors.initialDeposit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                    errors.password ? 'border-red-500' : 'border-white/30'
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
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white/90 text-banking-slate placeholder:text-banking-slate/60 focus:outline-none focus:ring-2 focus:ring-banking-accent focus:bg-white ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/30'
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
            className="space-y-4 sm:space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Review and Confirm
              </h3>
              <p className="text-blue-200">
                Please review your information and accept the terms to complete your registration.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-blue-200">Name:</span>
                  <p className="font-medium text-white">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-200">Email:</span>
                  <p className="font-medium text-white">{formData.email}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-200">Account Type:</span>
                  <p className="font-medium text-white capitalize">{formData.accountType}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-200">Initial Deposit:</span>
                  <p className="font-medium text-white">${formData.initialDeposit}</p>
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
                  className="w-4 h-4 text-banking-accent border-white/30 rounded focus:ring-banking-accent mt-1"
                />
                <span className="text-sm text-blue-200">
                  I agree to the <Link href="/terms" className="text-blue-300 hover:text-white hover:underline">Terms and Conditions</Link>
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
                  className="w-4 h-4 text-banking-accent border-white/30 rounded focus:ring-banking-accent mt-1"
                />
                <span className="text-sm text-blue-200">
                  I agree to the <Link href="/privacy" className="text-blue-300 hover:text-white hover:underline">Privacy Policy</Link>
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
                  className="w-4 h-4 text-banking-accent border-white/30 rounded focus:ring-banking-accent mt-1"
                />
                <span className="text-sm text-blue-200">
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
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Simplified Background */}
      <div className="absolute inset-0 gradient-minimal" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-6 lg:mb-8">
          <Logo size="sm" variant="light" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-4 lg:mt-6 mb-2">
            Create Your Account
          </h1>
          <p className="text-blue-200 text-sm sm:text-base">
            Join Prime Edge Banking and start your journey to financial success
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 lg:mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                    currentStep >= step.number
                      ? 'bg-banking-accent text-white'
                      : 'bg-white/20 text-blue-200'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-xs sm:text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <span className={`ml-1 sm:ml-2 text-xs sm:text-sm hidden sm:block ${
                    currentStep >= step.number ? 'text-white' : 'text-blue-200'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > step.number ? 'bg-banking-accent' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-4 sm:p-6 lg:p-8 max-w-full lg:max-w-2xl mx-auto rounded-2xl minimal-hover">
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
            <div className="flex justify-between mt-6 lg:mt-8 gap-4">
              <div>
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 glass-morphism rounded-xl text-white hover:bg-white/20 transition-colors duration-200 text-sm sm:text-base"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
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
                    className="flex items-center space-x-2 btn-primary px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base"
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
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
          <div className="mt-6 lg:mt-8 text-center">
            <span className="text-blue-200 text-sm sm:text-base">Already have an account? </span>
            <Link href="/login" className="text-blue-300 hover:text-white font-medium text-sm sm:text-base">
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