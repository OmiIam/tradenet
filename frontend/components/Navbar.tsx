'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavItem } from '@/types';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Personal', href: '/personal' },
    { label: 'Business', href: '/business' },
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const authButtons: NavItem[] = [
    { label: 'Login', href: '/login', isButton: true, variant: 'secondary' },
    { label: 'Sign Up', href: '/signup', isButton: true, variant: 'primary' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo size="md" variant="dark" showText={true} />

          {/* Desktop Navigation - Hide more items on smaller screens */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-banking-accent transition-colors duration-200 font-medium text-sm px-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Tablet Navigation - Reduced items */}
          <div className="hidden md:flex lg:hidden items-center space-x-6">
            {navItems.slice(0, 3).map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-banking-accent transition-colors duration-200 font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <motion.a
              href="/login"
              className="font-medium py-2 px-3 text-sm rounded-lg transition-all duration-300 text-gray-700 hover:text-banking-accent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.a>
            <motion.a
              href="/signup"
              className="btn-primary text-sm py-2 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.a
              href="/login"
              className="text-gray-700 hover:text-banking-accent transition-colors duration-300 font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.a>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-banking-accent transition-colors duration-300"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="block text-banking-slate hover:text-banking-accent transition-colors duration-200 font-medium text-base py-2 px-3 rounded-lg hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
              whileHover={{ x: 5 }}
            >
              {item.label}
            </motion.a>
          ))}
          <div className="pt-3 border-t border-gray-200/50">
            <motion.a
              href="/signup"
              className="block text-center btn-primary py-2 px-4 text-sm"
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;