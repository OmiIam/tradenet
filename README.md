# Prime Edge Banking - Internet Banking System

A modern, full-featured internet banking application built with Next.js, TypeScript, and SQLite. Features a professional glassmorphism design, comprehensive user dashboard, and powerful admin panel.

## 🌟 Features

### User Features
- **Secure Authentication** - JWT-based authentication with password hashing
- **Dashboard Overview** - Account summaries, recent transactions, analytics
- **Account Management** - View account details, transaction history, balance tracking
- **Money Transfers** - Transfer between accounts or to external payees
- **Payee Management** - Add, edit, and manage payment recipients
- **Transaction History** - Advanced filtering and search capabilities
- **Responsive Design** - Mobile-first approach with glassmorphism effects

### Admin Features
- **Admin Panel** - Dedicated administrative interface
- **User Management** - Create, edit, activate/deactivate users
- **Account Management** - Edit account balances with audit trails
- **Transaction Management** - Monitor and edit system transactions
- **System Overview** - Real-time metrics and activity monitoring
- **Audit Logging** - Complete audit trail for all admin actions

### Security Features
- **Role-based Access Control** - User and admin permissions
- **Password Security** - bcrypt hashing with validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Protection** - Secure cross-origin resource sharing
- **Input Validation** - Zod schema validation throughout
- **Session Management** - Secure JWT tokens with refresh capability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internet_banking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Visit the banking system and create an account or use test credentials

## 🔐 Test Credentials

The system comes with pre-seeded test users:

### Regular User
- **Email:** `user@primeedge.com`
- **Password:** `user123`
- **Features:** Full user dashboard with accounts, transfers, and payees

### Business User  
- **Email:** `business@primeedge.com`
- **Password:** `business123`
- **Features:** Business account with higher balance limits

### Admin User
- **Email:** `admin@primeedge.com`
- **Password:** `admin123`
- **Features:** Complete admin panel access

## Project Structure

```
internet-banking/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Footer.tsx         # Footer with links and social media
│   ├── Hero.tsx           # Hero section with glassmorphism
│   ├── Logo.tsx           # Custom Prime Edge Banking logo
│   ├── Navbar.tsx         # Sticky navigation bar
│   └── Services.tsx       # Banking services showcase
├── types/                 # TypeScript type definitions
│   └── index.ts           # Common interfaces and types
├── tailwind.config.js     # Tailwind configuration with custom theme
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Key Components

### Logo Component
- Custom Prime Edge Banking logo with SVG design
- Responsive sizing (sm, md, lg)
- Light and dark variants
- Smooth hover animations

### Navbar
- Sticky positioning with scroll effects
- Mobile-responsive with hamburger menu
- Glassmorphism background blur
- Dynamic logo variant switching

### Hero Section
- Gradient background with floating elements
- Glassmorphism stats card
- Prime Edge Banking branding
- Call-to-action buttons

### Services Section
- Grid layout showcasing banking features
- Hover effects and micro-interactions
- Feature lists with icons
- Responsive design

### Footer
- Comprehensive link organization
- Contact information with Prime Edge branding
- Social media links
- Newsletter signup

## Customization

### Colors
The banking theme colors are defined in `tailwind.config.js`:
- Primary blues and navy tones
- Warm background colors
- Glassmorphism utilities
- Success, warning, and error states

### Animations
Framer Motion variants are used throughout for:
- Page load animations
- Scroll-triggered animations
- Hover and tap interactions
- Staggered children animations

### Typography
- Inter font family for clean, modern text
- Responsive font sizes
- Proper heading hierarchy
- Accessible contrast ratios

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational and demonstration purposes.# internet-banking
# internet-banking
