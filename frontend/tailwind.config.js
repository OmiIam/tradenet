/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-banking-accent',
    'hover:bg-banking-accent',
    'bg-banking-deepBlue',
    'hover:bg-banking-deepBlue',
    'text-banking-accent',
    'text-banking-deepBlue',
    // add more as needed
  ],
  theme: {
    extend: {
      colors: {
        banking: {
          primary: '#1e3a8a',     // Deep navy for headers and primary actions
          secondary: '#3b82f6',   // Clean blue for accents and links
          accent: '#3b82f6',      // Clean blue accent
          deepBlue: '#1e3a8a',    // Deep blue
          navy: '#1e3a8a',        // Banking navy
          slate: '#475569',       // Slate gray
          warm: '#f8fafc',        // Warm background
          success: '#059669',     // Accessible green
          warning: '#d97706',     // Accessible orange
          error: '#dc2626',       // Accessible red
        },
        // Flattened banking colors for direct class usage
        'banking-primary': '#1e3a8a',
        'banking-secondary': '#3b82f6',
        'banking-accent': '#3b82f6',
        'banking-deepBlue': '#1e3a8a',
        'banking-navy': '#1e3a8a',
        'banking-slate': '#475569',
        'banking-warm': '#f8fafc',
        'banking-success': '#059669',
        'banking-warning': '#d97706',
        'banking-error': '#dc2626'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}