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

//display all attendance records for all employees for yesterday
app.get("/yesterday-all-attendance", async (req, res) => {
  try {
        const pool =await poolPromise;
        const result = await pool.request().query('SELECT * FROM allEmployeeAttendance');

        res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//display all performance records for winter semester
app.get("/winter-performance", async (req, res) => {
    try {
        const pool =await poolPromise;
        const result = await pool.request().query('SELECT * FROM allPerformance');

        res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//remove holiday attendance for all employees
app.post('/remove-holiday', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().execute('Remove_Holiday');

    res.json({
      success: true,
      message: "Holiday attendance removed successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//remove day off for a certain employee
app.post('/remove-dayoff', async (req, res) => {
  const { employeeId } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("employee_ID", sql.Int, employeeId)
      .execute("Remove_DayOff");

    res.json({
      success: true,
      message: `Employee day-off records were removed successfully`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//remove approved leave for a certain employee
app.post('/remove-approved-leaves', async (req, res) => {
  const { employeeId } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("employee_ID", sql.Int, employeeId)
      .execute("Remove_Approved_Leaves");

    res.json({
      success: true,
      message: `Employee approved leave records were removed successfully`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Add a new record to employee replace employee
app.post('/employee-replace-employee', async (req, res) => {
  const { emp1, emp2, fromDate, toDate} = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("Emp1_ID", sql.Int, emp1)
      .input("Emp2_ID", sql.Int, emp2)
      .input("from_Date", sql.Date, fromDate)
      .input("to_Date", sql.Date, toDate)
      .execute("Replace_Employee");
    res.json({
      success: true,
      message: `Employee replacement recorded successfully`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Update employee status
app.post('/update-employment-status', async (req, res) => {
  const { employeeId } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("Employee_ID", sql.Int, employeeId)
      .execute("Update_Employment_Status");
    res.json({
      success: true,
      message: `Employment status updated successfully`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
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
