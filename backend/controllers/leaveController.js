const { sql, poolPromise } = require('../config/db');

// Submit annual leave
exports.submitAnnualLeave = async (req, res) => {
  try {
    const { employee_id, replacement_emp, start_date, end_date } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('replacement_emp', sql.Int, replacement_emp)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .execute('Submit_annual');
    
    res.json({ success: true, message: 'Annual leave submitted successfully' });
  } catch (error) {
    console.error('Error submitting annual leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit accidental leave
exports.submitAccidentalLeave = async (req, res) => {
  try {
    const { employee_id, start_date, end_date } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .execute('Submit_accidental');
    
    res.json({ success: true, message: 'Accidental leave submitted successfully' });
  } catch (error) {
    console.error('Error submitting accidental leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit medical leave
exports.submitMedicalLeave = async (req, res) => {
  try {
    const {
      employee_id,
      start_date,
      end_date,
      medical_type,
      insurance_status,
      disability_details,
      document_description,
      file_name
    } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('medical_type', sql.VarChar(50), medical_type)
      .input('insurance_status', sql.Bit, insurance_status)
      .input('disability_details', sql.VarChar(50), disability_details)
      .input('document_description', sql.VarChar(50), document_description)
      .input('file_name', sql.VarChar(50), file_name)
      .execute('Submit_medical');
    
    res.json({ success: true, message: 'Medical leave submitted successfully' });
  } catch (error) {
    console.error('Error submitting medical leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit unpaid leave
exports.submitUnpaidLeave = async (req, res) => {
  try {
    const {
      employee_id,
      start_date,
      end_date,
      document_description,
      file_name
    } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('document_description', sql.VarChar(50), document_description)
      .input('file_name', sql.VarChar(50), file_name)
      .execute('Submit_unpaid');
    
    res.json({ success: true, message: 'Unpaid leave submitted successfully' });
  } catch (error) {
    console.error('Error submitting unpaid leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit compensation leave
exports.submitCompensationLeave = async (req, res) => {
  try {
    const {
      employee_id,
      compensation_date,
      reason,
      date_of_original_workday,
      rep_emp_id
    } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('compensation_date', sql.Date, compensation_date)
      .input('reason', sql.VarChar(50), reason)
      .input('date_of_original_workday', sql.Date, date_of_original_workday)
      .input('rep_emp_id', sql.Int, rep_emp_id)
      .execute('Submit_compensation');
    
    res.json({ success: true, message: 'Compensation leave submitted successfully' });
  } catch (error) {
    console.error('Error submitting compensation leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leave status
exports.getLeaveStatus = async (req, res) => {
  try {
    const { employee_id } = req.params;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .query('SELECT * FROM dbo.status_leaves(@employee_id)');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching leave status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if employee is on leave
exports.checkOnLeave = async (req, res) => {
  try {
    const { employee_id, from_date, to_date } = req.query;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employee_id', sql.Int, employee_id)
      .input('from_date', sql.Date, from_date)
      .input('to_date', sql.Date, to_date)
      .query('SELECT dbo.Is_On_Leave(@employee_id, @from_date, @to_date) AS isOnLeave');
    
    res.json({ success: true, isOnLeave: result.recordset[0].isOnLeave });
  } catch (error) {
    console.error('Error checking leave status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
