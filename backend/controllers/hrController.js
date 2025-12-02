const { sql, poolPromise } = require('../config/db');

// HR Login validation
exports.login = async (req, res) => {
  try {
    const { employee_id, password } = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('password', sql.VarChar(50), password)
      .query('SELECT dbo.HRLoginValidation(@employee_id, @password) AS isValid');
    
    if (result.recordset[0].isValid) {
      // Get HR employee details
      const hrResult = await pool.request()
        .input('employee_id', sql.Int, employee_id)
        .query('SELECT * FROM allEmployeeProfiles WHERE employee_ID = @employee_id');
      
      res.json({ 
        success: true, 
        message: 'HR login successful',
        data: hrResult.recordset[0]
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid HR credentials' });
    }
  } catch (error) {
    console.error('HR login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve/Reject Annual or Accidental Leave
exports.approveAnnualAccidental = async (req, res) => {
  try {
    const { request_id, hr_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('request_id', sql.Int, request_id)
      .input('hr_id', sql.Int, hr_id)
      .execute('HR_approval_an_acc');
    
    res.json({ success: true, message: 'Leave processed successfully' });
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve/Reject Unpaid Leave
exports.approveUnpaid = async (req, res) => {
  try {
    const { request_id, hr_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('request_id', sql.Int, request_id)
      .input('hr_id', sql.Int, hr_id)
      .execute('HR_approval_Unpaid');
    
    res.json({ success: true, message: 'Unpaid leave processed successfully' });
  } catch (error) {
    console.error('Error approving unpaid leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve/Reject Compensation Leave
exports.approveCompensation = async (req, res) => {
  try {
    const { request_id, hr_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('request_id', sql.Int, request_id)
      .input('hr_id', sql.Int, hr_id)
      .execute('HR_approval_comp');
    
    res.json({ success: true, message: 'Compensation leave processed successfully' });
  } catch (error) {
    console.error('Error approving compensation leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add payroll for employee
exports.addPayroll = async (req, res) => {
  try {
    const { employee_id, from_date, to_date } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('from_date', sql.Date, from_date)
      .input('to_date', sql.Date, to_date)
      .execute('Add_Payroll');
    
    res.json({ success: true, message: 'Payroll added successfully' });
  } catch (error) {
    console.error('Error adding payroll:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate deductions for hours
exports.deductHours = async (req, res) => {
  try {
    const { employee_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .execute('Deduction_hours');
    
    res.json({ success: true, message: 'Hour deductions calculated' });
  } catch (error) {
    console.error('Error calculating hour deductions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate deductions for days
exports.deductDays = async (req, res) => {
  try {
    const { employee_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .execute('Deduction_days');
    
    res.json({ success: true, message: 'Day deductions calculated' });
  } catch (error) {
    console.error('Error calculating day deductions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate deductions for unpaid leave
exports.deductUnpaid = async (req, res) => {
  try {
    const { employee_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .execute('Deduction_unpaid');
    
    res.json({ success: true, message: 'Unpaid leave deductions calculated' });
  } catch (error) {
    console.error('Error calculating unpaid deductions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { employee_id, check_in_time, check_out_time } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('check_in_time', sql.Time, check_in_time || null)
      .input('check_out_time', sql.Time, check_out_time || null)
      .execute('Update_Attendance');
    
    res.json({ success: true, message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add performance evaluation
exports.addEvaluation = async (req, res) => {
  try {
    const { employee_id, rating, comment, semester } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('rating', sql.Int, rating)
      .input('comment', sql.VarChar(50), comment)
      .input('semester', sql.Char(3), semester)
      .execute('Dean_andHR_Evaluation');
    
    res.json({ success: true, message: 'Evaluation added successfully' });
  } catch (error) {
    console.error('Error adding evaluation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all employee profiles
exports.getAllEmployees = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM allEmployeeProfiles');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all performance records
exports.getAllPerformance = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM allPerformance');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all attendance records (yesterday)
exports.getAllAttendance = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM allEmployeeAttendance');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
