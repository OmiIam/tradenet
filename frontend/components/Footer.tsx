'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { FooterSection } from '@/types';
import Logo from './Logo';

const Footer = () => {
  const footerSections: FooterSection[] = [
    {
      title: 'Banking Services',
      links: [
        { label: 'Personal Banking', href: '#personal' },
        { label: 'Business Banking', href: '#business' },
        { label: 'Investment Services', href: '#investments' },
        { label: 'Loan Services', href: '#loans' },
        { label: 'Credit Cards', href: '#cards' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Security Center', href: '#security' },
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Press Room', href: '#press' },
        { label: 'Investor Relations', href: '#investors' },
        { label: 'Community', href: '#community' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Financial Education', href: '#education' },
        { label: 'Market Insights', href: '#insights' },
        { label: 'Mobile App', href: '#mobile' },
        { label: 'API Documentation', href: '#api' },
        { label: 'Developer Portal', href: '#developers' },
      ]
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#facebook', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#twitter', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#linkedin', label: 'LinkedIn' },
    { icon: <Instagram className="w-5 h-5" />, href: '#instagram', label: 'Instagram' },
  ];

  const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, text: '1-800-PRIME-EDGE', label: 'Phone' },
    { icon: <Mail className="w-5 h-5" />, text: 'support@primeedgebanking.com', label: 'Email' },
    { icon: <MapPin className="w-5 h-5" />, text: 'New York, NY 10001', label: 'Address' },
  ];

  return (
    <footer className="bg-banking-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Logo */}
                <div className="mb-6">
                  <Logo size="md" variant="light" />
                </div>

                {/* Description */}
                <p className="text-blue-200 mb-6 leading-relaxed">
                  Your premier banking partner delivering cutting-edge financial solutions. 
                  Prime Edge Banking provides secure, innovative services that help you stay ahead.
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="text-banking-accent">
                        {info.icon}
                      </div>
                      <span className="text-blue-200">{info.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Columns */}
            {footerSections.map((section, sectionIndex) => (
              <div key={section.title} className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: linkIndex * 0.05 }}
                      >
                        <a
                          href={link.href}
                          className="text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 pt-8 border-t border-blue-800"
          >
            <div className="max-w-md mx-auto lg:mx-0">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-blue-200 mb-6">
                Get the latest news and updates from Prime Edge Banking
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-banking-accent"
                />
                <motion.button
                  className="bg-banking-accent hover:bg-banking-deepBlue px-6 py-3 rounded-r-lg font-semibold transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-blue-200 text-center md:text-left mb-4 md:mb-0"
            >
              © 2024 Prime Edge Banking. All rights reserved. Member FDIC.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="bg-white/10 hover:bg-banking-accent p-3 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;