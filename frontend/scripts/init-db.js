#!/usr/bin/env node

const { getDatabase } = require('../lib/database/json-db.ts');

console.log('🚀 Initializing Prime Edge Banking Database...\n');

try {
  // This will trigger database initialization and seeding
  const db = getDatabase();
  console.log('\n✅ Database setup complete!');
  console.log('\n🌐 You can now start the application with: npm run dev');
  console.log('📱 Visit http://localhost:3000 to access the banking system');
  
  // Close the database connection
  process.exit(0);
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}