'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Shield,
  TrendingUp,
  Globe,
  Heart,
  Star,
  Building2,
  Linkedin,
  Mail
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TeamMember } from '@/types';

const AboutPage = () => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Williams',
      role: 'Chief Executive Officer',
      bio: 'Sarah brings over 15 years of experience in financial services and has led Prime Edge Banking through its most successful period of growth.',
      linkedin: '#',
      email: 'sarah.williams@primeedgebanking.com'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Chief Technology Officer',
      bio: 'Michael is responsible for our digital innovation and cybersecurity initiatives, ensuring our platform remains cutting-edge and secure.',
      linkedin: '#',
      email: 'michael.rodriguez@primeedgebanking.com'
    },
    {
      id: '3',
      name: 'Jennifer Chang',
      role: 'Chief Financial Officer',
      bio: 'Jennifer oversees our financial operations and strategic planning, with expertise in risk management and regulatory compliance.',
      linkedin: '#',
      email: 'jennifer.chang@primeedgebanking.com'
    },
    {
      id: '4',
      name: 'David Thompson',
      role: 'Head of Customer Experience',
      bio: 'David leads our customer service initiatives and ensures every interaction with Prime Edge Banking exceeds expectations.',
      linkedin: '#',
      email: 'david.thompson@primeedgebanking.com'
    }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security First',
      description: 'We prioritize the security of your financial data with bank-grade encryption and advanced fraud protection.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer Centric',
      description: 'Every decision we make is guided by what\'s best for our customers and their financial success.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Innovation Driven',
      description: 'We continuously evolve our platform with the latest technology to provide the best banking experience.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Reach',
      description: 'Our services are designed to support your financial needs whether you\'re local or international.'
    }
  ];

  const achievements = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Best Digital Bank 2024',
      description: 'Recognized by Financial Times for innovation in digital banking'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Customer Choice Award',
      description: 'Voted #1 customer service by Banking Excellence Awards'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security Excellence',
      description: 'Certified for advanced cybersecurity measures and data protection'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Industry Leadership',
      description: 'Leading the transformation of traditional banking services'
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
              About Prime Edge
              <span className="block text-blue-200">Banking</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Pioneering the future of banking with innovative solutions, exceptional service, 
              and unwavering commitment to our customers' financial success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card-banking p-8"
            >
              <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6">
                <Target className="w-8 h-8 text-banking-accent" />
              </div>
              <h2 className="text-3xl font-bold text-banking-navy mb-6">Our Mission</h2>
              <p className="text-banking-slate leading-relaxed">
                To democratize access to premium banking services by combining cutting-edge technology 
                with personalized customer care. We believe everyone deserves banking solutions that 
                are secure, innovative, and tailored to their unique financial journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card-banking p-8"
            >
              <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mb-6">
                <TrendingUp className="w-8 h-8 text-banking-accent" />
              </div>
              <h2 className="text-3xl font-bold text-banking-navy mb-6">Our Vision</h2>
              <p className="text-banking-slate leading-relaxed">
                To be the world's most trusted digital banking platform, empowering individuals and 
                businesses to achieve their financial goals through innovative technology, transparent 
                practices, and exceptional service that evolves with our customers' needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
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
              Our Story
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Founded in 2018, Prime Edge Banking emerged from a simple belief: 
              banking should be accessible, secure, and tailored to modern needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-banking-accent/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-banking-accent">2018</span>
              </div>
              <h3 className="text-xl font-bold text-banking-navy mb-4">Foundation</h3>
              <p className="text-banking-slate">
                Prime Edge Banking was founded with the vision of creating a more accessible 
                and innovative banking experience for everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-banking-accent/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-banking-accent">2020</span>
              </div>
              <h3 className="text-xl font-bold text-banking-navy mb-4">Growth</h3>
              <p className="text-banking-slate">
                Reached 500,000 customers and launched our award-winning mobile banking platform 
                with industry-leading security features.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-banking-accent/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-banking-accent">2024</span>
              </div>
              <h3 className="text-xl font-bold text-banking-navy mb-4">Innovation</h3>
              <p className="text-banking-slate">
                Now serving over 2 million customers with comprehensive business banking solutions 
                and investment services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
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
              Our Core Values
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              The principles that guide every decision we make and every service we provide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-banking-accent/10 p-6 rounded-2xl w-fit mx-auto mb-6">
                  <div className="text-banking-accent">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-banking-navy mb-4">
                  {value.title}
                </h3>
                <p className="text-banking-slate">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
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
              Leadership Team
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Meet the experienced professionals leading Prime Edge Banking into the future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-banking-accent/10 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-banking-accent" />
                </div>
                
                <h3 className="text-xl font-bold text-banking-navy mb-2">
                  {member.name}
                </h3>
                <p className="text-banking-accent font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-banking-slate text-sm mb-6">
                  {member.bio}
                </p>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    className="text-banking-slate hover:text-banking-accent transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-banking-slate hover:text-banking-accent transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
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
              Awards & Recognition
            </h2>
            <p className="text-xl text-banking-slate max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders and customers alike.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-banking p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-banking-accent/10 p-4 rounded-2xl w-fit mx-auto mb-6">
                  <div className="text-banking-accent">
                    {achievement.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-banking-navy mb-4">
                  {achievement.title}
                </h3>
                <p className="text-banking-slate text-sm">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-banking text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience Prime Edge Banking?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers who trust Prime Edge Banking 
              for their financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-banking-navy font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Open Account Today
              </motion.button>
              <motion.button
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-banking-navy transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;