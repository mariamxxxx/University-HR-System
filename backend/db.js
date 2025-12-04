// db.js
const sql = require("mssql");

const config = {
    user: "danakhx", // SQL login username
    password: "purple33", // SQL login password
    database: "master", // your database name
    server: "localhost\\SQLEXPRESS", // or "localhost,1433" if using port
    options: {
        encrypt: false, // required for local dev
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log("Connected to SQL Server!");
        return pool;
    })
    .catch((err) => {
        console.error("Connection failed:", err);
        throw err;
    });

module.exports = { sql, poolPromise };
