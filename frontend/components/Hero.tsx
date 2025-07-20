'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users, CheckCircle, Star, TrendingUp, Lock, Smartphone } from 'lucide-react';
import { BankingStats } from '@/types';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const stats: BankingStats = {
    customers: '2M+',
    transactions: '$50B+',
    security: '99.9%',
    uptime: '24/7'
  };

  const router = useRouter();

  const features = [
    {
      icon: <Lock className="w-5 h-5" />,
      text: 'Bank-level security',
      description: 'Military-grade encryption'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: 'Instant transfers',
      description: 'Lightning fast payments'
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      text: 'Mobile-first design',
      description: 'Optimized for all devices'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: 'Real-time notifications',
      description: 'Stay informed instantly'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Professional Light Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
          backgroundSize: '400% 400%'
        }}
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Professional Light Accents */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-slate-100/50 to-gray-100/50"></div>
      </div>
      
      {/* Subtle Floating Elements */}
      <motion.div
        className="absolute top-[-5%] left-[-5%] w-64 h-64 rounded-full bg-gradient-to-r from-blue-50/30 to-slate-50/30 blur-3xl z-0"
        animate={{ 
          y: [0, 20, 0], 
          x: [0, 15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-gradient-to-r from-gray-50/30 to-blue-50/30 blur-3xl z-0"
        animate={{ 
          y: [0, -15, 0], 
          x: [0, -20, 0],
          scale: [1, 0.95, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Professional Accent Dots */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full z-0"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-slate-400/30 rounded-full z-0"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-200/50 shadow-sm"
            >
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-800">Rated #1 Digital Bank 2024</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="overflow-visible"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Banking at the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-2">
                  Prime Edge
                </span>
              </motion.h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed font-light max-w-2xl lg:max-w-none"
            >
              Experience the future of banking with our{' '}
              <span className="font-semibold text-gray-900">award-winning digital platform</span>. 
              Manage finances, transfer funds, and grow your wealth with cutting-edge technology.
            </motion.p>
            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center group-hover:bg-blue-200/80 transition-all duration-300 backdrop-blur-sm border border-blue-200/50">
                      <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold mb-1">{feature.text}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-white to-blue-50 text-banking-navy font-bold py-4 px-8 rounded-xl hover:from-blue-50 hover:to-white transition-all duration-300 flex items-center justify-center space-x-2 group shadow-2xl hover:shadow-white/20"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px -10px rgba(255,255,255,0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Banking Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => router.push('/about')}
                className="border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-8 text-blue-200"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">FDIC Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
            </motion.div>
          </div>
          {/* Right Column - Enhanced Stats Card */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative max-w-sm sm:max-w-md w-full"
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              
              {/* Main card */}
              <div className="relative bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-3 sm:p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Trusted by Millions
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Join the digital banking revolution
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                      {stats.customers}
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm font-medium">Active Users</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">
                      {stats.transactions}
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm font-medium">Processed</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                      {stats.security}
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm font-medium">Secure</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                      {stats.uptime}
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm font-medium">Available</div>
                  </motion.div>
                </div>
                
                {/* Additional visual element */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-blue-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Live data updated every second</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;