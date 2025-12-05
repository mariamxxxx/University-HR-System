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


//-------------------------------------------------- AISEL --------------------------------------------------------//

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

            if (employeeResult.recordset.length > 0) { //recordset is the data returned from the query and has the employee info >0 means we found a matching employee
                console.log(`Login successful for: ${employeeResult.recordset[0].first_name} ${employeeResult.recordset[0].last_name}`); //the $ is used to insert variables into strings
                // get roles for this employee and include them in the response
                // Get roles ordered by Role.rank so the highest role is first
                const rolesResult = await pool
                    .request()
                    .input('employee_ID', sql.Int, employee_id)
                    .query(`SELECT ER.role_name, R.rank
                            FROM Employee_Role ER
                            LEFT JOIN Role R ON ER.role_name = R.role_name
                            WHERE ER.emp_ID = @employee_ID
                            ORDER BY R.rank ASC`); // this query gets the roles for the emp ordered by rank (1 is the highest)

                const roles = rolesResult.recordset.map(r => r.role_name);
                const responseData = { ...employeeResult.recordset[0], roles };

                res.json({
                    success: true,
                    message: "Login successful",
                    data: responseData
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


//-------------------------------------------------- ROKAIA --------------------------------------------------------//

// Get roles for an employee and whether they are an approver (Dean/Vice Dean/President)
app.get('/api/employee/roles/:employeeId', async (req, res) => { //get just gets the data with no modification 
    const { employeeId } = req.params;
    try {
        const pool = await poolPromise;
        // Join with Role to get rank and order by rank ASC so highest-ranked (lowest rank number) appears first
        const result = await pool
            .request()
            .input('employee_ID', sql.Int, parseInt(employeeId))
            .query(`SELECT ER.role_name, R.rank
                    FROM Employee_Role ER
                    LEFT JOIN Role R ON ER.role_name = R.role_name
                    WHERE ER.emp_ID = @employee_ID
                    ORDER BY R.rank ASC`);

        const roles = result.recordset.map(r => r.role_name);
        const primaryRole = roles.length > 0 ? roles[0] : null; // first item is highest role
        const isApprover = roles.some(r => ['Dean', 'Vice Dean', 'President'].includes(r));

        res.json({ success: true, data: { roles, isApprover, role: primaryRole } });
    } catch (err) {
        console.error('Error fetching employee roles:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});


// Submit medical leave
app.post("/submit-medical-leave", async (req, res) => { // (/submit...) is the api url, post is used because it CREATES a new record(leave)
    const { //inputs from frontend or extracting from the frontend 
        employee_ID, 
        start_date, 
        end_date, 
        type,
        insurance_status, 
        disability_details, 
        document_description, 
        file_name 
    } = req.body;

    try {
        const pool = await poolPromise; // waiting for connection to the DB
        await pool
            .request() //creates a new sql request obj 
            .input("employee_ID", sql.Int, employee_ID) //(name of parameter in the db proc, sql datatype, value from the front end)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .input("medical_type", sql.VarChar(50), type)
            .input("insurance_status", sql.Bit, insurance_status === 'yes' ? 1 : 0)
            .input("disability_details", sql.VarChar(50), disability_details || null) // if no details, send null. disability_details is optional (nullable)
            .input("document_description", sql.VarChar(50), document_description)
            .input("file_name", sql.VarChar(50), file_name)
            .execute("Submit_medical"); //this calls the stored proc in the db.sql file 

        res.json({ success: true, message: "Medical leave submitted successfully!" }); // send success response to frontend
    } catch (err) { //handle error
        console.error("Error submitting medical leave:", err);
        res.status(500).json({ error: "Failed to submit medical leave", details: err.message });
    }
});

//submit accidental leave
app.post("/submit-accidental-leave", async (req, res) => {
    const{
        employee_ID,
        start_date,
        end_date, 
    }= req.body;
    try{
        const pool = await poolPromise;
        
        // Calculate number of days
        const numDays = Math.floor((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
        
        // Check if employee has sufficient accidental leave balance
        const balanceResult = await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .query("SELECT accidental_balance FROM Employee WHERE employee_id = @employee_ID");
        
        if (balanceResult.recordset.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        
        const accidentalBalance = balanceResult.recordset[0].accidental_balance;
        
        if (accidentalBalance < numDays) {
            return res.status(400).json({ 
                error: `Insufficient accidental leave balance. You have ${accidentalBalance} day(s) remaining but requested ${numDays} day(s).` 
            });
        }
        
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .execute("Submit_accidental");

        res.json({ success: true, message: "Accidental leave submitted successfully" });
    } catch (err) {
        console.error("Error submitting accidental leave:", err);
        res.status(500).json({ error: "Failed to submit accidental leave", details: err.message });
    }
});

// Submit annual leave
app.post("/submit-annual-leave", async (req, res) => {
    const {
        employee_ID,
        start_date,
        end_date,
        replacement_emp
    } = req.body;

    console.log(`Annual leave submission - Employee: ${employee_ID}, Dates: ${start_date} to ${end_date}, Replacement: ${replacement_emp}`);

    // Validate required fields
    if (!employee_ID || !start_date || !end_date || !replacement_emp) {
        console.log("Missing required fields");
        return res.status(400).json({ 
            error: "Missing required fields", 
            details: "employee_ID, start_date, end_date, and replacement_emp are required" 
        });
    }

    try {
        const pool = await poolPromise;
        
        // Check employee's annual leave balance
        const employeeResult = await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .query("SELECT annual_balance, type_of_contract FROM Employee WHERE employee_id = @employee_ID");
        
        if (employeeResult.recordset.length === 0) {
            console.log(`Employee ${employee_ID} not found`);
            return res.status(404).json({ error: "Employee not found" });
        }

        const employee = employeeResult.recordset[0];
        
        if (employee.type_of_contract !== 'full_time') {
            console.log(`Employee ${employee_ID} is not full-time`);
            return res.status(400).json({ error: "Only full-time employees can apply for annual leave" });
        }

        const numDays = Math.floor((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;

        if (employee.annual_balance < numDays) {
            console.log(`Insufficient balance: ${employee.annual_balance} < ${numDays}`);
            return res.status(400).json({ 
                error: `Insufficient annual leave balance. You have ${employee.annual_balance} day(s) remaining but requested ${numDays} day(s).` 
            });
        }

        // Check replacement employee exists
        const replacementResult = await pool
            .request()
            .input("replacement_emp", sql.Int, replacement_emp)
            .query("SELECT employee_id FROM Employee WHERE employee_id = @replacement_emp");
        
        if (replacementResult.recordset.length === 0) {
            console.log(`Replacement employee ${replacement_emp} not found`);
            return res.status(404).json({ error: `Replacement employee ${replacement_emp} not found` });
        }

        const result = await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("replacement_emp", sql.Int, replacement_emp)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .execute("Submit_annual");

        console.log(`Annual leave submitted successfully for employee ${employee_ID}`);
        res.json({ success: true, message: "Annual leave submitted successfully" });
    } catch (err) {
        console.error("Error submitting annual leave:", err);
        res.status(500).json({ error: "Failed to submit annual leave", details: err.message });
    }
});

//submit unpaid leave
app.post("/submit-unpaid-leave", async (req, res) => {
    const{
        employee_ID,
        start_date,
        end_date,
        document_description,
        file_name
    } = req.body;
    
    // Validate 30-day limit
    const numDays = Math.floor((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
    if (numDays > 30) {
        return res.status(400).json({ error: "Unpaid leave cannot exceed 30 days" });
    }
    
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .input("document_description", sql.VarChar(50), document_description)
            .input("file_name", sql.VarChar(50), file_name)
            .execute("Submit_unpaid");

        res.json({ success: true, message: "Unpaid leave submitted successfully" });
    } catch (err) {
        console.error("Error submitting unpaid leave:", err);
        res.status(500).json({ error: "Failed to submit unpaid leave", details: err.message });
    }
});
//compensation leave
app.post("/submit-compensation-leave", async (req, res) => {
    const{
        employee_ID,
        compensation_date,
        reason,
        date_of_original_workday,
        replacement_emp
    } = req.body;
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("compensation_date", sql.Date, compensation_date)
            .input("reason", sql.VarChar(50), reason)
            .input("date_of_original_workday", sql.Date, date_of_original_workday)
            .input("rep_emp_id", sql.Int, replacement_emp)
            .execute("Submit_compensation");

        res.json({ success: true, message: "Compensation leave submitted successfully" });
    } catch (err) {
        console.error("Error submitting compensation leave:", err);
        res.status(500).json({ error: "Failed to submit compensation leave", details: err.message });
    }
});

// Approve/Reject unpaid leave (Dean/Vice-Dean/President)
app.post("/approve-unpaid-leave", async (req, res) => {
    const { request_ID, upperboard_ID } = req.body;
    
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("request_ID", sql.Int, request_ID)
            .input("upperboard_ID", sql.Int, upperboard_ID)
            .execute("Upperboard_approve_unpaids");

        res.json({ success: true, message: "Unpaid leave processed successfully" });
    } catch (err) {
        console.error("Error approving unpaid leave:", err);
        res.status(500).json({ error: "Failed to process unpaid leave", details: err.message });
    }
});

// Approve/Reject annual leave (Dean/Vice-Dean/President)
app.post("/approve-annual-leave", async (req, res) => {
    const { request_ID, upperboard_ID, replacement_ID } = req.body;
    
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("request_ID", sql.Int, request_ID)
            .input("Upperboard_ID", sql.Int, upperboard_ID)
            .input("replacement_ID", sql.Int, replacement_ID)
            .execute("Upperboard_approve_annual");

        res.json({ success: true, message: "Annual leave processed successfully" });
    } catch (err) {
        console.error("Error approving annual leave:", err);
        res.status(500).json({ error: "Failed to process annual leave", details: err.message });
    }
});

// Dean/HR evaluate employee
app.post("/evaluate-employee", async (req, res) => {
    const { employee_ID, rating, comment, semester } = req.body;
    
    console.log(`Evaluating employee ${employee_ID}: rating=${rating}, comment=${comment}, semester=${semester}`);
    
    // Validation
    if (!employee_ID || !rating || semester === undefined) {
        return res.status(400).json({ 
            error: "Missing required fields", 
            details: "employee_ID, rating, and semester are required" 
        });
    }
    
    if (isNaN(parseInt(employee_ID)) || isNaN(parseInt(rating))) {
        return res.status(400).json({ 
            error: "Invalid data types", 
            details: "employee_ID and rating must be numbers" 
        });
    }
    
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employee_ID))
            .input("rating", sql.Int, parseInt(rating))
            .input("comment", sql.VarChar(50), comment || '')
            .input("semester", sql.Char(3), (semester || '').trim())
            .execute("Dean_andHR_Evaluation");

        console.log(`Evaluation inserted successfully for employee ${employee_ID}`);
        
        // Verify the evaluation was saved by querying it back
        const verify = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employee_ID))
            .query("SELECT TOP 1 * FROM Performance WHERE emp_ID = @employee_ID ORDER BY performance_ID DESC");
        
        console.log(`Verification query result:`, verify.recordset);

        res.json({ success: true, message: "Employee evaluation submitted successfully", data: verify.recordset[0] || null });
    } catch (err) {
        console.error("Error submitting evaluation:", err.message);
        console.error("SQL Error details:", err);
        res.status(500).json({ 
            error: "Failed to submit evaluation", 
            details: err.message,
            errorNumber: err.number
        });
    }
});

// Get pending approvals for a Dean/VP/President
app.get("/api/pending-approvals/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    console.log(`Fetching pending approvals for employee: ${employeeId}`);

    try {
        const pool = await poolPromise;
        
        // Get the approver's department
        const approverResult = await pool
            .request()
            .input("employee_ID", sql.Int, parseInt(employeeId))
            .query("SELECT dept_name FROM Employee WHERE employee_id = @employee_ID");
        
        if (approverResult.recordset.length === 0) {
            console.log(`Employee ${employeeId} not found`);
            return res.status(404).json({ error: "Approver not found" });
        }
        
        const approverDept = approverResult.recordset[0].dept_name;
        console.log(`Approver department: ${approverDept}`);
        
        // Get all leave requests (unpaid and annual) from employees in the same department that are pending
        const result = await pool
            .request()
            .input("dept_name", sql.VarChar(50), approverDept)
            .input("approver_ID", sql.Int, parseInt(employeeId))
            .query(`
                SELECT 
                    L.request_ID as Leave_ID,
                    L.start_date,
                    L.end_date,
                    L.num_days,
                    L.final_approval_status,
                    E.employee_id as Emp_ID,
                    E.first_name,
                    E.last_name,
                    E.dept_name,
                    EAL.status as approval_status,
                    'unpaid' as leave_type,
                    NULL as replacement_emp
                FROM Leave L
                INNER JOIN Unpaid_Leave U ON L.request_ID = U.request_ID
                INNER JOIN Employee E ON U.Emp_ID = E.employee_id
                INNER JOIN Employee_Approve_Leave EAL ON L.request_ID = EAL.leave_ID
                WHERE E.dept_name = @dept_name
                    AND EAL.Emp1_ID = @approver_ID
                    AND EAL.status = 'Pending'
                    AND L.final_approval_status = 'Pending'
                
                UNION ALL
                
                SELECT 
                    L.request_ID as Leave_ID,
                    L.start_date,
                    L.end_date,
                    L.num_days,
                    L.final_approval_status,
                    E.employee_id as Emp_ID,
                    E.first_name,
                    E.last_name,
                    E.dept_name,
                    EAL.status as approval_status,
                    'annual' as leave_type,
                    A.replacement_emp
                FROM Leave L
                INNER JOIN Annual_Leave A ON L.request_ID = A.request_ID
                INNER JOIN Employee E ON A.Emp_ID = E.employee_id
                INNER JOIN Employee_Approve_Leave EAL ON L.request_ID = EAL.leave_ID
                WHERE E.dept_name = @dept_name
                    AND EAL.Emp1_ID = @approver_ID
                    AND EAL.status = 'Pending'
                    AND L.final_approval_status = 'Pending'
                
                ORDER BY Leave_ID DESC
            `);
        
        console.log(`Found ${result.recordset.length} pending approvals for employee ${employeeId}`);
        console.log("Approval records:", result.recordset);
        
        const approvals = result.recordset.map(row => ({
            Leave_ID: row.Leave_ID,
            Emp1_ID: parseInt(employeeId),
            Emp_ID: row.Emp_ID,
            requestor: `${row.first_name} ${row.last_name}`,
            leave: {
                start_date: row.start_date,
                end_date: row.end_date,
                num_days: row.num_days,
                type: row.leave_type,
                replacement_emp: row.replacement_emp
            },
            leaveType: row.leave_type === 'annual' ? 'Annual Leave' : 'Unpaid Leave',
            status: row.approval_status
        }));
        
        res.json({ success: true, data: approvals });
    } catch (err) {
        console.error("Error fetching pending approvals:", err);
        res.status(500).json({ error: "Failed to fetch pending approvals", details: err.message });
    }
});



//-------------------------------------------------- MARIAM --------------------------------------------------------//

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
        res.json(result.recordset);
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

//-------------------------------------------------- DANA --------------------------------------------------------//





//-------------------------------------------------- HEND --------------------------------------------------------//

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
