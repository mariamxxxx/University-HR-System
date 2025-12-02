// db.js
const sql = require("mssql");

// ✅ Update these values with your own SQL login and database
const config = {
    user: "mariamNodeUser", // SQL login username
    password: "password123", // SQL login password
    database: "University_HR_ManagementSystem", // your database name
    server: "localhost\\SQLEXPRESS", // or "localhost,1433" if using port
    options: {
        encrypt: false, // required for local dev
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log("🎉 Connected to SQL Server!");
        return pool;
    })
    .catch((err) => {
        console.error("❌ Connection failed:", err);
        throw err;
    });

module.exports = { sql, poolPromise };
