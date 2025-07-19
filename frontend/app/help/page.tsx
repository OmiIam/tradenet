'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const HelpPage = () => {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-minimal" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 rounded-2xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <Logo size="lg" variant="dark" />
          </div>

          <Link 
            href="/login" 
            className="inline-flex items-center space-x-2 text-blue-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            How Can We Help You?
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <Phone className="w-8 h-8 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-blue-200 mb-4">Speak with our customer service team</p>
              <p className="text-white font-semibold">1-800-PRIMEEDGE</p>
              <p className="text-blue-200 text-sm">Available 24/7</p>
            </div>

            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <Mail className="w-8 h-8 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
              <p className="text-blue-200 mb-4">Send us a detailed message</p>
              <p className="text-white font-semibold">support@primeedge.com</p>
              <p className="text-blue-200 text-sm">Response within 24 hours</p>
            </div>

            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <MessageCircle className="w-8 h-8 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-blue-200 mb-4">Chat with our support team</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <Clock className="w-8 h-8 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Business Hours</h3>
              <div className="text-blue-200 space-y-1">
                <p>Monday - Friday: 8 AM - 8 PM</p>
                <p>Saturday: 9 AM - 5 PM</p>
                <p>Sunday: 10 AM - 4 PM</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Common Issues</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/help/login" className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-blue-200 hover:text-white transition-colors">
                Login Problems
              </Link>
              <Link href="/help/account" className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-blue-200 hover:text-white transition-colors">
                Account Issues
              </Link>
              <Link href="/help/transfers" className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-blue-200 hover:text-white transition-colors">
                Transfer Help
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;