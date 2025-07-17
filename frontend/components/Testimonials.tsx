'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Testimonial } from '@/types';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      company: 'Johnson Design Studio',
      content: 'Prime Edge Banking has transformed how I manage my business finances. Their digital platform is intuitive, and the customer service is exceptional. The business loan process was seamless, and I got approved within 48 hours.',
      rating: 5
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Tech Entrepreneur',
      company: 'InnovateTech Solutions',
      content: 'The investment tools and portfolio management features are outstanding. I\'ve been able to diversify my investments and track performance in real-time. The mobile app is incredibly user-friendly.',
      rating: 5
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      role: 'Marketing Director',
      company: 'Creative Marketing Co.',
      content: 'Prime Edge Banking\'s savings plans helped me reach my financial goals faster than I expected. The automated savings features and competitive interest rates make it easy to build wealth over time.',
      rating: 5
    },
    {
      id: '4',
      name: 'David Thompson',
      role: 'Restaurant Owner',
      company: 'Thompson\'s Bistro',
      content: 'The merchant services and payroll integration have streamlined our operations significantly. Managing payments and employee payroll has never been easier. Highly recommend for restaurant owners.',
      rating: 5
    },
    {
      id: '5',
      name: 'Emily Davis',
      role: 'Freelance Consultant',
      company: 'Davis Consulting',
      content: 'As a freelancer, I needed banking solutions that could adapt to my irregular income. Prime Edge Banking\'s flexible credit line and expense tracking tools have been game-changers for my financial management.',
      rating: 5
    },
    {
      id: '6',
      name: 'Robert Wilson',
      role: 'Retail Manager',
      company: 'Wilson Electronics',
      content: 'The security features give me peace of mind when managing our store\'s finances. The fraud protection and real-time alerts have helped us avoid potential security issues multiple times.',
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
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
            What Our Customers Say
          </h2>
          <p className="text-xl text-banking-slate max-w-3xl mx-auto">
            Discover why thousands of individuals and businesses trust Prime Edge Banking 
            with their financial needs.
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Testimonial Display */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-banking-accent/20">
              <Quote className="w-16 h-16" />
            </div>

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-lg md:text-xl text-banking-slate text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author Info */}
              <div className="text-center">
                <div className="mb-2">
                  <h4 className="text-xl font-bold text-banking-navy">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-banking-slate">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-banking-accent font-medium">
                    {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <motion.button
                onClick={prevTestimonial}
                className="bg-white shadow-lg rounded-full p-3 text-banking-accent hover:bg-banking-accent hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <motion.button
                onClick={nextTestimonial}
                className="bg-white shadow-lg rounded-full p-3 text-banking-accent hover:bg-banking-accent hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Testimonial Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-banking-accent' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Testimonial Grid Preview */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-banking-slate mb-4 text-sm leading-relaxed">
                  "{testimonial.content.length > 120 
                    ? testimonial.content.substring(0, 120) + '...' 
                    : testimonial.content}"
                </p>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-banking-navy text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-banking-slate text-xs">
                    {testimonial.role}
                  </p>
                  <p className="text-banking-accent text-xs font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-banking-navy mb-6">
              Trusted by Thousands
            </h3>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-banking-accent mb-2">2M+</div>
                <div className="text-banking-slate">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-banking-accent mb-2">4.9/5</div>
                <div className="text-banking-slate">Customer Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-banking-accent mb-2">50K+</div>
                <div className="text-banking-slate">Business Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-banking-accent mb-2">99.9%</div>
                <div className="text-banking-slate">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;