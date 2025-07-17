'use client';

import { motion } from 'framer-motion';
import { 
  Wallet, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  Home, 
  Car,
  ArrowRight,
  Shield,
  Smartphone,
  DollarSign,
  CheckCircle,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AccountType, LoanProduct, CreditCard as CreditCardType, InvestmentProduct } from '@/types';

const PersonalPage = () => {
  const accountTypes: AccountType[] = [
    {
      id: 'checking',
      name: 'Prime Checking',
      description: 'Everyday banking with no monthly fees and unlimited transactions.',
      icon: <Wallet className="w-8 h-8" />,
      features: [
        'No monthly maintenance fees',
        'Unlimited transactions',
        'Mobile check deposits',
        'ATM fee reimbursement',
        'Online and mobile banking'
      ],
      minimumBalance: '$100',
      interestRate: '0.05% APY'
    },
    {
      id: 'savings',
      name: 'High-Yield Savings',
      description: 'Grow your money with competitive interest rates and flexible access.',
      icon: <PiggyBank className="w-8 h-8" />,
      features: [
        'Competitive interest rates',
        'No minimum balance',
        'FDIC insured up to $250,000',
        'Automatic savings tools',
        'Goal-based saving'
      ],
      minimumBalance: '$0',
      interestRate: '4.25% APY'
    },
    {
      id: 'certificate',
      name: 'Certificates of Deposit',
      description: 'Secure your savings with guaranteed returns and flexible terms.',
      icon: <Shield className="w-8 h-8" />,
      features: [
        'Guaranteed returns',
        'Terms from 3 months to 5 years',
        'No fees or penalties',
        'Automatic renewal options',
        'FDIC insured'
      ],
      minimumBalance: '$1,000',
      interestRate: '5.15% APY'
    }
  ];

  const loanProducts: LoanProduct[] = [
    {
      id: 'mortgage',
      name: 'Home Mortgages',
      description: 'Competitive rates and flexible terms for your dream home.',
      icon: <Home className="w-8 h-8" />,
      features: [
        'Competitive interest rates',
        'No application fees',
        'Fast approval process',
        'Local loan officers',
        'First-time buyer programs'
      ],
      interestRate: 'Starting at 6.75%',
      terms: ['15-year fixed', '30-year fixed', 'ARM options'],
      requirements: ['Credit score 620+', 'Down payment 3%+', 'Debt-to-income ratio']
    },
    {
      id: 'auto',
      name: 'Auto Loans',
      description: 'Drive away with low rates on new and used vehicles.',
      icon: <Car className="w-8 h-8" />,
      features: [
        'Low interest rates',
        'Quick approval',
        'Refinancing options',
        'No prepayment penalties',
        'Extended warranty options'
      ],
      interestRate: 'Starting at 4.99%',
      terms: ['36-month', '48-month', '60-month', '72-month'],
      requirements: ['Proof of income', 'Valid driver\'s license', 'Insurance coverage']
    }
  ];

  const creditCards: CreditCardType[] = [
    {
      id: 'rewards',
      name: 'Prime Rewards Card',
      description: 'Earn points on every purchase with no annual fee.',
      icon: <CreditCard className="w-8 h-8" />,
      features: [
        '2x points on gas and groceries',
        '1x points on all other purchases',
        'No annual fee',
        'Fraud protection',
        'Mobile app management'
      ],
      rewards: '2x Points',
      annualFee: '$0',
      aprRange: '15.99% - 25.99%',
      benefits: ['Purchase protection', 'Extended warranty', 'Travel insurance']
    },
    {
      id: 'cashback',
      name: 'Cashback Plus Card',
      description: 'Earn cashback on everyday purchases with premium benefits.',
      icon: <DollarSign className="w-8 h-8" />,
      features: [
        '3% cashback on dining',
        '2% cashback on gas',
        '1% cashback on everything else',
        'No foreign transaction fees',
        'Contactless payments'
      ],
      rewards: '3% Cashback',
      annualFee: '$95',
      aprRange: '13.99% - 23.99%',
      benefits: ['Airport lounge access', 'Concierge service', 'Travel credits']
    }
  ];

  const investments: InvestmentProduct[] = [
    {
      id: 'portfolio',
      name: 'Managed Portfolios',
      description: 'Professional investment management tailored to your goals.',
      icon: <TrendingUp className="w-8 h-8" />,
      riskLevel: 'medium',
      minimumInvestment: '$10,000',
      expectedReturn: '7-9% annually',
      features: [
        'Professional management',
        'Diversified portfolios',
        'Quarterly rebalancing',
        'Tax-loss harvesting',
        'Performance reporting'
      ]
    },
    {
      id: 'retirement',
      name: 'Retirement Planning',
      description: 'IRAs and 401(k) options to secure your future.',
      icon: <PiggyBank className="w-8 h-8" />,
      riskLevel: 'low',
      minimumInvestment: '$1,000',
      expectedReturn: '5-7% annually',
      features: [
        'Traditional and Roth IRAs',
        '401(k) rollovers',
        'Retirement calculators',
        'Estate planning',
        'Tax advantages'
      ]
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
              Personal Banking
              <span className="block text-blue-200">Solutions</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Comprehensive banking services designed to help you achieve your financial goals 
              with competitive rates and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-banking-navy font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Open Account</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-banking-navy transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Consultation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Account Types Section */}
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
              Banking Accounts
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Choose the right account for your needs with competitive rates and no hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {accountTypes.map((account, index) => (
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

      {/* Credit Cards Section */}
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
              Credit Cards
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Earn rewards and build credit with our competitive credit card options.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {creditCards.map((card, index) => (
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
                      <Star className="w-4 h-4 text-banking-accent" />
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

      {/* Loans Section */}
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
              Loans & Financing
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Achieve your goals with competitive loan rates and flexible terms.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {loanProducts.map((loan, index) => (
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

      {/* Investment Section */}
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
              Investment Services
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Grow your wealth with professional investment management and planning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6">
                  <div className="text-banking-accent">
                    {investment.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-banking-navy mb-4">
                  {investment.name}
                </h3>
                <p className="text-banking-slate mb-6">
                  {investment.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-banking-slate">Minimum Investment</div>
                    <div className="font-bold text-banking-navy">{investment.minimumInvestment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-banking-slate">Expected Return</div>
                    <div className="font-bold text-banking-accent">{investment.expectedReturn}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm text-banking-slate">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      investment.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      investment.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)}
                    </span>
                  </div>
                  
                  <ul className="space-y-2">
                    {investment.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-banking-success" />
                        <span className="text-banking-slate text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  className="w-full btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Banking CTA */}
      <section className="py-20 gradient-banking text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/20 p-4 rounded-2xl w-fit mb-6">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                Bank on the Go
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Download our mobile app and access all your accounts, make transfers, 
                and manage your finances from anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="bg-white text-banking-navy font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Download App</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-banking-navy transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { title: 'Mobile Check Deposit', desc: 'Deposit checks instantly' },
                { title: 'Touch ID Security', desc: 'Biometric authentication' },
                { title: 'Real-time Alerts', desc: 'Stay informed of activity' },
                { title: '24/7 Account Access', desc: 'Bank anytime, anywhere' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-morphism p-6 rounded-xl"
                >
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-200 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PersonalPage;