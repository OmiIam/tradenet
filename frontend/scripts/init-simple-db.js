#!/usr/bin/env node

const { initializeJsonDatabase } = require('../lib/database/json-db.ts');

console.log('🚀 Initializing Prime Edge Banking JSON Database...\n');

initializeJsonDatabase()
  .then(() => {
    console.log('\n✅ Database setup complete!');
    console.log('\n🌐 You can now start the application with: npm run dev');
    console.log('📱 Visit http://localhost:3000/login to access the banking system');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  });