const sql = require('mssql');
require('dotenv').config();

// SQL Server configuration
const config = {
  server: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'University_HR_ManagementSystem',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // Use true for Azure
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server database');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('⚠️  Server will start anyway, but database operations will fail.');
    console.error('📝 Check TROUBLESHOOTING.md for help setting up SQL Server');
    // Return a dummy pool to allow server to start
    return null;
  });

module.exports = {
  sql,
  poolPromise
};
