// server.js
const express = require("express");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});


//display all employee profiles
app.get("/view-employees", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT * FROM allEmployeeProfiles");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
});

//display number of employees per department
app.get("/view-dept", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT * FROM NoEmployeeDept");
        const normalized = result.recordset.map((row) => ({
            dept_name: row.dept_name ?? row.Department ?? row.department_name ?? row.department,
            Number_of_Employees:
                row.Number_of_Employees ?? row["Number of Employees"] ?? row.employee_count ?? row.count ?? 0
        }));
        res.json(normalized);
    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

//display all rejected medical leaves
app.get("/view-rejected-medicals", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT * FROM allRejectedMedicals");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching rejected medicals:", err);
        res.status(500).json({ error: "Failed to fetch rejected medical leaves" });
    }
});

//Remove deductions of resigned employees based on their employment_status. 
app.post("/remove-deductions", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .execute("Remove_Deductions");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error removing deductions:", err);
        res.status(500).json({ error: "Failed to remove deductions" });
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
