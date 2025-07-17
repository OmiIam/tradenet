'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo = ({ size = 'md', variant = 'dark', className = '' }: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-xl' },
    md: { icon: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' }
  };

  const colors = {
    light: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      accent: '#3b82f6',
      text: 'text-white'
    },
    dark: {
      primary: '#1e3a8a',
      secondary: '#334155',
      accent: '#3b82f6',
      text: 'text-banking-navy'
    }
  };

  const currentSize = sizes[size];
  const currentColors = colors[variant];

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Custom Logo Icon */}
      <div className={`${currentSize.icon} relative`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Ring */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke={currentColors.accent}
            strokeWidth="2"
            fill="none"
          />
          
          {/* Inner Diamond/Shield Shape */}
          <path
            d="M24 6 L36 18 L24 30 L12 18 Z"
            fill={currentColors.accent}
            fillOpacity="0.1"
            stroke={currentColors.accent}
            strokeWidth="1.5"
          />
          
          {/* Central "P" and "E" Letters */}
          <g fill={currentColors.accent}>
            {/* P */}
            <path d="M18 14 L18 26 M18 14 L22 14 Q24 14 24 17 Q24 20 22 20 L18 20" 
                  stroke={currentColors.accent} 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" />
            
            {/* E */}
            <path d="M26 14 L26 26 M26 14 L30 14 M26 20 L29 20 M26 26 L30 26" 
                  stroke={currentColors.accent} 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" />
          </g>
          
          {/* Accent Lines */}
          <line x1="12" y1="32" x2="36" y2="32" stroke={currentColors.accent} strokeWidth="1" opacity="0.5" />
          <line x1="15" y1="35" x2="33" y2="35" stroke={currentColors.accent} strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className={`${currentColors.text} font-bold ${currentSize.text}`}>
        <span className="block leading-none">Prime Edge</span>
        <span className="block text-sm font-medium opacity-80 leading-none">BANKING</span>
      </div>
    </motion.div>
  );
};

export default Logo;