'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Banknote,
  Calculator,
  Globe,
  Heart,
  FileText,
  BarChart3,
  Zap,
  Lock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { AccountType, LoanProduct, Service } from '@/types';

const BusinessPage = () => {
  const businessAccounts = [
    {
      id: 'business-checking',
      name: 'Business Checking',
      description: 'Flexible checking account designed for small to medium businesses.',
      icon: <Building2 className="w-8 h-8" />,
      features: [
        '200 free monthly transactions',
        'Online banking and bill pay',
        'Mobile check deposits',
        'Overdraft protection',
        'Dedicated business support'
      ],
      minimumBalance: '$500',
      monthlyFee: '$15 (waived with minimum balance)'
    },
    {
      id: 'business-savings',
      name: 'Business Savings',
      description: 'Earn competitive interest on your business reserves.',
      icon: <DollarSign className="w-8 h-8" />,
      features: [
        'Competitive interest rates',
        'No minimum balance requirement',
        'Automatic transfers',
        'Quarterly statements',
        'FDIC insured up to $250,000'
      ],
      minimumBalance: '$100',
      interestRate: '3.75% APY'
    },
    {
      id: 'business-cd',
      name: 'Business Certificate of Deposit',
      description: 'Secure, fixed-rate investment for business funds.',
      icon: <Shield className="w-8 h-8" />,
      features: [
        'Fixed interest rates',
        'Terms from 6 months to 5 years',
        'Penalty-free early withdrawal options',
        'Automatic renewal',
        'Jumbo CD rates for large deposits'
      ],
      minimumBalance: '$10,000',
      interestRate: '5.25% APY'
    }
  ];

  const businessLoans = [
    {
      id: 'business-loan',
      name: 'Business Term Loans',
      description: 'Flexible financing for equipment, expansion, or working capital.',
      icon: <Banknote className="w-8 h-8" />,
      features: [
        'Up to $500,000 funding',
        'Competitive interest rates',
        'No prepayment penalties',
        'Fast approval process',
        'Flexible repayment terms'
      ],
      interestRate: 'Starting at 7.25%',
      terms: ['1-year', '3-year', '5-year', '7-year'],
      requirements: ['2+ years in business', 'Good credit score', 'Financial statements']
    },
    {
      id: 'line-of-credit',
      name: 'Business Line of Credit',
      description: 'Access funds when you need them with flexible credit line.',
      icon: <CreditCard className="w-8 h-8" />,
      features: [
        'Up to $250,000 credit line',
        'Interest only on funds used',
        'Renewable annually',
        'Online access and management',
        'No application fees'
      ],
      interestRate: 'Starting at 8.50%',
      terms: ['Revolving credit', 'Annual renewal', 'Interest-only payments'],
      requirements: ['Established business', 'Good credit history', 'Regular cash flow']
    },
    {
      id: 'commercial-mortgage',
      name: 'Commercial Real Estate',
      description: 'Financing for commercial property purchase or refinancing.',
      icon: <Building2 className="w-8 h-8" />,
      features: [
        'Up to $5 million funding',
        'Competitive fixed rates',
        'Owner-occupied and investment properties',
        'Up to 80% financing',
        'Local decision making'
      ],
      interestRate: 'Starting at 7.75%',
      terms: ['10-year', '15-year', '20-year', '25-year'],
      requirements: ['20% down payment', 'Strong financials', 'Property appraisal']
    }
  ];

  const businessServices = [
    {
      id: 'treasury',
      title: 'Treasury Management',
      description: 'Comprehensive cash management solutions for efficient business operations.',
      icon: <Calculator className="w-8 h-8" />,
      features: [
        'Cash flow optimization',
        'Automated clearing house (ACH)',
        'Wire transfers',
        'Account reconciliation',
        'Fraud prevention tools'
      ]
    },
    {
      id: 'merchant',
      title: 'Merchant Services',
      description: 'Accept payments seamlessly with our merchant processing solutions.',
      icon: <CreditCard className="w-8 h-8" />,
      features: [
        'Credit and debit card processing',
        'Point-of-sale systems',
        'Online payment solutions',
        'Mobile payment options',
        'Competitive processing rates'
      ]
    },
    {
      id: 'payroll',
      title: 'Payroll Services',
      description: 'Streamline your payroll process with automated solutions.',
      icon: <Users className="w-8 h-8" />,
      features: [
        'Automated payroll processing',
        'Direct deposit',
        'Tax filing and compliance',
        'Employee self-service portal',
        'Time and attendance tracking'
      ]
    },
    {
      id: 'international',
      title: 'International Banking',
      description: 'Global banking solutions for international business operations.',
      icon: <Globe className="w-8 h-8" />,
      features: [
        'Foreign exchange services',
        'International wire transfers',
        'Trade finance solutions',
        'Letters of credit',
        'Multi-currency accounts'
      ]
    }
  ];

  const businessCards = [
    {
      id: 'business-cash',
      name: 'Business Cashback Card',
      description: 'Earn cashback on business expenses with no annual fee.',
      icon: <CreditCard className="w-8 h-8" />,
      features: [
        '2% cashback on gas and office supplies',
        '1% cashback on all other purchases',
        'No annual fee',
        'Employee cards at no additional cost',
        'Expense management tools'
      ],
      rewards: '2% Cashback',
      annualFee: '$0',
      aprRange: '16.99% - 24.99%'
    },
    {
      id: 'business-rewards',
      name: 'Business Rewards Card',
      description: 'Flexible rewards program tailored for business spending.',
      icon: <TrendingUp className="w-8 h-8" />,
      features: [
        '3x points on advertising and shipping',
        '2x points on travel and dining',
        '1x points on all other purchases',
        'Bonus categories rotate quarterly',
        'Travel insurance and protection'
      ],
      rewards: '3x Points',
      annualFee: '$125',
      aprRange: '15.99% - 22.99%'
    }
  ];

  return (
    <div className="min-h-screen bg-banking-warm">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 gradient-banking text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Business Banking
              <span className="block text-blue-200">Solutions</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Comprehensive banking services and financial solutions designed to help your business 
              grow and succeed in today's competitive market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-banking-navy font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Open Business Account</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-banking-navy transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Speak to Business Advisor
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Accounts Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-banking-navy mb-6">
              Business Accounts
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Banking solutions tailored to meet the unique needs of your business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-banking-accent/20 transition-colors duration-300">
                  <div className="text-banking-accent">
                    {account.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-banking-navy mb-4">
                  {account.name}
                </h3>
                <p className="text-banking-slate mb-6">
                  {account.description}
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium text-banking-slate">Minimum Balance:</span>
                    <span className="font-bold text-banking-navy">{account.minimumBalance}</span>
                  </div>
                  {account.interestRate && (
                    <div className="flex justify-between">
                      <span className="font-medium text-banking-slate">Interest Rate:</span>
                      <span className="font-bold text-banking-accent">{account.interestRate}</span>
                    </div>
                  )}
                  {account.monthlyFee && (
                    <div className="flex justify-between">
                      <span className="font-medium text-banking-slate">Monthly Fee:</span>
                      <span className="font-bold text-banking-navy text-sm">{account.monthlyFee}</span>
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {account.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-banking-success" />
                      <span className="text-banking-slate">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className="w-full btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Open Account
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Loans Section */}
      <section className="py-20 bg-gradient-banking-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-banking-navy mb-6">
              Business Lending
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Flexible financing solutions to fuel your business growth and expansion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessLoans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6">
                  <div className="text-banking-accent">
                    {loan.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-banking-navy mb-4">
                  {loan.name}
                </h3>
                <p className="text-banking-slate mb-6">
                  {loan.description}
                </p>
                
                <div className="mb-6">
                  <div className="text-sm text-banking-slate">Interest Rate</div>
                  <div className="text-2xl font-bold text-banking-accent">{loan.interestRate}</div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-banking-navy mb-2">Available Terms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {loan.terms.map((term, idx) => (
                        <span key={idx} className="bg-banking-accent/10 text-banking-accent px-3 py-1 rounded-full text-sm">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-banking-navy mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {loan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-banking-success" />
                          <span className="text-banking-slate text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <motion.button
                  className="w-full btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-banking-navy mb-6">
              Business Services
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Comprehensive business solutions to streamline operations and enhance efficiency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-banking-accent/20 transition-colors duration-300">
                  <div className="text-banking-accent">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-banking-navy mb-4">
                  {service.title}
                </h3>
                <p className="text-banking-slate mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-banking-accent rounded-full" />
                      <span className="text-banking-slate text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className="w-full bg-banking-accent/10 text-banking-accent font-semibold py-3 px-6 rounded-lg hover:bg-banking-accent hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Credit Cards Section */}
      <section className="py-20 bg-gradient-banking-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-banking-navy mb-6">
              Business Credit Cards
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Flexible credit solutions with rewards and benefits designed for business expenses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {businessCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-banking-accent/10 p-4 rounded-2xl">
                    <div className="text-banking-accent">
                      {card.icon}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-banking-accent">{card.rewards}</div>
                    <div className="text-sm text-banking-slate">Rewards</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-banking-navy mb-4">
                  {card.name}
                </h3>
                <p className="text-banking-slate mb-6">
                  {card.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-banking-slate">Annual Fee</div>
                    <div className="font-bold text-banking-navy">{card.annualFee}</div>
                  </div>
                  <div>
                    <div className="text-sm text-banking-slate">APR Range</div>
                    <div className="font-bold text-banking-navy">{card.aprRange}</div>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-banking-success" />
                      <span className="text-banking-slate text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className="w-full btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 gradient-banking text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Why Choose Prime Edge Business Banking?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Partner with a bank that understands your business needs and provides 
              the tools and support to help you succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Dedicated Relationship Manager',
                description: 'Personal support from experienced business banking professionals'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Fast Decision Making',
                description: 'Local decision-making authority for quicker loan approvals'
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Business Intelligence',
                description: 'Advanced reporting and analytics to track your business performance'
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: 'Enterprise Security',
                description: 'Bank-grade security with fraud monitoring and prevention'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/20 p-4 rounded-2xl w-fit mx-auto mb-6">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-blue-100">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <motion.button
              className="bg-white text-banking-navy font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Schedule Business Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessPage;