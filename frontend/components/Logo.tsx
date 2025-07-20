'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
}

const Logo = ({ size = 'md', variant = 'dark', className = '', showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' }
  };

  const colors = {
    light: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      accent: '#3b82f6',
      background: '#1e3a8a',
      text: 'text-white'
    },
    dark: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      text: 'text-gray-900'
    }
  };

  const currentSize = sizes[size];
  const currentColors = colors[variant];

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Professional Abstract Banking Logo */}
      <div className={`${currentSize.icon} relative`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Main Shield/Vault Shape */}
          <path
            d="M24 4 L38 12 L38 24 Q38 34 24 42 Q10 34 10 24 L10 12 Z"
            fill={currentColors.primary}
            stroke={currentColors.accent}
            strokeWidth="1"
            className="drop-shadow-sm"
          />
          
          {/* Inner Security Pattern - Concentric Shapes */}
          <circle
            cx="24"
            cy="22"
            r="12"
            fill="none"
            stroke={currentColors.background}
            strokeWidth="2"
            opacity="0.9"
          />
          
          <circle
            cx="24"
            cy="22"
            r="8"
            fill="none"
            stroke={currentColors.background}
            strokeWidth="1.5"
            opacity="0.7"
          />
          
          {/* Central Diamond - Financial Growth Symbol */}
          <path
            d="M24 16 L28 22 L24 28 L20 22 Z"
            fill={currentColors.background}
            opacity="0.8"
          />
          
          {/* Growth Arrow Indicators */}
          <path
            d="M19 18 L21 16 L19 14"
            stroke={currentColors.background}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M29 18 L27 16 L29 14"
            stroke={currentColors.background}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          
          {/* Stability Base */}
          <rect
            x="16"
            y="34"
            width="16"
            height="3"
            fill={currentColors.accent}
            rx="1.5"
            opacity="0.8"
          />
          
          {/* Security Dots */}
          <circle cx="24" cy="22" r="2" fill={currentColors.background} opacity="0.9" />
          <circle cx="21" cy="19" r="1" fill={currentColors.background} opacity="0.6" />
          <circle cx="27" cy="19" r="1" fill={currentColors.background} opacity="0.6" />
          <circle cx="21" cy="25" r="1" fill={currentColors.background} opacity="0.6" />
          <circle cx="27" cy="25" r="1" fill={currentColors.background} opacity="0.6" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className={`${currentColors.text} font-bold ${currentSize.text}`}>
          <span className="block leading-none font-black">Prime Edge</span>
          <span className="block text-xs font-semibold opacity-90 leading-none tracking-wider">BANKING</span>
        </div>
      )}
    </motion.div>
  );
};

export default Logo;