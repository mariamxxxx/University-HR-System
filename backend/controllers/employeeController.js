const { sql, poolPromise } = require('../config/db');

// Login validation for employees
exports.login = async (req, res) => {
  try {
    const { employee_id, password } = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('password', sql.VarChar(50), password)
      .query(`
        SELECT dbo.EmployeeLoginValidation(@employee_id, @password) AS isValid
      `);
    
    if (result.recordset[0].isValid) {
      // Get employee details
      const empResult = await pool.request()
        .input('employee_id', sql.Int, employee_id)
        .query('SELECT * FROM allEmployeeProfiles WHERE employee_ID = @employee_id');
      
      res.json({ 
        success: true, 
        message: 'Login successful',
        data: empResult.recordset[0]
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get employee profile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, id)
      .query('SELECT * FROM allEmployeeProfiles WHERE employee_ID = @employee_id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get employee performance
exports.getPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query; // W24, S24, etc.
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, id)
      .input('period', sql.Char(3), period)
      .query('SELECT * FROM dbo.MyPerformance(@employee_id, @period)');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get employee attendance
exports.getAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, id)
      .query('SELECT * FROM dbo.MyAttendance(@employee_id)');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get last month payroll
exports.getLastPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, id)
      .query('SELECT * FROM dbo.Last_month_payroll(@employee_id)');
    
    res.json({ success: true, data: result.recordset[0] || null });
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get deductions for attendance
exports.getDeductions = async (req, res) => {
  try {
    const { id } = req.params;
    const { month } = req.query;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, id)
      .input('month', sql.Int, month || new Date().getMonth() + 1)
      .query('SELECT * FROM dbo.Deductions_Attendance(@employee_id, @month)');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching deductions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
