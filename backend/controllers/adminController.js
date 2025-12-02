const { sql, poolPromise } = require('../config/db');

// Approve annual leave (Dean/Upperboard)
exports.approveAnnualLeave = async (req, res) => {
  try {
    const { request_id, upperboard_id, replacement_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('request_id', sql.Int, request_id)
      .input('upperboard_id', sql.Int, upperboard_id)
      .input('replacement_id', sql.Int, replacement_id)
      .execute('Upperboard_approve_annual');
    
    res.json({ success: true, message: 'Annual leave approved successfully' });
  } catch (error) {
    console.error('Error approving annual leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve unpaid leave (Upperboard)
exports.approveUnpaidLeave = async (req, res) => {
  try {
    const { request_id, upperboard_id } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('request_id', sql.Int, request_id)
      .input('upperboard_id', sql.Int, upperboard_id)
      .execute('Upperboard_approve_unpaids');
    
    res.json({ success: true, message: 'Unpaid leave approved successfully' });
  } catch (error) {
    console.error('Error approving unpaid leave:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get department employee count
exports.getDepartmentStats = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM NoEmployeeDept');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new department
exports.addDepartment = async (req, res) => {
  try {
    const { name, building_location } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.VarChar(50), name)
      .input('building_location', sql.VarChar(50), building_location)
      .query('INSERT INTO Department (name, building_location) VALUES (@name, @building_location)');
    
    res.json({ success: true, message: 'Department added successfully' });
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new role
exports.addRole = async (req, res) => {
  try {
    const {
      role_name,
      title,
      description,
      rank,
      base_salary,
      percentage_YOE,
      percentage_overtime,
      annual_balance,
      accidental_balance
    } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('role_name', sql.VarChar(50), role_name)
      .input('title', sql.VarChar(50), title)
      .input('description', sql.VarChar(50), description)
      .input('rank', sql.Int, rank)
      .input('base_salary', sql.Decimal(10, 2), base_salary)
      .input('percentage_YOE', sql.Decimal(4, 2), percentage_YOE)
      .input('percentage_overtime', sql.Decimal(4, 2), percentage_overtime)
      .input('annual_balance', sql.Int, annual_balance)
      .input('accidental_balance', sql.Int, accidental_balance)
      .query(`
        INSERT INTO Role (
          role_name, title, description, rank, base_salary,
          percentage_YOE, percentage_overtime, annual_balance, accidental_balance
        ) VALUES (
          @role_name, @title, @description, @rank, @base_salary,
          @percentage_YOE, @percentage_overtime, @annual_balance, @accidental_balance
        )
      `);
    
    res.json({ success: true, message: 'Role added successfully' });
  } catch (error) {
    console.error('Error adding role:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add holiday
exports.addHoliday = async (req, res) => {
  try {
    const { holiday_name, from_date, to_date } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('holiday_name', sql.VarChar(50), holiday_name)
      .input('from_date', sql.Date, from_date)
      .input('to_date', sql.Date, to_date)
      .execute('Add_Holiday');
    
    res.json({ success: true, message: 'Holiday added successfully' });
  } catch (error) {
    console.error('Error adding holiday:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Replace employee
exports.replaceEmployee = async (req, res) => {
  try {
    const { emp1_id, emp2_id, from_date, to_date } = req.body;
    
    const pool = await poolPromise;
    await pool.request()
      .input('emp1_id', sql.Int, emp1_id)
      .input('emp2_id', sql.Int, emp2_id)
      .input('from_date', sql.Date, from_date)
      .input('to_date', sql.Date, to_date)
      .execute('Replace_employee');
    
    res.json({ success: true, message: 'Employee replacement added successfully' });
  } catch (error) {
    console.error('Error replacing employee:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Department');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Role');
    
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
