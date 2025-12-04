// server.js
const express = require("express");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
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


    //3ak dana <3

// HR Login endpoint
app.post("/hr-login", async (req, res) => {
    const { employee_ID, password } = req.body;
    
    console.log(`Login attempt - Employee ID: ${employee_ID}`);

    try {
        const pool = await poolPromise;
        
        // Use the EmployeeLoginValidation function to check credentials
        const validationResult = await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("password", sql.VarChar(50), password)
            .query("SELECT dbo.HRLoginValidation(@employee_ID, @password) as isValid");

        const isValid = validationResult.recordset[0].isValid;
        console.log(`Validation result for employee ${employee_ID}: ${isValid}`);

        if (isValid) {
            // Get employee details
            const employeeResult = await pool
                .request()
                .input("employee_ID", sql.Int, employee_ID)
                .query(`
                    SELECT e.*, d.name as dept_name, d.building_location 
                        FROM Employee e 
                        LEFT JOIN Department d 
                        ON e.dept_name = d.name 
                        WHERE e.employee_id = @employee_ID
                `);

            if (employeeResult.recordset.length > 0) {
                console.log(`Login successful for: ${employeeResult.recordset[0].first_name} ${employeeResult.recordset[0].last_name}`);
                res.json({
                    success: true,
                    message: "Login successful",
                    data: employeeResult.recordset[0]
                });
            } else {
                console.log(`Employee ${employee_ID} not found in database`);
                res.json({
                    success: false,
                    message: "Employee not found"
                });
            }
        } else {
            console.log(`Invalid credentials for employee ${employee_ID}`);
            res.json({
                success: false,
                message: "Invalid ID or password"
            });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ 
            success: false,
            message: err.message,
            error: "Failed to process login" 
        });
    }
});


// Get pending leaves for HR approval - UPDATED

// 2. HR Approve/Reject Annual or Accidental Leave
app.post("/approve-annual-accidental", async (req, res) => {
    const { request_ID, HR_ID, leave_type } = req.body;

    if (!request_ID || !HR_ID) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("request_ID", sql.Int, request_ID)
            .input("HR_ID", sql.Int, HR_ID)
            .execute("HR_approval_an_acc");
            
        res.json({ success: true, message: "Leave processed successfully" });
    } catch (err) {
        console.error("Error approving leave:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// 3. HR Approve/Reject Unpaid Leave
app.post("/approve-unpaid", async (req, res) => {
    const { request_ID, HR_ID, leave_type } = req.body;

    
    if (!request_ID || !HR_ID) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("request_ID", sql.Int, request_ID)
            .input("HR_ID", sql.Int, HR_ID)
            .execute("HR_approval_Unpaid");
            
        res.json({ success: true, message: "Unpaid leave processed successfully" });
    } catch (err) {
        console.error("Error processing unpaid leave:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// 4. HR Approve/Reject Compensation Leave
app.post("/approve-compensation", async (req, res) => {
    const { request_ID, HR_ID, leave_type } = req.body;

    
    if (!request_ID || !HR_ID) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("request_ID", sql.Int, request_ID)
            .input("HR_ID", sql.Int, HR_ID)
            .execute("HR_approval_comp");
            
        res.json({ success: true, message: "Compensation leave processed successfully" });
    } catch (err) {
        console.error("Error processing compensation leave:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// 5. Add Deduction for Missing Hours
app.post("/api/hr/deduction-hours", async (req, res) => {
    const { employee_ID } = req.body;
    
    if (!employee_ID) {
        return res.status(400).json({ success: false, message: "Missing employee ID" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .execute("Deduction_hours");
            
        res.json({ success: true, message: "Deduction for missing hours added successfully" });
    } catch (err) {
        console.error("Error adding hours deduction:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// 6. Add Deduction for Missing Days
app.post("/api/hr/deduction-days", async (req, res) => {
    const { employee_ID } = req.body;
    
    if (!employee_ID) {
        return res.status(400).json({ success: false, message: "Missing employee ID" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .execute("Deduction_days");
            
        res.json({ success: true, message: "Deduction for missing days added successfully" });
    } catch (err) {
        console.error("Error adding days deduction:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// 7. Add Deduction for Unpaid Leave
app.post("/api/hr/deduction-unpaid", async (req, res) => {
    const { employee_ID } = req.body;
    
    if (!employee_ID) {
        return res.status(400).json({ success: false, message: "Missing employee ID" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .execute("Deduction_unpaid");
            
        res.json({ success: true, message: "Deduction for unpaid leave added successfully" });
    } catch (err) {
        console.error("Error adding unpaid deduction:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// 8. Generate Payroll
app.post("/api/hr/generate-payroll", async (req, res) => {
    const { employee_ID, from_date, to_date } = req.body;
    
    if (!employee_ID || !from_date || !to_date) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    
    try {
        const pool = await poolPromise;
        
        // Call the stored procedure
        await pool
            .request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("from", sql.Date, from_date)
            .input("to", sql.Date, to_date)
            .execute("Add_Payroll");
            
        res.json({ success: true, message: "Payroll generated successfully" });
    } catch (err) {
        console.error("Error generating payroll:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
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