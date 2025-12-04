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


// 2 display all employee profiles
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

// 3 display number of employees per department
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

// 4 display all rejected medical leaves
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

// 5 Remove deductions of resigned employees based on their employment_status. 
app.post("/remove-deductions", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .execute("Remove_Deductions");
        const rowsAffected = Array.isArray(result.rowsAffected)
            ? result.rowsAffected.reduce((sum, val) => sum + (val || 0), 0)
            : 0;
        res.json({
            message: "Resigned employee deductions removed successfully",
            rowsAffected,
            result: result.recordset ?? []
        });        
    } catch (err) {
        console.error("Error removing deductions:", err);
        res.status(500).json({ error: "Failed to remove deductions" });
    }
});


// 6 Update the attendance record for the current day for a certain employee along with the status
app.post("/update-attendance", async (req, res) => {
    const {
        Employee_id,
        employee_ID,
        employeeId,
        check_in_time,
        checkInTime,
        check_in,
        check_out_time,
        checkOutTime,
        check_out
    } = req.body;

    const resolvedEmployeeId = Employee_id ?? employee_ID ?? employeeId;
    if (!resolvedEmployeeId) {
        return res.status(400).json({ error: "employee_ID is required" });
    }

    const parseTime = (value) => {
        if (value === undefined || value === null) return null;
        const asString = typeof value === "string" ? value.trim() : "";
        if (!asString) return null;

        const directMatch = asString.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (directMatch) {
            const hours = parseInt(directMatch[1], 10);
            const minutes = parseInt(directMatch[2], 10);
            const seconds = parseInt(directMatch[3] ?? "0", 10);
            return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
        }

        const fallbackDate = new Date(asString);
        if (!isNaN(fallbackDate.getTime())) {
            return new Date(Date.UTC(1970, 0, 1, fallbackDate.getHours(), fallbackDate.getMinutes(), fallbackDate.getSeconds()));
        }

        return null;
    };

    const resolvedCheckIn = parseTime(check_in_time ?? checkInTime ?? check_in ?? null);
    const resolvedCheckOut = parseTime(check_out_time ?? checkOutTime ?? check_out ?? null);

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_id", sql.Int, resolvedEmployeeId)
            .input("check_in_time", sql.Time, resolvedCheckIn)
            .input("check_out_time", sql.Time, resolvedCheckOut)
            .execute("Update_Attendance");
        res.json({
            message: "Attendance updated successfully",
            result: result.recordset ?? []
        });
        console.log(result);
    } catch (err) {
        console.error("Error updating attendance:", err);
        res.status(500).json({ error: "Failed to update attendance" });
    }
});


// 7 Add a new official holiday 
app.post("/add-holiday", async (req, res) => {
    const { holiday_name, name, from_date, to_date } = req.body;
    const resolvedName = holiday_name ?? name;
    if (!resolvedName || !from_date || !to_date) {
        return res.status(400).json({ error: "holiday_name (or name), from_date, and to_date are required" });
    }
    try {
        const pool = await poolPromise;
        try {
            await pool.request().execute("Create_Holiday");
        } catch (innerErr) {
            const alreadyExists =
                typeof innerErr.message === "string" &&
                innerErr.message.includes("There is already an object named 'Holiday'");
            if (!alreadyExists) {
                throw innerErr;
            }
        }

        const result = await pool
            .request()
            .input("holiday_name", sql.NVarChar, resolvedName)
            .input("from_date", sql.Date, from_date)
            .input("to_date", sql.Date, to_date)
            .execute("Add_Holiday");
        res.json({
            message: "Holiday added successfully",
            result: result.recordset ?? []
        });
        console.log(result);
    } catch (err) {
        console.error("Error adding holiday:", err);
        res.status(500).json({ error: "Failed to add holiday" });
    }
});


// 8 Initiate attendance records for the current day for all employees. 
app.post("/initiate-attendance", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .execute("Initiate_Attendance");
        res.json({
            message: "Attendance records initiated successfully",
            result: result.recordset ?? []
        });
    } catch (err) {
        console.error("Error initiating attendance:", err);
        res.status(500).json({ error: "Failed to initiate attendance" });
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
