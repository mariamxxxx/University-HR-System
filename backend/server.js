// server.js

const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ====== SQL Server Config ======
const dbConfig = {
  user: 'sa',                   // your SQL username
  password: 'P@ssword123',    // your SQL password
  server: ' ROKAIA\\SQLEXPRESS', // your SQL Server instance
  database: 'University_HR_ManagementSystem',    // your database name
  options: {
    encrypt: false,             // set false if not using SSL
    trustServerCertificate: true
  }
};

// ====== Connect to SQL Server ======
sql.connect(dbConfig)
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));

// ====== Simple test route ======
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ====== Start the server ======
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
