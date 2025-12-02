# 🔧 Troubleshooting Guide

## Database Connection Error

If you see: `❌ Database connection failed: Failed to connect to localhost:1433`

This means SQL Server is not running or not configured properly. Follow these steps:

---

## ✅ Solution Steps

### 1. **Install SQL Server** (if not installed)
Download SQL Server Express (free):
- https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- Choose "Express" version
- During installation, enable "SQL Server Browser"

### 2. **Enable TCP/IP Protocol**

1. Open **SQL Server Configuration Manager**
2. Go to: SQL Server Network Configuration → Protocols for [YOUR_INSTANCE]
3. Right-click **TCP/IP** → Enable
4. Restart SQL Server service

### 3. **Enable SQL Server Authentication**

1. Open **SQL Server Management Studio (SSMS)**
2. Right-click server → Properties → Security
3. Select "SQL Server and Windows Authentication mode"
4. Restart SQL Server

### 4. **Create SA User** (if using Windows Auth)

Run in SSMS:
```sql
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'YourPassword123';
```

### 5. **Update .env File**

```env
DB_HOST=localhost
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_NAME=University_HR_ManagementSystem
DB_PORT=1433
```

### 6. **Verify Database Exists**

In SSMS, run:
```sql
SELECT name FROM sys.databases WHERE name = 'University_HR_ManagementSystem';
```

If it doesn't exist, your SQL file will create it when executed.

### 7. **Run Your SQL File**

In SSMS:
- File → Open → `backend/database/schema.sql`
- Execute (F5)

OR use command line:
```powershell
sqlcmd -S localhost -U sa -P YourPassword123 -i "backend\database\schema.sql"
```

### 8. **Test Connection**

Restart the server:
```bash
npm run server
```

You should see:
```
✅ Connected to SQL Server database
🚀 Server is running on http://localhost:5000
```

---

## Alternative: Use Windows Authentication

If you prefer Windows Authentication instead of SQL Server Authentication:

### Update `backend/config/db.js`:

```javascript
const config = {
  server: 'localhost',
  database: 'University_HR_ManagementSystem',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: '',
      userName: '', // Leave empty for current Windows user
      password: ''  // Leave empty for current Windows user
    }
  }
};
```

### Update `.env`:
```env
DB_HOST=localhost
DB_NAME=University_HR_ManagementSystem
DB_PORT=1433
# No DB_USER or DB_PASSWORD needed for Windows Auth
```

---

## Quick Test Without Database

To test if the server runs without database connection, temporarily comment out the database check in `backend/config/db.js`:

```javascript
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server database');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    // Comment out this line to allow server to start anyway:
    // process.exit(1);
  });
```

Then you can at least test the server endpoints without database operations.

---

## Common Errors

### Error: "Login failed for user 'sa'"
- Password is incorrect in `.env`
- SA account is disabled (run `ALTER LOGIN sa ENABLE;`)

### Error: "Cannot open database"
- Database doesn't exist - run your SQL file first
- Wrong database name in `.env`

### Error: "Named Pipes Provider"
- TCP/IP is not enabled
- SQL Server Browser service is not running

### Error: "Port 1433 already in use"
- SQL Server is using a different port
- Check SQL Server Configuration Manager for actual port

---

## Verify SQL Server is Running

### Windows:
```powershell
Get-Service -Name MSSQL*
```

Should show "Running" status.

### Start SQL Server Service:
```powershell
Start-Service -Name "MSSQL$SQLEXPRESS"
```

---

## Still Having Issues?

1. Check Windows Firewall - allow port 1433
2. Verify SQL Server instance name (might be `localhost\SQLEXPRESS`)
3. Try connecting with SSMS first to confirm credentials
4. Check SQL Server error logs in Event Viewer

---

Once database is connected, you'll be able to use all API endpoints! 🚀
