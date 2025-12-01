import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as db from './db-operations.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Initialize counters on startup
await db.initializeCounters();

// ==================== ADMIN ENDPOINTS ====================

// Admin login (hardcoded)
app.post('/make-server-a764e3d7/admin/login', async (c) => {
  try {
    const { adminId, password } = await c.req.json();
    
    if (adminId === 'admin' && password === 'admin123') {
      return c.json({ success: true, message: 'Admin login successful' });
    }
    
    return c.json({ success: false, message: 'Invalid admin credentials' }, 401);
  } catch (error) {
    console.log('Error during admin login:', error);
    return c.json({ success: false, message: `Admin login error: ${error}` }, 500);
  }
});

// Get all employee profiles
app.get('/make-server-a764e3d7/admin/employees', async (c) => {
  try {
    const employees = await db.getAllEmployees();
    return c.json({ success: true, data: employees });
  } catch (error) {
    console.log('Error fetching employees:', error);
    return c.json({ success: false, message: `Error fetching employees: ${error}` }, 500);
  }
});

// Get number of employees per department
app.get('/make-server-a764e3d7/admin/employees-per-department', async (c) => {
  try {
    const employees = await db.getAllEmployees();
    const departments = await db.getAllDepartments();
    
    const counts: any = {};
    departments.forEach(dept => {
      counts[dept.name] = 0;
    });
    
    employees.forEach(emp => {
      if (emp.dept_name && counts[emp.dept_name] !== undefined) {
        counts[emp.dept_name]++;
      }
    });
    
    const result = Object.entries(counts).map(([dept_name, count]) => ({
      dept_name,
      Number_of_Employees: count
    }));
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Error fetching employee counts:', error);
    return c.json({ success: false, message: `Error fetching employee counts: ${error}` }, 500);
  }
});

// Get all rejected medical leaves
app.get('/make-server-a764e3d7/admin/rejected-medical-leaves', async (c) => {
  try {
    const leaves = await db.getAllLeaves();
    const rejectedMedical = [];
    
    for (const leave of leaves) {
      if (leave.final_approval_status === 'rejected') {
        const medicalLeave = await db.getMedicalLeaveByLeaveId(leave.request_ID);
        if (medicalLeave) {
          rejectedMedical.push({ ...leave, ...medicalLeave });
        }
      }
    }
    
    return c.json({ success: true, data: rejectedMedical });
  } catch (error) {
    console.log('Error fetching rejected medical leaves:', error);
    return c.json({ success: false, message: `Error fetching rejected medical leaves: ${error}` }, 500);
  }
});

// Remove deductions for resigned employees
app.post('/make-server-a764e3d7/admin/remove-resigned-deductions', async (c) => {
  try {
    const employees = await db.getAllEmployees();
    const resignedEmployees = employees.filter(e => e.employment_status === 'resigned');
    const deductions = await db.getAllDeductions();
    
    let removedCount = 0;
    for (const deduction of deductions) {
      if (resignedEmployees.some(e => e.employee_ID === deduction.emp_ID)) {
        await db.deleteDeduction(deduction.deduction_ID);
        removedCount++;
      }
    }
    
    return c.json({ success: true, message: `Removed ${removedCount} deductions for resigned employees` });
  } catch (error) {
    console.log('Error removing deductions:', error);
    return c.json({ success: false, message: `Error removing deductions: ${error}` }, 500);
  }
});

// Update attendance for current day
app.post('/make-server-a764e3d7/admin/update-attendance', async (c) => {
  try {
    const { employee_ID, check_in_time, check_out_time } = await c.req.json();
    
    if (!employee_ID) {
      return c.json({ success: false, message: 'Employee ID is required' }, 400);
    }
    
    const currentDate = db.getCurrentDate();
    const attendance = await db.getAttendanceByEmpAndDate(employee_ID, currentDate);
    
    if (!attendance) {
      return c.json({ success: false, message: 'No attendance record found for today' }, 404);
    }
    
    const totalDuration = db.calculateTotalDuration(check_in_time, check_out_time);
    const status = check_in_time ? 'attended' : 'absent';
    
    await db.updateAttendance(attendance.attendance_ID, {
      check_in_time,
      check_out_time,
      total_duration: totalDuration,
      status
    });
    
    return c.json({ success: true, message: 'Attendance updated successfully' });
  } catch (error) {
    console.log('Error updating attendance:', error);
    return c.json({ success: false, message: `Error updating attendance: ${error}` }, 500);
  }
});

// Add official holiday
app.post('/make-server-a764e3d7/admin/add-holiday', async (c) => {
  try {
    const { name, from_date, to_date } = await c.req.json();
    
    if (!name || !from_date || !to_date) {
      return c.json({ success: false, message: 'Name, from_date, and to_date are required' }, 400);
    }
    
    const holiday = await db.createHoliday({ name, from_date, to_date });
    return c.json({ success: true, message: 'Holiday added successfully', data: holiday });
  } catch (error) {
    console.log('Error adding holiday:', error);
    return c.json({ success: false, message: `Error adding holiday: ${error}` }, 500);
  }
});

// Initialize attendance for current day
app.post('/make-server-a764e3d7/admin/initiate-attendance', async (c) => {
  try {
    const employees = await db.getAllEmployees();
    const currentDate = db.getCurrentDate();
    let count = 0;
    
    for (const emp of employees) {
      const existing = await db.getAttendanceByEmpAndDate(emp.employee_ID, currentDate);
      if (!existing) {
        await db.createAttendance({
          date: currentDate,
          check_in_time: null,
          check_out_time: null,
          total_duration: null,
          emp_ID: emp.employee_ID,
          status: 'absent'
        });
        count++;
      }
    }
    
    return c.json({ success: true, message: `Initiated attendance for ${count} employees` });
  } catch (error) {
    console.log('Error initiating attendance:', error);
    return c.json({ success: false, message: `Error initiating attendance: ${error}` }, 500);
  }
});

// Get yesterday's attendance
app.get('/make-server-a764e3d7/admin/yesterday-attendance', async (c) => {
  try {
    const yesterdayDate = db.getYesterdayDate();
    const allAttendance = await db.getAllAttendance();
    const yesterdayAttendance = allAttendance.filter(a => a.date === yesterdayDate);
    
    const result = [];
    for (const att of yesterdayAttendance) {
      const emp = await db.getEmployeeById(att.emp_ID);
      if (emp) {
        result.push({
          'Employee Name': `${emp.first_name} ${emp.last_name}`,
          ...att
        });
      }
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Error fetching yesterday attendance:', error);
    return c.json({ success: false, message: `Error fetching yesterday attendance: ${error}` }, 500);
  }
});

// Get performance for Winter semesters
app.get('/make-server-a764e3d7/admin/winter-performance', async (c) => {
  try {
    const allPerformance = await db.getAllPerformance();
    const winterPerformance = allPerformance.filter(p => p.semester && p.semester.startsWith('W'));
    
    const result = [];
    for (const perf of winterPerformance) {
      const emp = await db.getEmployeeById(perf.emp_ID);
      if (emp) {
        result.push({
          'Employee Name': `${emp.first_name} ${emp.last_name}`,
          ...perf
        });
      }
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Error fetching winter performance:', error);
    return c.json({ success: false, message: `Error fetching winter performance: ${error}` }, 500);
  }
});

// Remove attendance during official holidays
app.post('/make-server-a764e3d7/admin/remove-holiday-attendance', async (c) => {
  try {
    const holidays = await db.getAllHolidays();
    const allAttendance = await db.getAllAttendance();
    let removedCount = 0;
    
    for (const att of allAttendance) {
      for (const holiday of holidays) {
        if (db.isDateInRange(att.date, holiday.from_date, holiday.to_date)) {
          await db.deleteAttendance(att.attendance_ID);
          removedCount++;
          break;
        }
      }
    }
    
    return c.json({ success: true, message: `Removed ${removedCount} attendance records during holidays` });
  } catch (error) {
    console.log('Error removing holiday attendance:', error);
    return c.json({ success: false, message: `Error removing holiday attendance: ${error}` }, 500);
  }
});

// Remove unattended day-off for employee
app.post('/make-server-a764e3d7/admin/remove-dayoff', async (c) => {
  try {
    const { employee_ID } = await c.req.json();
    
    if (!employee_ID) {
      return c.json({ success: false, message: 'Employee ID is required' }, 400);
    }
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const currentMonth = db.getCurrentMonth();
    const allAttendance = await db.getAllAttendance();
    let removedCount = 0;
    
    for (const att of allAttendance) {
      if (att.emp_ID === employee_ID && 
          att.status === 'absent' &&
          new Date(att.date).getMonth() + 1 === currentMonth &&
          db.getDayOfWeek(att.date) === employee.official_day_off) {
        await db.deleteAttendance(att.attendance_ID);
        removedCount++;
      }
    }
    
    return c.json({ success: true, message: `Removed ${removedCount} unattended day-off records` });
  } catch (error) {
    console.log('Error removing day-off:', error);
    return c.json({ success: false, message: `Error removing day-off: ${error}` }, 500);
  }
});

// Remove approved leaves from attendance
app.post('/make-server-a764e3d7/admin/remove-approved-leaves', async (c) => {
  try {
    const { employee_ID } = await c.req.json();
    
    if (!employee_ID) {
      return c.json({ success: false, message: 'Employee ID is required' }, 400);
    }
    
    const leaves = await db.getAllLeaves();
    const allAttendance = await db.getAllAttendance();
    let removedCount = 0;
    
    for (const leave of leaves) {
      if (leave.final_approval_status !== 'approved') continue;
      
      const annualLeave = await db.getAnnualLeaveByLeaveId(leave.request_ID);
      const accidentalLeave = await db.getAccidentalLeaveByLeaveId(leave.request_ID);
      const medicalLeave = await db.getMedicalLeaveByLeaveId(leave.request_ID);
      const unpaidLeave = await db.getUnpaidLeaveByLeaveId(leave.request_ID);
      const compensationLeave = await db.getCompensationLeaveByLeaveId(leave.request_ID);
      
      const belongsToEmployee = 
        (annualLeave && annualLeave.emp_ID === employee_ID) ||
        (accidentalLeave && accidentalLeave.emp_ID === employee_ID) ||
        (medicalLeave && medicalLeave.Emp_ID === employee_ID) ||
        (unpaidLeave && unpaidLeave.emp_ID === employee_ID) ||
        (compensationLeave && compensationLeave.emp_ID === employee_ID);
      
      if (!belongsToEmployee) continue;
      
      for (const att of allAttendance) {
        if (db.isDateInRange(att.date, leave.start_date, leave.end_date)) {
          await db.deleteAttendance(att.attendance_ID);
          removedCount++;
        }
      }
    }
    
    return c.json({ success: true, message: `Removed ${removedCount} attendance records for approved leaves` });
  } catch (error) {
    console.log('Error removing approved leaves:', error);
    return c.json({ success: false, message: `Error removing approved leaves: ${error}` }, 500);
  }
});

// Replace employee
app.post('/make-server-a764e3d7/admin/replace-employee', async (c) => {
  try {
    const { Emp1_ID, Emp2_ID, from_date, to_date } = await c.req.json();
    
    if (!Emp1_ID || !Emp2_ID || !from_date || !to_date) {
      return c.json({ success: false, message: 'All fields are required' }, 400);
    }
    
    const emp1 = await db.getEmployeeById(Emp1_ID);
    const emp2 = await db.getEmployeeById(Emp2_ID);
    
    if (!emp1 || !emp2) {
      return c.json({ success: false, message: 'One or both employees not found' }, 404);
    }
    
    const replacement = await db.createEmployeeReplace({ Emp1_ID, Emp2_ID, from_date, to_date });
    return c.json({ success: true, message: 'Employee replacement recorded successfully', data: replacement });
  } catch (error) {
    console.log('Error replacing employee:', error);
    return c.json({ success: false, message: `Error replacing employee: ${error}` }, 500);
  }
});

// Update employment status based on leave
app.post('/make-server-a764e3d7/admin/update-employment-status', async (c) => {
  try {
    const { employee_ID } = await c.req.json();
    
    if (!employee_ID) {
      return c.json({ success: false, message: 'Employee ID is required' }, 400);
    }
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const currentDate = db.getCurrentDate();
    const isOnLeave = await db.isOnLeave(employee_ID, currentDate, currentDate);
    
    const newStatus = isOnLeave ? 'onleave' : 'active';
    await db.updateEmployee(employee_ID, { employment_status: newStatus });
    
    return c.json({ success: true, message: `Employment status updated to ${newStatus}` });
  } catch (error) {
    console.log('Error updating employment status:', error);
    return c.json({ success: false, message: `Error updating employment status: ${error}` }, 500);
  }
});

// ==================== EMPLOYEE ENDPOINTS ====================

// Employee login
app.post('/make-server-a764e3d7/employee/login', async (c) => {
  try {
    const { employee_ID, password } = await c.req.json();
    
    const employee = await db.getEmployeeById(parseInt(employee_ID));
    
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    if (employee.password !== password) {
      return c.json({ success: false, message: 'Invalid password' }, 401);
    }
    
    return c.json({ success: true, message: 'Login successful', data: employee });
  } catch (error) {
    console.log('Error during employee login:', error);
    return c.json({ success: false, message: `Employee login error: ${error}` }, 500);
  }
});

// Get employee performance
app.get('/make-server-a764e3d7/employee/:id/performance/:semester', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('id'));
    const semester = c.req.param('semester');
    
    const allPerformance = await db.getAllPerformance();
    const performance = allPerformance.filter(p => p.emp_ID === employeeId && p.semester === semester);
    
    return c.json({ success: true, data: performance });
  } catch (error) {
    console.log('Error fetching performance:', error);
    return c.json({ success: false, message: `Error fetching performance: ${error}` }, 500);
  }
});

// Get employee attendance for current month (excluding unattended day-off)
app.get('/make-server-a764e3d7/employee/:id/attendance', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('id'));
    const employee = await db.getEmployeeById(employeeId);
    
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const currentMonth = db.getCurrentMonth();
    const allAttendance = await db.getAllAttendance();
    
    const attendance = allAttendance.filter(a => {
      const attMonth = new Date(a.date).getMonth() + 1;
      const isDayOff = a.status === 'absent' && db.getDayOfWeek(a.date) === employee.official_day_off;
      return a.emp_ID === employeeId && attMonth === currentMonth && !isDayOff;
    });
    
    return c.json({ success: true, data: attendance });
  } catch (error) {
    console.log('Error fetching attendance:', error);
    return c.json({ success: false, message: `Error fetching attendance: ${error}` }, 500);
  }
});

// Get last month's payroll
app.get('/make-server-a764e3d7/employee/:id/payroll/last-month', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('id'));
    const allPayroll = await db.getAllPayroll();
    
    const lastMonth = db.getCurrentMonth() - 1;
    const payroll = allPayroll.filter(p => {
      const payrollMonth = new Date(p.from_date).getMonth() + 1;
      return p.emp_ID === employeeId && payrollMonth === lastMonth;
    });
    
    return c.json({ success: true, data: payroll });
  } catch (error) {
    console.log('Error fetching payroll:', error);
    return c.json({ success: false, message: `Error fetching payroll: ${error}` }, 500);
  }
});

// Get attendance deductions for a period
app.get('/make-server-a764e3d7/employee/:id/deductions/:month', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('id'));
    const month = parseInt(c.req.param('month'));
    
    const allDeductions = await db.getAllDeductions();
    const deductions = allDeductions.filter(d => {
      const dedMonth = new Date(d.date).getMonth() + 1;
      return d.emp_ID === employeeId && dedMonth === month && d.type === 'missing_days';
    });
    
    return c.json({ success: true, data: deductions });
  } catch (error) {
    console.log('Error fetching deductions:', error);
    return c.json({ success: false, message: `Error fetching deductions: ${error}` }, 500);
  }
});

// Submit annual leave
app.post('/make-server-a764e3d7/employee/submit-annual-leave', async (c) => {
  try {
    const { employee_ID, replacement_emp, start_date, end_date } = await c.req.json();
    
    if (!employee_ID || !start_date || !end_date) {
      return c.json({ success: false, message: 'Employee ID, start date, and end date are required' }, 400);
    }
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    if (employee.type_of_contract !== 'full_time') {
      return c.json({ success: false, message: 'Only full-time employees can apply for annual leave' }, 400);
    }
    
    const isOnLeave = await db.isOnLeave(employee_ID, start_date, end_date);
    if (isOnLeave) {
      return c.json({ success: false, message: 'You already have a leave during this period' }, 400);
    }
    
    if (replacement_emp) {
      const replacement = await db.getEmployeeById(replacement_emp);
      if (!replacement) {
        return c.json({ success: false, message: 'Replacement employee not found' }, 404);
      }
      
      if (replacement.dept_name !== employee.dept_name) {
        return c.json({ success: false, message: 'Replacement must be from the same department' }, 400);
      }
      
      const replacementOnLeave = await db.isOnLeave(replacement_emp, start_date, end_date);
      if (replacementOnLeave) {
        return c.json({ success: false, message: 'Replacement employee is on leave during this period' }, 400);
      }
    }
    
    const leave = await db.createLeave({ start_date, end_date });
    await db.createAnnualLeave(leave.request_ID, employee_ID, replacement_emp || null);
    
    // Add approval entries
    const roles = await db.getEmployeeRoles(employee_ID);
    const roleNames = await Promise.all(roles.map(async r => {
      const role = await db.getRoleByName(r.role_name);
      return role;
    }));
    
    const isDean = roleNames.some(r => r && r.role_name === 'Dean');
    const isViceDean = roleNames.some(r => r && r.role_name === 'Vice Dean');
    const isHR = roleNames.some(r => r && r.role_name && r.role_name.startsWith('HR_Representative'));
    
    if (isDean || isViceDean) {
      // Needs President + HR approval
      const allEmployees = await db.getAllEmployees();
      for (const emp of allEmployees) {
        const empRoles = await db.getEmployeeRoles(emp.employee_ID);
        for (const empRole of empRoles) {
          const role = await db.getRoleByName(empRole.role_name);
          if (role && role.role_name === 'President' && (emp.employment_status === 'active' || emp.employment_status === 'notice_period')) {
            await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
            break;
          }
        }
      }
      
      for (const emp of allEmployees) {
        const empRoles = await db.getEmployeeRoles(emp.employee_ID);
        for (const empRole of empRoles) {
          const role = await db.getRoleByName(empRole.role_name);
          if (role && role.role_name === `HR_Representative_${employee.dept_name}` && (emp.employment_status === 'active' || emp.employment_status === 'notice_period')) {
            await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
            break;
          }
        }
      }
    } else if (isHR) {
      // Needs higher HR approval
      const allEmployees = await db.getAllEmployees();
      const requesterRanks = roleNames.filter(r => r).map(r => r.rank || 999);
      const requesterRank = Math.min(...requesterRanks);
      
      for (const emp of allEmployees) {
        const empRoles = await db.getEmployeeRoles(emp.employee_ID);
        for (const empRole of empRoles) {
          const role = await db.getRoleByName(empRole.role_name);
          if (role && role.role_name && role.role_name.startsWith('HR') && (role.rank || 999) < requesterRank && (emp.employment_status === 'active' || emp.employment_status === 'notice_period')) {
            await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
            break;
          }
        }
      }
    } else {
      // Normal employee: needs Dean/Vice Dean + HR
      const allEmployees = await db.getAllEmployees();
      
      for (const emp of allEmployees) {
        if (emp.dept_name !== employee.dept_name) continue;
        const empRoles = await db.getEmployeeRoles(emp.employee_ID);
        for (const empRole of empRoles) {
          const role = await db.getRoleByName(empRole.role_name);
          if (role && role.role_name === 'Dean' && (emp.employment_status === 'active' || emp.employment_status === 'notice_period')) {
            await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
            break;
          }
        }
      }
      
      for (const emp of allEmployees) {
        const empRoles = await db.getEmployeeRoles(emp.employee_ID);
        for (const empRole of empRoles) {
          const role = await db.getRoleByName(empRole.role_name);
          if (role && role.role_name === `HR_Representative_${employee.dept_name}` && (emp.employment_status === 'active' || emp.employment_status === 'notice_period')) {
            await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
            break;
          }
        }
      }
    }
    
    return c.json({ success: true, message: 'Annual leave submitted successfully', data: leave });
  } catch (error) {
    console.log('Error submitting annual leave:', error);
    return c.json({ success: false, message: `Error submitting annual leave: ${error}` }, 500);
  }
});

// Get leave status for current month
app.get('/make-server-a764e3d7/employee/:id/leave-status', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('id'));
    const currentMonth = db.getCurrentMonth();
    const currentYear = db.getCurrentYear();
    
    const leaves = await db.getAllLeaves();
    const result = [];
    
    for (const leave of leaves) {
      const leaveMonth = new Date(leave.start_date).getMonth() + 1;
      const leaveYear = new Date(leave.start_date).getFullYear();
      
      if (leaveMonth !== currentMonth || leaveYear !== currentYear) continue;
      
      const annualLeave = await db.getAnnualLeaveByLeaveId(leave.request_ID);
      const accidentalLeave = await db.getAccidentalLeaveByLeaveId(leave.request_ID);
      
      if ((annualLeave && annualLeave.emp_ID === employeeId) || 
          (accidentalLeave && accidentalLeave.emp_ID === employeeId)) {
        result.push({
          request_id: leave.request_ID,
          date_of_request: leave.date_of_request,
          status: leave.final_approval_status
        });
      }
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Error fetching leave status:', error);
    return c.json({ success: false, message: `Error fetching leave status: ${error}` }, 500);
  }
});

// Submit accidental leave
app.post('/make-server-a764e3d7/employee/submit-accidental-leave', async (c) => {
  try {
    const { employee_ID, start_date } = await c.req.json();
    
    if (!employee_ID || !start_date) {
      return c.json({ success: false, message: 'Employee ID and start date are required' }, 400);
    }
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    if (employee.accidental_balance < 1) {
      return c.json({ success: false, message: 'Insufficient accidental leave balance' }, 400);
    }
    
    const isOnLeave = await db.isOnLeave(employee_ID, start_date, start_date);
    if (isOnLeave) {
      return c.json({ success: false, message: 'You already have a leave on this date' }, 400);
    }
    
    const leave = await db.createLeave({ start_date, end_date: start_date });
    await db.createAccidentalLeave(leave.request_ID, employee_ID);
    
    // Add HR approval
    const allEmployees = await db.getAllEmployees();
    for (const emp of allEmployees) {
      const empRoles = await db.getEmployeeRoles(emp.employee_ID);
      for (const empRole of empRoles) {
        const role = await db.getRoleByName(empRole.role_name);
        if (role && role.role_name === `HR_Representative_${employee.dept_name}`) {
          await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
          break;
        }
      }
    }
    
    return c.json({ success: true, message: 'Accidental leave submitted successfully', data: leave });
  } catch (error) {
    console.log('Error submitting accidental leave:', error);
    return c.json({ success: false, message: `Error submitting accidental leave: ${error}` }, 500);
  }
});

// Submit medical leave
app.post('/make-server-a764e3d7/employee/submit-medical-leave', async (c) => {
  try {
    const { employee_ID, start_date, end_date, type, insurance_status, disability_details, document_description, file_name } = await c.req.json();
    
    if (!employee_ID || !start_date || !end_date || !type) {
      return c.json({ success: false, message: 'Required fields are missing' }, 400);
    }
    
    const leave = await db.createLeave({ start_date, end_date });
    await db.createMedicalLeave(leave.request_ID, employee_ID, { type, insurance_status: insurance_status || false, disability_details: disability_details || '' });
    
    await db.createDocument({
      type: 'medical',
      description: document_description || '',
      file_name: file_name || '',
      creation_date: db.getCurrentDate(),
      expiry_date: null,
      emp_ID: employee_ID,
      medical_ID: leave.request_ID,
      unpaid_ID: null
    });
    
    // Add approvals (Medical Doctor + HR)
    const allEmployees = await db.getAllEmployees();
    for (const emp of allEmployees) {
      const empRoles = await db.getEmployeeRoles(emp.employee_ID);
      for (const empRole of empRoles) {
        const role = await db.getRoleByName(empRole.role_name);
        if (role && (role.role_name === 'Medical Doctor' || role.role_name.startsWith('HR_Representative'))) {
          await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
        }
      }
    }
    
    return c.json({ success: true, message: 'Medical leave submitted successfully', data: leave });
  } catch (error) {
    console.log('Error submitting medical leave:', error);
    return c.json({ success: false, message: `Error submitting medical leave: ${error}` }, 500);
  }
});

// Submit unpaid leave
app.post('/make-server-a764e3d7/employee/submit-unpaid-leave', async (c) => {
  try {
    const { employee_ID, start_date, end_date, document_description, file_name } = await c.req.json();
    
    if (!employee_ID || !start_date || !end_date) {
      return c.json({ success: false, message: 'Required fields are missing' }, 400);
    }
    
    const leave = await db.createLeave({ start_date, end_date });
    await db.createUnpaidLeave(leave.request_ID, employee_ID);
    
    await db.createDocument({
      type: 'memo',
      description: document_description || '',
      file_name: file_name || '',
      creation_date: db.getCurrentDate(),
      expiry_date: null,
      emp_ID: employee_ID,
      medical_ID: null,
      unpaid_ID: leave.request_ID
    });
    
    // Add approvals (Upper board + HR)
    const allEmployees = await db.getAllEmployees();
    for (const emp of allEmployees) {
      const empRoles = await db.getEmployeeRoles(emp.employee_ID);
      for (const empRole of empRoles) {
        const role = await db.getRoleByName(empRole.role_name);
        if (role && ((role.rank && role.rank <= 4) || role.role_name.startsWith('HR_Representative'))) {
          await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
        }
      }
    }
    
    return c.json({ success: true, message: 'Unpaid leave submitted successfully', data: leave });
  } catch (error) {
    console.log('Error submitting unpaid leave:', error);
    return c.json({ success: false, message: `Error submitting unpaid leave: ${error}` }, 500);
  }
});

// Submit compensation leave
app.post('/make-server-a764e3d7/employee/submit-compensation-leave', async (c) => {
  try {
    const { employee_ID, compensation_date, reason, date_of_original_workday, replacement_emp } = await c.req.json();
    
    if (!employee_ID || !compensation_date || !date_of_original_workday) {
      return c.json({ success: false, message: 'Required fields are missing' }, 400);
    }
    
    const leave = await db.createLeave({ start_date: compensation_date, end_date: compensation_date });
    await db.createCompensationLeave(leave.request_ID, employee_ID, { reason: reason || '', date_of_original_workday, replacement_emp: replacement_emp || null });
    
    // Add HR approval
    const employee = await db.getEmployeeById(employee_ID);
    const allEmployees = await db.getAllEmployees();
    for (const emp of allEmployees) {
      const empRoles = await db.getEmployeeRoles(emp.employee_ID);
      for (const empRole of empRoles) {
        const role = await db.getRoleByName(empRole.role_name);
        if (role && role.role_name === `HR_Representative_${employee.dept_name}`) {
          await db.createEmployeeApproveLeave(emp.employee_ID, leave.request_ID, 'pending');
          break;
        }
      }
    }
    
    return c.json({ success: true, message: 'Compensation leave submitted successfully', data: leave });
  } catch (error) {
    console.log('Error submitting compensation leave:', error);
    return c.json({ success: false, message: `Error submitting compensation leave: ${error}` }, 500);
  }
});

// Approve/reject leave (for upper board)
app.post('/make-server-a764e3d7/employee/approve-leave', async (c) => {
  try {
    const { employee_ID, leave_ID, status } = await c.req.json();
    
    if (!employee_ID || !leave_ID || !status) {
      return c.json({ success: false, message: 'All fields are required' }, 400);
    }
    
    await db.updateEmployeeApproveLeave(employee_ID, leave_ID, status);
    
    // Check if all approvals are done
    const approvals = await db.getApprovalsByLeaveId(leave_ID);
    const allApproved = approvals.every(a => a.status === 'approved');
    const anyRejected = approvals.some(a => a.status === 'rejected');
    
    if (anyRejected) {
      await db.updateLeave(leave_ID, { final_approval_status: 'rejected' });
    } else if (allApproved) {
      await db.updateLeave(leave_ID, { final_approval_status: 'approved' });
      
      // Update balance
      const leave = await db.getLeaveById(leave_ID);
      const annualLeave = await db.getAnnualLeaveByLeaveId(leave_ID);
      const accidentalLeave = await db.getAccidentalLeaveByLeaveId(leave_ID);
      
      if (annualLeave) {
        const emp = await db.getEmployeeById(annualLeave.emp_ID);
        await db.updateEmployee(annualLeave.emp_ID, { annual_balance: emp.annual_balance - leave.num_days });
      } else if (accidentalLeave) {
        const emp = await db.getEmployeeById(accidentalLeave.emp_ID);
        await db.updateEmployee(accidentalLeave.emp_ID, { accidental_balance: emp.accidental_balance - leave.num_days });
      }
    }
    
    return c.json({ success: true, message: `Leave ${status} successfully` });
  } catch (error) {
    console.log('Error approving leave:', error);
    return c.json({ success: false, message: `Error approving leave: ${error}` }, 500);
  }
});

// Evaluate employee (Dean only)
app.post('/make-server-a764e3d7/employee/evaluate', async (c) => {
  try {
    const { evaluator_ID, employee_ID, rating, comments, semester } = await c.req.json();
    
    if (!evaluator_ID || !employee_ID || !rating || !semester) {
      return c.json({ success: false, message: 'All fields are required' }, 400);
    }
    
    const evaluator = await db.getEmployeeById(evaluator_ID);
    const employee = await db.getEmployeeById(employee_ID);
    
    if (!evaluator || !employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    if (evaluator.dept_name !== employee.dept_name) {
      return c.json({ success: false, message: 'Can only evaluate employees in the same department' }, 400);
    }
    
    const evaluatorRoles = await db.getEmployeeRoles(evaluator_ID);
    const isDean = evaluatorRoles.some(async r => {
      const role = await db.getRoleByName(r.role_name);
      return role && role.role_name === 'Dean';
    });
    
    if (!isDean) {
      return c.json({ success: false, message: 'Only Deans can evaluate employees' }, 400);
    }
    
    const performance = await db.createPerformance({
      rating,
      comments: comments || '',
      semester,
      emp_ID: employee_ID
    });
    
    return c.json({ success: true, message: 'Evaluation submitted successfully', data: performance });
  } catch (error) {
    console.log('Error evaluating employee:', error);
    return c.json({ success: false, message: `Error evaluating employee: ${error}` }, 500);
  }
});

// Get pending approvals for an employee
app.get('/make-server-a764e3d7/employee/:id/pending-approvals', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('id'));
    const allApprovals = await kv.getByPrefix('employee_approve_leave:');
    
    const pendingApprovals = allApprovals
      .filter(a => a.value.Emp1_ID === employeeId && a.value.status === 'pending')
      .map(a => a.value);
    
    const result = [];
    for (const approval of pendingApprovals) {
      const leave = await db.getLeaveById(approval.Leave_ID);
      if (leave) {
        // Determine leave type
        let leaveType = 'Unknown';
        let requestorId = null;
        
        const annualLeave = await db.getAnnualLeaveByLeaveId(leave.request_ID);
        const accidentalLeave = await db.getAccidentalLeaveByLeaveId(leave.request_ID);
        const medicalLeave = await db.getMedicalLeaveByLeaveId(leave.request_ID);
        const unpaidLeave = await db.getUnpaidLeaveByLeaveId(leave.request_ID);
        const compensationLeave = await db.getCompensationLeaveByLeaveId(leave.request_ID);
        
        if (annualLeave) {
          leaveType = 'Annual Leave';
          requestorId = annualLeave.emp_ID;
        } else if (accidentalLeave) {
          leaveType = 'Accidental Leave';
          requestorId = accidentalLeave.emp_ID;
        } else if (medicalLeave) {
          leaveType = 'Medical Leave';
          requestorId = medicalLeave.Emp_ID;
        } else if (unpaidLeave) {
          leaveType = 'Unpaid Leave';
          requestorId = unpaidLeave.emp_ID;
        } else if (compensationLeave) {
          leaveType = 'Compensation Leave';
          requestorId = compensationLeave.emp_ID;
        }
        
        const requestor = requestorId ? await db.getEmployeeById(requestorId) : null;
        
        result.push({
          ...approval,
          leave,
          leaveType,
          requestor: requestor ? `${requestor.first_name} ${requestor.last_name}` : 'Unknown'
        });
      }
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Error fetching pending approvals:', error);
    return c.json({ success: false, message: `Error fetching pending approvals: ${error}` }, 500);
  }
});

// ==================== HR ENDPOINTS ====================

// HR login
app.post('/make-server-a764e3d7/hr/login', async (c) => {
  try {
    const { employee_ID, password } = await c.req.json();
    
    const employee = await db.getEmployeeById(parseInt(employee_ID));
    
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    if (employee.password !== password) {
      return c.json({ success: false, message: 'Invalid password' }, 401);
    }
    
    // Check if employee has HR role
    const roles = await db.getEmployeeRoles(employee.employee_ID);
    const hasHRRole = roles.some(async r => {
      const role = await db.getRoleByName(r.role_name);
      return role && (role.role_name.startsWith('HR_') || role.role_name === 'HR Manager');
    });
    
    if (!hasHRRole) {
      return c.json({ success: false, message: 'Not an HR employee' }, 403);
    }
    
    return c.json({ success: true, message: 'HR login successful', data: employee });
  } catch (error) {
    console.log('Error during HR login:', error);
    return c.json({ success: false, message: `HR login error: ${error}` }, 500);
  }
});

// HR approve annual/accidental leave
app.post('/make-server-a764e3d7/hr/approve-annual-accidental', async (c) => {
  try {
    const { request_id, HR_id } = await c.req.json();
    
    const leave = await db.getLeaveById(request_id);
    if (!leave) {
      return c.json({ success: false, message: 'Leave request not found' }, 404);
    }
    
    const annualLeave = await db.getAnnualLeaveByLeaveId(request_id);
    const accidentalLeave = await db.getAccidentalLeaveByLeaveId(request_id);
    
    let empId = null;
    let isAnnual = false;
    
    if (annualLeave) {
      empId = annualLeave.emp_ID;
      isAnnual = true;
    } else if (accidentalLeave) {
      empId = accidentalLeave.emp_ID;
      isAnnual = false;
    } else {
      return c.json({ success: false, message: 'Not an annual or accidental leave' }, 400);
    }
    
    const employee = await db.getEmployeeById(empId);
    const balance = isAnnual ? employee.annual_balance : employee.accidental_balance;
    
    // Check balance
    if (balance < leave.num_days) {
      await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: false, message: 'Insufficient leave balance. Leave rejected.' }, 400);
    }
    
    // Check accidental leave rules
    if (!isAnnual) {
      const hoursDiff = (new Date(leave.start_date).getTime() - new Date(leave.date_of_request).getTime()) / (1000 * 60 * 60);
      if (leave.num_days > 1 || hoursDiff > 48) {
        await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
        await db.updateLeave(request_id, { final_approval_status: 'rejected' });
        return c.json({ success: false, message: 'Accidental leave must be 1 day and requested within 48 hours. Leave rejected.' }, 400);
      }
    }
    
    await db.updateEmployeeApproveLeave(HR_id, request_id, 'approved');
    
    // Check if all approvals are done
    const approvals = await db.getApprovalsByLeaveId(request_id);
    const allApproved = approvals.every(a => a.status === 'approved');
    const anyRejected = approvals.some(a => a.status === 'rejected');
    
    if (anyRejected) {
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: true, message: 'Leave rejected' });
    } else if (allApproved) {
      await db.updateLeave(request_id, { final_approval_status: 'approved' });
      
      // Update balance
      if (isAnnual) {
        await db.updateEmployee(empId, { annual_balance: balance - leave.num_days });
      } else {
        await db.updateEmployee(empId, { accidental_balance: balance - leave.num_days });
      }
      
      return c.json({ success: true, message: 'Leave approved and balance updated' });
    }
    
    return c.json({ success: true, message: 'Approval recorded, waiting for other approvals' });
  } catch (error) {
    console.log('Error approving leave:', error);
    return c.json({ success: false, message: `Error approving leave: ${error}` }, 500);
  }
});

// HR approve unpaid leave
app.post('/make-server-a764e3d7/hr/approve-unpaid', async (c) => {
  try {
    const { request_id, HR_id } = await c.req.json();
    
    const leave = await db.getLeaveById(request_id);
    if (!leave) {
      return c.json({ success: false, message: 'Leave request not found' }, 404);
    }
    
    const unpaidLeave = await db.getUnpaidLeaveByLeaveId(request_id);
    if (!unpaidLeave) {
      return c.json({ success: false, message: 'Not an unpaid leave' }, 400);
    }
    
    const employee = await db.getEmployeeById(unpaidLeave.emp_ID);
    
    // Check rules
    if (leave.num_days > 30) {
      await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: false, message: 'Unpaid leave cannot exceed 30 days. Leave rejected.' }, 400);
    }
    
    // Check if employee already has an approved unpaid leave this year
    const allLeaves = await db.getAllLeaves();
    const currentYear = new Date(leave.start_date).getFullYear();
    
    for (const otherLeave of allLeaves) {
      if (otherLeave.request_ID === request_id) continue;
      if (otherLeave.final_approval_status === 'approved' && new Date(otherLeave.start_date).getFullYear() === currentYear) {
        const otherUnpaid = await db.getUnpaidLeaveByLeaveId(otherLeave.request_ID);
        if (otherUnpaid && otherUnpaid.emp_ID === unpaidLeave.emp_ID) {
          await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
          await db.updateLeave(request_id, { final_approval_status: 'rejected' });
          return c.json({ success: false, message: 'Employee already has an approved unpaid leave this year. Leave rejected.' }, 400);
        }
      }
    }
    
    await db.updateEmployeeApproveLeave(HR_id, request_id, 'approved');
    
    // Check if all approvals are done
    const approvals = await db.getApprovalsByLeaveId(request_id);
    const allApproved = approvals.every(a => a.status === 'approved');
    const anyRejected = approvals.some(a => a.status === 'rejected');
    
    if (anyRejected) {
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: true, message: 'Leave rejected' });
    } else if (allApproved) {
      await db.updateLeave(request_id, { final_approval_status: 'approved' });
      return c.json({ success: true, message: 'Leave approved' });
    }
    
    return c.json({ success: true, message: 'Approval recorded, waiting for other approvals' });
  } catch (error) {
    console.log('Error approving unpaid leave:', error);
    return c.json({ success: false, message: `Error approving unpaid leave: ${error}` }, 500);
  }
});

// HR approve compensation leave
app.post('/make-server-a764e3d7/hr/approve-compensation', async (c) => {
  try {
    const { request_id, HR_id } = await c.req.json();
    
    const leave = await db.getLeaveById(request_id);
    if (!leave) {
      return c.json({ success: false, message: 'Leave request not found' }, 404);
    }
    
    const compensationLeave = await db.getCompensationLeaveByLeaveId(request_id);
    if (!compensationLeave) {
      return c.json({ success: false, message: 'Not a compensation leave' }, 400);
    }
    
    // Check rules
    const allAttendance = await db.getAllAttendance();
    const workdayAttendance = allAttendance.find(a => 
      a.emp_ID === compensationLeave.emp_ID && 
      a.date === compensationLeave.date_of_original_workday
    );
    
    if (!workdayAttendance || !workdayAttendance.total_duration || workdayAttendance.total_duration < 8 * 60) {
      await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: false, message: 'Employee did not work at least 8 hours on the original workday. Leave rejected.' }, 400);
    }
    
    const workdayMonth = new Date(compensationLeave.date_of_original_workday).getMonth();
    const leaveMonth = new Date(leave.start_date).getMonth();
    
    if (workdayMonth !== leaveMonth) {
      await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: false, message: 'Compensation leave must be in the same month as the original workday. Leave rejected.' }, 400);
    }
    
    if (compensationLeave.replacement_emp) {
      const replacement = await db.getEmployeeById(compensationLeave.replacement_emp);
      const leaveDayOfWeek = db.getDayOfWeek(leave.start_date);
      
      if (replacement.official_day_off !== leaveDayOfWeek) {
        await db.updateEmployeeApproveLeave(HR_id, request_id, 'rejected');
        await db.updateLeave(request_id, { final_approval_status: 'rejected' });
        return c.json({ success: false, message: 'Replacement employee day-off does not match the compensation date. Leave rejected.' }, 400);
      }
    }
    
    await db.updateEmployeeApproveLeave(HR_id, request_id, 'approved');
    
    // Check if all approvals are done
    const approvals = await db.getApprovalsByLeaveId(request_id);
    const allApproved = approvals.every(a => a.status === 'approved');
    const anyRejected = approvals.some(a => a.status === 'rejected');
    
    if (anyRejected) {
      await db.updateLeave(request_id, { final_approval_status: 'rejected' });
      return c.json({ success: true, message: 'Leave rejected' });
    } else if (allApproved) {
      await db.updateLeave(request_id, { final_approval_status: 'approved' });
      return c.json({ success: true, message: 'Leave approved' });
    }
    
    return c.json({ success: true, message: 'Approval recorded, waiting for other approvals' });
  } catch (error) {
    console.log('Error approving compensation leave:', error);
    return c.json({ success: false, message: `Error approving compensation leave: ${error}` }, 500);
  }
});

// Add deduction for missing hours
app.post('/make-server-a764e3d7/hr/add-deduction-hours', async (c) => {
  try {
    const { employee_ID } = await c.req.json();
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const currentMonth = db.getCurrentMonth();
    const currentDate = db.getCurrentDate();
    const allAttendance = await db.getAllAttendance();
    
    // Find first attendance with less than 8 hours
    const underHourAttendance = allAttendance
      .filter(a => 
        a.emp_ID === employee_ID && 
        new Date(a.date).getMonth() + 1 === currentMonth &&
        a.total_duration !== null &&
        a.total_duration < 480
      )
      .sort((a, b) => a.attendance_ID - b.attendance_ID);
    
    if (underHourAttendance.length === 0) {
      return c.json({ success: false, message: 'No missing hours found for this month' }, 400);
    }
    
    const firstAttendanceId = underHourAttendance[0].attendance_ID;
    
    // Calculate total missing minutes
    const totalMissingMinutes = underHourAttendance.reduce((sum, a) => sum + (480 - a.total_duration), 0);
    
    // Calculate rate per hour
    const roles = await db.getEmployeeRoles(employee_ID);
    const roleDetails = await Promise.all(roles.map(r => db.getRoleByName(r.role_name)));
    const salary = db.calculateSalary(employee, roleDetails);
    const ratePerHour = db.getRatePerHour(salary);
    
    const amount = (totalMissingMinutes * ratePerHour / 60);
    
    await db.createDeduction({
      emp_ID: employee_ID,
      date: currentDate,
      amount,
      type: 'missing_hours',
      status: 'pending',
      unpaid_ID: null,
      attendance_ID: firstAttendanceId
    });
    
    return c.json({ success: true, message: `Deduction of ${amount.toFixed(2)} added for missing hours` });
  } catch (error) {
    console.log('Error adding deduction for missing hours:', error);
    return c.json({ success: false, message: `Error adding deduction for missing hours: ${error}` }, 500);
  }
});

// Add deduction for missing days
app.post('/make-server-a764e3d7/hr/add-deduction-days', async (c) => {
  try {
    const { employee_ID } = await c.req.json();
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const currentMonth = db.getCurrentMonth();
    const allAttendance = await db.getAllAttendance();
    
    const absentDays = allAttendance.filter(a => 
      a.emp_ID === employee_ID && 
      new Date(a.date).getMonth() + 1 === currentMonth &&
      a.status === 'absent'
    );
    
    if (absentDays.length === 0) {
      return c.json({ success: false, message: 'No absent days found for this month' }, 400);
    }
    
    // Calculate rate per hour
    const roles = await db.getEmployeeRoles(employee_ID);
    const roleDetails = await Promise.all(roles.map(r => db.getRoleByName(r.role_name)));
    const salary = db.calculateSalary(employee, roleDetails);
    const ratePerHour = db.getRatePerHour(salary);
    const amountPerDay = ratePerHour * 8;
    
    let count = 0;
    for (const att of absentDays) {
      await db.createDeduction({
        emp_ID: employee_ID,
        date: att.date,
        amount: amountPerDay,
        type: 'missing_days',
        status: 'pending',
        unpaid_ID: null,
        attendance_ID: att.attendance_ID
      });
      count++;
    }
    
    return c.json({ success: true, message: `Added ${count} deductions for missing days, total amount: ${(count * amountPerDay).toFixed(2)}` });
  } catch (error) {
    console.log('Error adding deduction for missing days:', error);
    return c.json({ success: false, message: `Error adding deduction for missing days: ${error}` }, 500);
  }
});

// Add deduction for unpaid leave
app.post('/make-server-a764e3d7/hr/add-deduction-unpaid', async (c) => {
  try {
    const { employee_ID } = await c.req.json();
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const currentMonth = db.getCurrentMonth();
    const allLeaves = await db.getAllLeaves();
    
    // Find unpaid leaves for this employee in current month
    for (const leave of allLeaves) {
      const unpaidLeave = await db.getUnpaidLeaveByLeaveId(leave.request_ID);
      if (!unpaidLeave || unpaidLeave.emp_ID !== employee_ID) continue;
      
      const startMonth = new Date(leave.start_date).getMonth() + 1;
      const endMonth = new Date(leave.end_date).getMonth() + 1;
      
      if (startMonth !== currentMonth && endMonth !== currentMonth) continue;
      
      // Calculate deduction
      const roles = await db.getEmployeeRoles(employee_ID);
      const roleDetails = await Promise.all(roles.map(r => db.getRoleByName(r.role_name)));
      const salary = db.calculateSalary(employee, roleDetails);
      const ratePerHour = db.getRatePerHour(salary);
      
      let daysInMonth = 0;
      if (startMonth === endMonth) {
        daysInMonth = leave.num_days;
      } else if (startMonth === currentMonth) {
        const endOfMonth = new Date(new Date().getFullYear(), currentMonth, 0);
        daysInMonth = Math.floor((endOfMonth.getTime() - new Date(leave.start_date).getTime()) / (1000 * 60 * 60 * 24));
      } else {
        daysInMonth = new Date(leave.end_date).getDate();
      }
      
      const amount = ratePerHour * 8 * daysInMonth;
      
      await db.createDeduction({
        emp_ID: employee_ID,
        date: leave.start_date,
        amount,
        type: 'unpaid',
        status: 'pending',
        unpaid_ID: leave.request_ID,
        attendance_ID: null
      });
      
      return c.json({ success: true, message: `Deduction of ${amount.toFixed(2)} added for unpaid leave` });
    }
    
    return c.json({ success: false, message: 'No unpaid leave found for this month' }, 400);
  } catch (error) {
    console.log('Error adding deduction for unpaid leave:', error);
    return c.json({ success: false, message: `Error adding deduction for unpaid leave: ${error}` }, 500);
  }
});

// Generate monthly payroll
app.post('/make-server-a764e3d7/hr/generate-payroll', async (c) => {
  try {
    const { employee_ID, from_date, to_date } = await c.req.json();
    
    const employee = await db.getEmployeeById(employee_ID);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    // Calculate salary
    const roles = await db.getEmployeeRoles(employee_ID);
    const roleDetails = await Promise.all(roles.map(r => db.getRoleByName(r.role_name)));
    const baseSalary = db.calculateSalary(employee, roleDetails);
    
    // Calculate overtime bonus
    const allAttendance = await db.getAllAttendance();
    const monthAttendance = allAttendance.filter(a => {
      const attDate = new Date(a.date);
      return a.emp_ID === employee_ID && 
             attDate >= new Date(from_date) && 
             attDate <= new Date(to_date);
    });
    
    const totalMinutes = monthAttendance.reduce((sum, a) => sum + (a.total_duration || 0), 0);
    const totalHours = totalMinutes / 60;
    const expectedHours = monthAttendance.length * 8;
    const overtimeHours = totalHours - expectedHours;
    
    const ratePerHour = db.getRatePerHour(baseSalary);
    const sortedRoles = roleDetails.filter(r => r).sort((a, b) => (a.rank || 999) - (b.rank || 999));
    const overtimeFactor = sortedRoles.length > 0 ? (sortedRoles[0].percentage_overtime || 0) : 0;
    const bonusAmount = overtimeHours > 0 ? (ratePerHour * overtimeFactor * overtimeHours / 100) : 0;
    
    // Calculate deductions
    const allDeductions = await db.getAllDeductions();
    const monthDeductions = allDeductions.filter(d => {
      const dedDate = new Date(d.date);
      return d.emp_ID === employee_ID && 
             dedDate >= new Date(from_date) && 
             dedDate <= new Date(to_date);
    });
    
    const deductionsAmount = monthDeductions.reduce((sum, d) => sum + (d.amount || 0), 0);
    
    const finalSalary = baseSalary + bonusAmount - deductionsAmount;
    
    const payroll = await db.createPayroll({
      payment_date: db.getCurrentDate(),
      final_salary_amount: finalSalary,
      from_date,
      to_date,
      comments: '',
      bonus_amount: bonusAmount,
      deductions_amount: deductionsAmount,
      emp_ID: employee_ID
    });
    
    // Finalize deductions
    for (const deduction of monthDeductions) {
      await db.updateDeduction(deduction.deduction_ID, { status: 'finalized' });
    }
    
    return c.json({ success: true, message: 'Payroll generated successfully', data: payroll });
  } catch (error) {
    console.log('Error generating payroll:', error);
    return c.json({ success: false, message: `Error generating payroll: ${error}` }, 500);
  }
});

// Get all pending leave approvals for HR
app.get('/make-server-a764e3d7/hr/pending-leaves', async (c) => {
  try {
    const allLeaves = await db.getAllLeaves();
    const pendingLeaves = allLeaves.filter(l => l.final_approval_status === 'pending');
    
    const result = [];
    for (const leave of pendingLeaves) {
      let leaveType = 'Unknown';
      let empId = null;
      let details = {};
      
      const annualLeave = await db.getAnnualLeaveByLeaveId(leave.request_ID);
      const accidentalLeave = await db.getAccidentalLeaveByLeaveId(leave.request_ID);
      const medicalLeave = await db.getMedicalLeaveByLeaveId(leave.request_ID);
      const unpaidLeave = await db.getUnpaidLeaveByLeaveId(leave.request_ID);
      const compensationLeave = await db.getCompensationLeaveByLeaveId(leave.request_ID);
      
      if (annualLeave) {
        leaveType = 'Annual';
        empId = annualLeave.emp_ID;
        details = annualLeave;
      } else if (accidentalLeave) {
        leaveType = 'Accidental';
        empId = accidentalLeave.emp_ID;
        details = accidentalLeave;
      } else if (medicalLeave) {
        leaveType = 'Medical';
        empId = medicalLeave.Emp_ID;
        details = medicalLeave;
      } else if (unpaidLeave) {
        leaveType = 'Unpaid';
        empId = unpaidLeave.emp_ID;
        details = unpaidLeave;
      } else if (compensationLeave) {
        leaveType = 'Compensation';
        empId = compensationLeave.emp_ID;
        details = compensationLeave;
      }
      
      const employee = empId ? await db.getEmployeeById(empId) : null;
      
      result.push({
        ...leave,
        leaveType,
        employee: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
        employee_ID: empId,
        details
      });
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Error fetching pending leaves:', error);
    return c.json({ success: false, message: `Error fetching pending leaves: ${error}` }, 500);
  }
});

// ==================== INITIALIZATION ENDPOINT ====================

// Initialize database with sample data
app.post('/make-server-a764e3d7/init-db', async (c) => {
  try {
    // Create departments
    await db.createDepartment({ name: 'Computer Science', building_location: 'Building A' });
    await db.createDepartment({ name: 'Engineering', building_location: 'Building B' });
    await db.createDepartment({ name: 'Business', building_location: 'Building C' });
    
    // Create roles
    await db.createRole({ role_name: 'President', title: 'President', description: 'University President', rank: 1, base_salary: 15000, percentage_YOE: 5, percentage_overtime: 10, annual_balance: 30, accidental_balance: 5 });
    await db.createRole({ role_name: 'Vice President', title: 'Vice President', description: 'Vice President', rank: 2, base_salary: 12000, percentage_YOE: 5, percentage_overtime: 10, annual_balance: 28, accidental_balance: 5 });
    await db.createRole({ role_name: 'Dean', title: 'Dean', description: 'Department Dean', rank: 3, base_salary: 10000, percentage_YOE: 5, percentage_overtime: 8, annual_balance: 25, accidental_balance: 5 });
    await db.createRole({ role_name: 'Vice Dean', title: 'Vice Dean', description: 'Vice Dean', rank: 4, base_salary: 9000, percentage_YOE: 5, percentage_overtime: 8, annual_balance: 25, accidental_balance: 5 });
    await db.createRole({ role_name: 'Professor', title: 'Professor', description: 'Professor', rank: 5, base_salary: 8000, percentage_YOE: 4, percentage_overtime: 7, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'Associate Professor', title: 'Associate Professor', description: 'Associate Professor', rank: 6, base_salary: 7000, percentage_YOE: 4, percentage_overtime: 7, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'Assistant Professor', title: 'Assistant Professor', description: 'Assistant Professor', rank: 7, base_salary: 6000, percentage_YOE: 3, percentage_overtime: 6, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'Teaching Assistant', title: 'Teaching Assistant', description: 'Teaching Assistant', rank: 8, base_salary: 4000, percentage_YOE: 3, percentage_overtime: 5, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'HR Manager', title: 'HR Manager', description: 'HR Manager', rank: 10, base_salary: 7000, percentage_YOE: 4, percentage_overtime: 6, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'HR_Representative_Computer Science', title: 'HR Representative', description: 'HR Rep CS', rank: 11, base_salary: 5000, percentage_YOE: 3, percentage_overtime: 5, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'HR_Representative_Engineering', title: 'HR Representative', description: 'HR Rep Eng', rank: 11, base_salary: 5000, percentage_YOE: 3, percentage_overtime: 5, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'HR_Representative_Business', title: 'HR Representative', description: 'HR Rep Bus', rank: 11, base_salary: 5000, percentage_YOE: 3, percentage_overtime: 5, annual_balance: 21, accidental_balance: 5 });
    await db.createRole({ role_name: 'Medical Doctor', title: 'Medical Doctor', description: 'University Doctor', rank: 12, base_salary: 8000, percentage_YOE: 4, percentage_overtime: 7, annual_balance: 21, accidental_balance: 5 });
    
    // Create employees
    const emp1 = await db.createEmployee({
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@university.edu',
      password: 'password123',
      address: '123 Main St',
      gender: 'M',
      official_day_off: 'Friday',
      years_of_experience: 15,
      national_ID: '1234567890123456',
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Jane Smith',
      emergency_contact_phone: '12345678901',
      annual_balance: 25,
      accidental_balance: 5,
      hire_date: '2010-01-15',
      last_working_date: null,
      dept_name: 'Computer Science'
    });
    await db.assignRoleToEmployee(emp1.employee_ID, 'Dean');
    
    const emp2 = await db.createEmployee({
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@university.edu',
      password: 'password123',
      address: '456 Oak Ave',
      gender: 'F',
      official_day_off: 'Friday',
      years_of_experience: 8,
      national_ID: '2345678901234567',
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Mike Johnson',
      emergency_contact_phone: '23456789012',
      annual_balance: 21,
      accidental_balance: 5,
      hire_date: '2016-09-01',
      last_working_date: null,
      dept_name: 'Computer Science'
    });
    await db.assignRoleToEmployee(emp2.employee_ID, 'Professor');
    
    const emp3 = await db.createEmployee({
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@university.edu',
      password: 'password123',
      address: '789 Pine Rd',
      gender: 'M',
      official_day_off: 'Saturday',
      years_of_experience: 5,
      national_ID: '3456789012345678',
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Lisa Brown',
      emergency_contact_phone: '34567890123',
      annual_balance: 21,
      accidental_balance: 5,
      hire_date: '2019-03-20',
      last_working_date: null,
      dept_name: 'Computer Science'
    });
    await db.assignRoleToEmployee(emp3.employee_ID, 'Assistant Professor');
    
    const emp4 = await db.createEmployee({
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily.davis@university.edu',
      password: 'password123',
      address: '321 Elm St',
      gender: 'F',
      official_day_off: 'Friday',
      years_of_experience: 10,
      national_ID: '4567890123456789',
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Tom Davis',
      emergency_contact_phone: '45678901234',
      annual_balance: 21,
      accidental_balance: 5,
      hire_date: '2014-06-10',
      last_working_date: null,
      dept_name: 'Computer Science'
    });
    await db.assignRoleToEmployee(emp4.employee_ID, 'HR_Representative_Computer Science');
    
    const emp5 = await db.createEmployee({
      first_name: 'Robert',
      last_name: 'Wilson',
      email: 'robert.wilson@university.edu',
      password: 'password123',
      address: '654 Maple Dr',
      gender: 'M',
      official_day_off: 'Friday',
      years_of_experience: 20,
      national_ID: '5678901234567890',
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Mary Wilson',
      emergency_contact_phone: '56789012345',
      annual_balance: 30,
      accidental_balance: 5,
      hire_date: '2005-01-01',
      last_working_date: null,
      dept_name: 'Computer Science'
    });
    await db.assignRoleToEmployee(emp5.employee_ID, 'President');
    
    // Initialize attendance for today
    const currentDate = db.getCurrentDate();
    const allEmployees = await db.getAllEmployees();
    for (const emp of allEmployees) {
      await db.createAttendance({
        date: currentDate,
        check_in_time: null,
        check_out_time: null,
        total_duration: null,
        emp_ID: emp.employee_ID,
        status: 'absent'
      });
    }
    
    // Calculate and update salaries
    for (const emp of allEmployees) {
      const roles = await db.getEmployeeRoles(emp.employee_ID);
      const roleDetails = await Promise.all(roles.map(r => db.getRoleByName(r.role_name)));
      const salary = db.calculateSalary(emp, roleDetails);
      await db.updateEmployee(emp.employee_ID, { salary });
      
      // Set annual and accidental balance from role
      const sortedRoles = roleDetails.filter(r => r).sort((a, b) => (a.rank || 999) - (b.rank || 999));
      if (sortedRoles.length > 0) {
        await db.updateEmployee(emp.employee_ID, {
          annual_balance: sortedRoles[0].annual_balance,
          accidental_balance: sortedRoles[0].accidental_balance
        });
      }
    }
    
    return c.json({ success: true, message: 'Database initialized successfully with sample data' });
  } catch (error) {
    console.log('Error initializing database:', error);
    return c.json({ success: false, message: `Error initializing database: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);
