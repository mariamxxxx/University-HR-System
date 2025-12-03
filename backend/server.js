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

// Employee Login endpoint
app.post("/api/employee/login", async (req, res) => {
    const { employee_id, password } = req.body;
    
    console.log(`Login attempt - Employee ID: ${employee_id}`);

    try {
        const pool = await poolPromise;
        
        // Use the EmployeeLoginValidation function to check credentials
        const validationResult = await pool
            .request()
            .input("employee_ID", sql.Int, employee_id)
            .input("password", sql.VarChar(50), password)
            .query("SELECT dbo.EmployeeLoginValidation(@employee_ID, @password) as isValid");

        const isValid = validationResult.recordset[0].isValid;
        console.log(`Validation result for employee ${employee_id}: ${isValid}`);

        if (isValid) {
            // Get employee details
            const employeeResult = await pool
                .request()
                .input("employee_ID", sql.Int, employee_id)
                .query(`
                    SELECT employee_id as employee_ID, first_name, last_name, email, address, 
                           gender, official_day_off, years_of_experience, 
                           employment_status, type_of_contract, annual_balance, 
                           accidental_balance, salary, hire_date, dept_name
                    FROM Employee 
                    WHERE employee_id = @employee_ID
                `);

            if (employeeResult.recordset.length > 0) {
                console.log(`Login successful for: ${employeeResult.recordset[0].first_name} ${employeeResult.recordset[0].last_name}`);
                res.json({
                    success: true,
                    message: "Login successful",
                    data: employeeResult.recordset[0]
                });
            } else {
                console.log(`Employee ${employee_id} not found in database`);
                res.json({
                    success: false,
                    message: "Employee not found"
                });
            }
        } else {
            console.log(`Invalid credentials for employee ${employee_id}`);
            res.json({
                success: false,
                message: "Invalid employee ID or password"
            });
        }
    } catch (err) {
        console.error("Error during employee login:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to process login" 
        });
    }
});

// Example: Call your stored procedure
// app.post("/run-procedure", async (req, res) => {
//     const { employee_ID, start_date, end_date } = req.body;

//     try {
//         const pool = await poolPromise;
//         const result = await pool
//             .request()
//             .input("employee_ID", sql.Int, employee_ID)
//             .input("start_date", sql.Date, start_date)
//             .input("end_date", sql.Date, end_date)
//             .execute("Submit_annual");  // <-- your procedure name

//         res.json(result.recordset); // send results back to frontend
//     } catch (err) {
//         console.error("Error executing procedure:", err);
//         res.status(500).json({ error: "Failed to execute procedure" });
//     }
// });

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

// Debug endpoint to check employee IDs and passwords
app.get("/api/debug/employees", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT employee_id, first_name, last_name, email, dept_name FROM Employee WHERE dept_name != 'HR'");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
});

// Get employee performance by semester
app.get("/api/employee/performance/:employeeId/:semester", async (req, res) => {
    const { employeeId, semester } = req.params;
    
    console.log(`Fetching performance for employee ${employeeId}, semester ${semester}`);

    try {
        const pool = await poolPromise;
        
        // First, check if any performance records exist for this employee
        const checkResult = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .query("SELECT * FROM Performance WHERE emp_ID = @employee_ID");
        
        console.log(`Total performance records for employee ${employeeId}: ${checkResult.recordset.length}`);
        if (checkResult.recordset.length > 0) {
            console.log('Sample record:', checkResult.recordset[0]);
        }
        
        // Now query using the function
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .input("period", sql.Char(3), semester)
            .query("SELECT * FROM dbo.MyPerformance(@employee_ID, @period)");

        console.log(`Found ${result.recordset.length} performance records for semester ${semester}`);
        if (result.recordset.length > 0) {
            console.log('Performance data:', result.recordset);
        }
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error fetching performance:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to fetch performance" 
        });
    }
});

// Get employee attendance for current month
app.get("/api/employee/attendance/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    
    console.log(`Fetching attendance for employee ${employeeId}`);

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .query("SELECT * FROM dbo.MyAttendance(@employee_ID)");

        console.log(`Found ${result.recordset.length} attendance records`);
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to fetch attendance" 
        });
    }
});

// Get deductions by attendance for a specific month
app.get("/api/employee/deductions/:employeeId/:month", async (req, res) => {
    const { employeeId, month } = req.params;
    
    console.log(`Fetching deductions for employee ${employeeId}, month ${month}`);

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .input("month", sql.Int, parseInt(month))
            .query("SELECT * FROM dbo.Deductions_Attendance(@employee_ID, @month)");

        console.log(`Found ${result.recordset.length} deduction records`);
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error fetching deductions:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to fetch deductions" 
        });
    }
});

// Submit annual leave
app.post("/api/employee/leave/annual", async (req, res) => {
    const { employee_id, replacement_emp, start_date, end_date } = req.body;
    
    console.log(`Submitting annual leave for employee ${employee_id}`);

    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employee_id))
            .input("replacement_emp", sql.Int, parseInt(replacement_emp))
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .execute("Submit_annual");

        console.log(`Annual leave submitted successfully`);
        res.json({
            success: true,
            message: 'Annual leave submitted successfully'
        });
    } catch (err) {
        console.error("Error submitting annual leave:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to submit annual leave" 
        });
    }
});

// Get leave status
app.get("/api/employee/leave/status/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    
    console.log(`Fetching leave status for employee ${employeeId}`);

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .query("SELECT * FROM dbo.status_leaves(@employee_ID)");

        console.log(`Found ${result.recordset.length} leave status records`);
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error fetching leave status:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to fetch leave status" 
        });
    }
});

// Get last month's payroll
app.get("/api/employee/payroll/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    
    console.log(`Fetching last month payroll for employee ${employeeId}`);

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .query("SELECT * FROM dbo.Last_month_payroll(@employee_ID)");

        console.log(`Found ${result.recordset.length} payroll records`);
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error fetching payroll:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to fetch payroll" 
        });
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
