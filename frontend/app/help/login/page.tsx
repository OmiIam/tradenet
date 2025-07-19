'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Key, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const LoginHelpPage = () => {
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
            href="/help" 
            className="inline-flex items-center space-x-2 text-blue-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Help</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Login Help
          </h1>

          <div className="space-y-6">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <Key className="w-8 h-8 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Test Account Credentials</h3>
                  <div className="text-blue-200 space-y-2">
                    <div>
                      <p className="font-semibold text-white">Admin Account:</p>
                      <p>Email: admin@primeedge.com</p>
                      <p>Password: admin123</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Regular User:</p>
                      <p>Email: user@primeedge.com</p>
                      <p>Password: user123</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Business Account:</p>
                      <p>Email: business@primeedge.com</p>
                      <p>Password: business123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Common Login Issues</h3>
                  <ul className="text-blue-200 space-y-2">
                    <li>• Make sure your email and password are correct</li>
                    <li>• Check that Caps Lock is off</li>
                    <li>• Clear your browser cache and cookies</li>
                    <li>• Try using an incognito/private browsing window</li>
                    <li>• Ensure JavaScript is enabled in your browser</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <Smartphone className="w-8 h-8 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Security Features</h3>
                  <ul className="text-blue-200 space-y-2">
                    <li>• We use 256-bit SSL encryption to protect your data</li>
                    <li>• Your session will automatically expire after 1 hour of inactivity</li>
                    <li>• Always log out when using shared or public computers</li>
                    <li>• Never share your login credentials with anyone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/login"
              className="btn-primary inline-block"
            >
              Try Logging In Again
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginHelpPage;