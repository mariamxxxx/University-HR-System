const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/**
 * Initialize database from SQL file
 * Usage: node backend/database/init.js
 */
async function initializeDatabase() {
  try {
    // Read your SQL file
    const sqlFilePath = path.join(__dirname, 'schema.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error('❌ SQL file not found at:', sqlFilePath);
      console.log('Please place your SQL file at backend/database/schema.sql');
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split by semicolons and filter empty statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      try {
        await db.query(statements[i]);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      } catch (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        console.error('Statement:', statements[i].substring(0, 100) + '...');
      }
    }

    console.log('✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
