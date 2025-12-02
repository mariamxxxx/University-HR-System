// server.js
const express = require("express");
const { sql, poolPromise } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Example: Call your stored procedure
app.post("/run-procedure", async (req, res) => {
    const { employee_ID, start_date, end_date } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .execute("Submit_annual");  // <-- your procedure name

        res.json(result.recordset); // send results back to frontend
    } catch (err) {
        console.error("Error executing procedure:", err);
        res.status(500).json({ error: "Failed to execute procedure" });
    }
});

// Start server only after DB is ready
poolPromise
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(() => {
        process.exit(1);
    });
