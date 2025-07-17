#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function updatePasswords() {
  console.log('🔐 Generating proper password hashes...\n');
  
  try {
    // Generate hashes for test passwords
    const adminHash = await hashPassword('admin123');
    const userHash = await hashPassword('user123');
    const businessHash = await hashPassword('business123');
    
    console.log('✅ Password hashes generated successfully');
    
    // Read current data.json
    const dataPath = path.join(process.cwd(), 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // Update password hashes
    data.users.forEach(user => {
      if (user.email === 'admin@primeedge.com') {
        user.password_hash = adminHash;
        console.log('✅ Updated admin password hash');
      } else if (user.email === 'user@primeedge.com') {
        user.password_hash = userHash;
        console.log('✅ Updated user password hash');
      } else if (user.email === 'business@primeedge.com') {
        user.password_hash = businessHash;
        console.log('✅ Updated business password hash');
      }
    });
    
    // Save updated data
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    console.log('\n🎉 Password hashes updated successfully!');
    console.log('\n📝 Test Credentials (now working):');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                     TEST USERS                         │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 👤 Regular User:                                       │');
    console.log('│    Email: user@primeedge.com                           │');
    console.log('│    Password: user123                                   │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 🏢 Business User:                                      │');
    console.log('│    Email: business@primeedge.com                       │');
    console.log('│    Password: business123                               │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 🔐 Admin User:                                         │');
    console.log('│    Email: admin@primeedge.com                          │');
    console.log('│    Password: admin123                                  │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
    process.exit(1);
  }
}

updatePasswords();