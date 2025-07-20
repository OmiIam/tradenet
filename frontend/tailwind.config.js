/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        banking: {
          primary: '#1e3a8a',    // Deep navy for headers and primary actions
          secondary: '#3b82f6',   // Clean blue for accents and links
          text: {
            primary: '#0f172a',   // High contrast dark text
            secondary: '#475569', // Medium gray for secondary text
            muted: '#64748b',     // Light gray for muted text
          },
          background: {
            primary: '#ffffff',   // Pure white
            secondary: '#f8fafc', // Subtle off-white
            accent: '#f1f5f9',    // Light accent background
          },
          border: {
            light: '#e2e8f0',     // Light border
            medium: '#cbd5e1',    // Medium border
            dark: '#94a3b8',      // Dark border
          },
          success: '#059669',     // Accessible green
          warning: '#d97706',     // Accessible orange
          error: '#dc2626',       // Accessible red
        }
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