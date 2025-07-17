'use client';

import React, { useState, useEffect } from 'react';
import { Mail, User, MessageCircle, MapPin, Phone, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validation, setValidation] = useState<{ [key: string]: { isValid: boolean; message: string } }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live validation
  useEffect(() => {
    const newValidation: { [key: string]: { isValid: boolean; message: string } } = {};

    // Name validation
    if (form.name.length > 0) {
      if (form.name.length < 2) {
        newValidation.name = { isValid: false, message: 'Name must be at least 2 characters' };
      } else if (form.name.length > 50) {
        newValidation.name = { isValid: false, message: 'Name must be less than 50 characters' };
      } else {
        newValidation.name = { isValid: true, message: 'Name looks good!' };
      }
    }

    // Email validation
    if (form.email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newValidation.email = { isValid: false, message: 'Please enter a valid email address' };
      } else {
        newValidation.email = { isValid: true, message: 'Email format is valid' };
      }
    }

    // Message validation
    if (form.message.length > 0) {
      if (form.message.length < 10) {
        newValidation.message = { isValid: false, message: 'Message must be at least 10 characters' };
      } else if (form.message.length > 1000) {
        newValidation.message = { isValid: false, message: 'Message must be less than 1000 characters' };
      } else {
        newValidation.message = { isValid: true, message: 'Message looks good!' };
      }
    }

    setValidation(newValidation);
  }, [form]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      setForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (fieldName: string) => {
    if (errors[fieldName]) return 'error';
    if (validation[fieldName]?.isValid) return 'success';
    if (form[fieldName as keyof typeof form].length > 0) return 'error';
    return 'neutral';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-banking-navy via-banking-deepBlue to-banking-accent animate-gradient-move" />
      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-4xl mx-auto rounded-3xl shadow-2xl bg-white/30 backdrop-blur-lg border border-white/20 flex flex-col md:flex-row overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 60%, rgba(59,130,246,0.10) 100%)' }}
      >
        {/* Info Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-banking-navy/90 to-banking-accent/80 text-white p-10 w-2/5 min-h-[500px]">
          <div>
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-blue-100 mb-8">We&apos;d love to hear from you! Reach out and our team will respond promptly.</p>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-banking-accent" />
                <span>support@primeedgebanking.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-banking-accent" />
                <span>1-800-PRIME-EDGE</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-banking-accent" />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </div>
          {/* Map Placeholder */}
          <div className="mt-10 rounded-2xl bg-white/10 border border-white/20 h-32 flex items-center justify-center text-blue-100 text-sm">
            Map Placeholder
          </div>
        </div>
        {/* Contact Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <CheckCircle className="w-14 h-14 text-banking-success mb-4" />
              <h3 className="text-2xl font-bold text-banking-navy mb-2">Thank you!</h3>
              <p className="text-banking-slate mb-2">Your message has been sent. We&apos;ll get back to you soon.</p>
            </motion.div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit} autoComplete="off">
              <h3 className="text-2xl font-bold text-banking-navy mb-6 text-center">Send us a message</h3>
              {/* Name */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-banking-accent pointer-events-none">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder=" "
                  aria-label="Full name"
                  aria-describedby="name-help"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border text-banking-slate placeholder:text-banking-slate/60 transition-all peer ${
                    getFieldStatus('name') === 'success' 
                      ? 'border-green-400 bg-gradient-to-br from-white/70 to-green-100/30' 
                      : getFieldStatus('name') === 'error'
                      ? 'border-red-400 bg-gradient-to-br from-white/70 to-red-100/30'
                      : 'border-banking-slate/20 bg-gradient-to-br from-white/70 to-blue-100/30'
                  } shadow-inner focus:outline-none focus:ring-2 focus:ring-banking-accent/60 focus:bg-white/90`}
                />
                <label className="absolute left-12 top-1/2 -translate-y-1/2 text-banking-slate pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs bg-white/70 px-1">
                  Name
                </label>
                {/* Validation Icon */}
                {form.name.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {getFieldStatus('name') === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </motion.div>
                )}
                {/* Tooltip */}
                <div className="absolute -bottom-6 left-0 text-xs text-banking-slate flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>We&apos;ll use this to personalize your experience</span>
                </div>
                {/* Validation Message */}
                {validation.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -bottom-8 left-0 text-xs ${
                      validation.name.isValid ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {validation.name.message}
                  </motion.div>
                )}
              </motion.div>
              {/* Email */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-banking-accent pointer-events-none">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder=" "
                  aria-label="Email address"
                  aria-describedby="email-help"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border text-banking-slate placeholder:text-banking-slate/60 transition-all peer ${
                    getFieldStatus('email') === 'success' 
                      ? 'border-green-400 bg-gradient-to-br from-white/70 to-green-100/30' 
                      : getFieldStatus('email') === 'error'
                      ? 'border-red-400 bg-gradient-to-br from-white/70 to-red-100/30'
                      : 'border-banking-slate/20 bg-gradient-to-br from-white/70 to-blue-100/30'
                  } shadow-inner focus:outline-none focus:ring-2 focus:ring-banking-accent/60 focus:bg-white/90`}
                />
                <label className="absolute left-12 top-1/2 -translate-y-1/2 text-banking-slate pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs bg-white/70 px-1">
                  Email
                </label>
                {/* Validation Icon */}
                {form.email.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {getFieldStatus('email') === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </motion.div>
                )}
                {/* Tooltip */}
                <div className="absolute -bottom-6 left-0 text-xs text-banking-slate flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>We&apos;ll never share your email with anyone else</span>
                </div>
                {/* Validation Message */}
                {validation.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -bottom-8 left-0 text-xs ${
                      validation.email.isValid ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {validation.email.message}
                  </motion.div>
                )}
              </motion.div>
              {/* Message */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="absolute left-4 top-6 text-banking-accent pointer-events-none">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder=" "
                  rows={4}
                  aria-label="Message"
                  aria-describedby="message-help"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border text-banking-slate placeholder:text-banking-slate/60 transition-all peer resize-none ${
                    getFieldStatus('message') === 'success' 
                      ? 'border-green-400 bg-gradient-to-br from-white/70 to-green-100/30' 
                      : getFieldStatus('message') === 'error'
                      ? 'border-red-400 bg-gradient-to-br from-white/70 to-red-100/30'
                      : 'border-banking-slate/20 bg-gradient-to-br from-white/70 to-blue-100/30'
                  } shadow-inner focus:outline-none focus:ring-2 focus:ring-banking-accent/60 focus:bg-white/90`}
                />
                <label className="absolute left-12 top-6 -translate-y-1/2 text-banking-slate pointer-events-none transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs bg-white/70 px-1">
                  Message
                </label>
                {/* Validation Icon */}
                {form.message.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-6"
                  >
                    {getFieldStatus('message') === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </motion.div>
                )}
                {/* Tooltip */}
                <div className="absolute -bottom-6 left-0 text-xs text-banking-slate flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Tell us how we can help you today</span>
                </div>
                {/* Validation Message */}
                {validation.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -bottom-8 left-0 text-xs ${
                      validation.message.isValid ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {validation.message.message}
                  </motion.div>
                )}
              </motion.div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-banking-accent to-banking-navy text-white font-semibold py-4 rounded-xl shadow-xl hover:from-banking-navy hover:to-banking-accent transition-all text-lg tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
      {/* Extra: animated floating shapes */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-banking-accent/20 blur-2xl"
        animate={{ y: [0, 30, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-banking-navy/20 blur-2xl"
        animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ContactPage;