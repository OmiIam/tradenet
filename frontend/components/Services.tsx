'use client';

import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Send, 
  PiggyBank, 
  TrendingUp, 
  Smartphone, 
  Shield,
  ArrowRight,
  Clock,
  Globe
} from 'lucide-react';
import { Service } from '@/types';

const Services = () => {
  const services: Service[] = [
    {
      id: 'accounts',
      title: 'Account Management',
      description: 'Comprehensive account oversight with real-time balance tracking and transaction history.',
      icon: <CreditCard className="w-8 h-8" />,
      features: [
        'Multiple account types',
        'Real-time balance updates',
        'Transaction categorization',
        'Spending analytics'
      ]
    },
    {
      id: 'transfers',
      title: 'Fund Transfers',
      description: 'Instant money transfers with advanced security and global reach.',
      icon: <Send className="w-8 h-8" />,
      features: [
        'Instant transfers',
        'International payments',
        'Scheduled transfers',
        'Multi-currency support'
      ]
    },
    {
      id: 'savings',
      title: 'Savings Plans',
      description: 'Automated savings with competitive interest rates and flexible terms.',
      icon: <PiggyBank className="w-8 h-8" />,
      features: [
        'Goal-based savings',
        'Automated deposits',
        'High-yield accounts',
        'Flexible withdrawals'
      ]
    },
    {
      id: 'investments',
      title: 'Investment Portal',
      description: 'Smart investment tools with portfolio management and market insights.',
      icon: <TrendingUp className="w-8 h-8" />,
      features: [
        'Portfolio tracking',
        'Market analysis',
        'Risk assessment',
        'Expert recommendations'
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile Banking',
      description: 'Full-featured mobile app with biometric security and offline capabilities.',
      icon: <Smartphone className="w-8 h-8" />,
      features: [
        'Biometric login',
        'Offline access',
        'Push notifications',
        'Mobile deposits'
      ]
    },
    {
      id: 'security',
      title: 'Advanced Security',
      description: 'Bank-grade security with multi-factor authentication and fraud protection.',
      icon: <Shield className="w-8 h-8" />,
      features: [
        'Multi-factor auth',
        'Fraud detection',
        'Data encryption',
        '24/7 monitoring'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-banking-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-banking-navy mb-6">
            Comprehensive Banking
            <span className="block text-banking-accent">Services</span>
          </h2>
          <p className="text-xl text-banking-slate max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage your finances efficiently and securely, 
            all in one integrated platform designed for modern banking.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group"
            >
              <div className="card-banking p-8 h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon */}
                <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-banking-accent/20 transition-colors duration-300">
                  <div className="text-banking-accent group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-banking-navy mb-4">
                  {service.title}
                </h3>
                <p className="text-banking-slate mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-banking-accent rounded-full" />
                      <span className="text-banking-slate">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  className="w-full bg-banking-accent/10 text-banking-accent font-semibold py-3 px-6 rounded-lg hover:bg-banking-accent hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-banking-navy mb-6">
              Why Choose Prime Edge Banking?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-banking-accent/10 p-4 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-banking-accent" />
                </div>
                <h4 className="font-semibold text-banking-navy mb-2">24/7 Support</h4>
                <p className="text-banking-slate text-sm">
                  Round-the-clock customer service and technical support
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-banking-accent/10 p-4 rounded-full mb-4">
                  <Globe className="w-8 h-8 text-banking-accent" />
                </div>
                <h4 className="font-semibold text-banking-navy mb-2">Global Access</h4>
                <p className="text-banking-slate text-sm">
                  Access your accounts from anywhere in the world
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-banking-accent/10 p-4 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-banking-accent" />
                </div>
                <h4 className="font-semibold text-banking-navy mb-2">Bank-Grade Security</h4>
                <p className="text-banking-slate text-sm">
                  Advanced encryption and fraud protection systems
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;