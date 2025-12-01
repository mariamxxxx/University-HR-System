import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper functions
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const getCurrentMonth = () => {
  const now = new Date();
  return now.getMonth() + 1;
};

// Initialize sample data if not exists
async function initializeSampleData() {
  const existingEmployees = await kv.get('employees');
  if (!existingEmployees) {
    // Create sample employees
    const sampleEmployees = [
      {
        employee_ID: 1001,
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
        salary: 12500,
        hire_date: '2010-01-15',
        last_working_date: null,
        dept_name: 'Computer Science'
      },
      {
        employee_ID: 1002,
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
        salary: 8960,
        hire_date: '2016-09-01',
        last_working_date: null,
        dept_name: 'Computer Science'
      },
      {
        employee_ID: 1003,
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
        salary: 6900,
        hire_date: '2019-03-20',
        last_working_date: null,
        dept_name: 'Computer Science'
      },
      {
        employee_ID: 1004,
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
        salary: 6500,
        hire_date: '2014-06-10',
        last_working_date: null,
        dept_name: 'Computer Science'
      },
      {
        employee_ID: 1005,
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
        annual_balance: 25,
        accidental_balance: 5,
        salary: 15000,
        hire_date: '2005-02-01',
        last_working_date: null,
        dept_name: 'Computer Science'
      }
    ];

    await kv.set('employees', sampleEmployees);

    // Create roles
    const sampleRoles = [
      { emp_id: 1001, role_name: 'Dean' },
      { emp_id: 1002, role_name: 'Professor' },
      { emp_id: 1002, role_name: 'Vice Dean' },
      { emp_id: 1003, role_name: 'Assistant Professor' },
      { emp_id: 1004, role_name: 'HR Representative' },
      { emp_id: 1005, role_name: 'President' }
    ];
    await kv.set('roles', sampleRoles);

    // Initialize counters
    await kv.set('counter_employee', 1006);
    await kv.set('counter_leave', 1);
    await kv.set('counter_attendance', 1);
    await kv.set('counter_deduction', 1);
    await kv.set('counter_payroll', 1);
    await kv.set('counter_evaluation', 1);

    // Initialize empty arrays for other entities
    await kv.set('leaves', []);
    await kv.set('attendance', []);
    await kv.set('deductions', []);
    await kv.set('payroll', []);
    await kv.set('evaluations', []);
    await kv.set('holidays', []);

    console.log('Sample data initialized');
  }
}

// Authentication Routes
app.post('/make-server-a764e3d7/auth/admin/login', async (c) => {
  try {
    const { adminId, password } = await c.req.json();
    
    if (adminId === 'admin' && password === 'admin123') {
      return c.json({ success: true, message: 'Admin login successful' });
    }
    
    return c.json({ success: false, message: 'Invalid admin credentials' }, 401);
  } catch (error) {
    console.log('Admin login error:', error);
    return c.json({ error: 'Admin login failed' }, 500);
  }
});

app.post('/make-server-a764e3d7/auth/employee/login', async (c) => {
  try {
    const { employeeId, password } = await c.req.json();
    const employees = await kv.get('employees') || [];
    
    const employee = employees.find((e: any) => e.employee_ID === employeeId && e.password === password);
    
    if (employee) {
      return c.json({ success: true, data: employee });
    }
    
    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  } catch (error) {
    console.log('Employee login error:', error);
    return c.json({ error: 'Employee login failed' }, 500);
  }
});

app.post('/make-server-a764e3d7/auth/hr/login', async (c) => {
  try {
    const { employeeId, password } = await c.req.json();
    const employees = await kv.get('employees') || [];
    const roles = await kv.get('roles') || [];
    
    const employee = employees.find((e: any) => e.employee_ID === employeeId && e.password === password);
    const role = roles.find((r: any) => r.emp_id === employeeId);
    
    if (employee && role && role.role_name === 'HR Representative') {
      return c.json({ success: true, data: employee });
    }
    
    return c.json({ success: false, message: 'Invalid HR credentials' }, 401);
  } catch (error) {
    console.log('HR login error:', error);
    return c.json({ error: 'HR login failed' }, 500);
  }
});

app.post('/make-server-a764e3d7/auth/signup', async (c) => {
  try {
    const data = await c.req.json();
    const employees = await kv.get('employees') || [];
    
    // Check if email exists
    if (employees.some((e: any) => e.email === data.email)) {
      return c.json({ success: false, message: 'Email already exists' }, 400);
    }
    
    const counter = await kv.get('counter_employee') || 1006;
    const newEmployee = {
      employee_ID: counter,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      address: data.address || '',
      gender: data.gender,
      official_day_off: 'Friday',
      years_of_experience: 0,
      national_ID: data.national_ID,
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: data.emergency_contact_name || '',
      emergency_contact_phone: data.emergency_contact_phone || '',
      annual_balance: 21,
      accidental_balance: 5,
      salary: 5000,
      hire_date: getCurrentDate(),
      last_working_date: null,
      dept_name: data.dept_name
    };
    
    employees.push(newEmployee);
    await kv.set('employees', employees);
    await kv.set('counter_employee', counter + 1);
    
    return c.json({ success: true, message: `Employee account created successfully. Your Employee ID is: ${counter}` });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Employee Routes
app.get('/make-server-a764e3d7/employees', async (c) => {
  try {
    const employees = await kv.get('employees') || [];
    return c.json({ success: true, data: employees });
  } catch (error) {
    console.log('Get employees error:', error);
    return c.json({ error: 'Failed to get employees' }, 500);
  }
});

app.get('/make-server-a764e3d7/employees/by-department', async (c) => {
  try {
    const employees = await kv.get('employees') || [];
    const deptCounts: any = {};
    
    employees.forEach((emp: any) => {
      if (!deptCounts[emp.dept_name]) {
        deptCounts[emp.dept_name] = 0;
      }
      deptCounts[emp.dept_name]++;
    });
    
    const result = Object.keys(deptCounts).map(dept => ({
      dept_name: dept,
      Number_of_Employees: deptCounts[dept]
    }));
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get employees by dept error:', error);
    return c.json({ error: 'Failed to get employees by department' }, 500);
  }
});

// Attendance Routes
app.post('/make-server-a764e3d7/attendance/initiate', async (c) => {
  try {
    const employees = await kv.get('employees') || [];
    const attendance = await kv.get('attendance') || [];
    const counter = await kv.get('counter_attendance') || 1;
    const today = getCurrentDate();
    
    let added = 0;
    let currentCounter = counter;
    
    for (const emp of employees) {
      if (emp.employment_status === 'active' || emp.employment_status === 'onleave') {
        const exists = attendance.some((a: any) => a.emp_ID === emp.employee_ID && a.date === today);
        if (!exists) {
          attendance.push({
            attendance_ID: currentCounter++,
            date: today,
            check_in_time: null,
            check_out_time: null,
            total_duration: null,
            status: 'absent',
            emp_ID: emp.employee_ID
          });
          added++;
        }
      }
    }
    
    await kv.set('attendance', attendance);
    await kv.set('counter_attendance', currentCounter);
    
    return c.json({ success: true, message: `Attendance initiated for ${added} employees` });
  } catch (error) {
    console.log('Initiate attendance error:', error);
    return c.json({ error: 'Failed to initiate attendance' }, 500);
  }
});

app.post('/make-server-a764e3d7/attendance/update', async (c) => {
  try {
    const { employeeId, checkIn, checkOut } = await c.req.json();
    const attendance = await kv.get('attendance') || [];
    const today = getCurrentDate();
    
    const record = attendance.find((a: any) => a.emp_ID === employeeId && a.date === today);
    
    if (record) {
      if (checkIn) record.check_in_time = checkIn;
      if (checkOut) record.check_out_time = checkOut;
      
      if (record.check_in_time && record.check_out_time) {
        const [inH, inM] = record.check_in_time.split(':').map(Number);
        const [outH, outM] = record.check_out_time.split(':').map(Number);
        const duration = (outH * 60 + outM) - (inH * 60 + inM);
        record.total_duration = duration;
        record.status = 'attended';
      }
      
      await kv.set('attendance', attendance);
      return c.json({ success: true, message: 'Attendance updated successfully' });
    }
    
    return c.json({ success: false, message: 'Attendance record not found' }, 404);
  } catch (error) {
    console.log('Update attendance error:', error);
    return c.json({ error: 'Failed to update attendance' }, 500);
  }
});

app.get('/make-server-a764e3d7/attendance/:employeeId', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const attendance = await kv.get('attendance') || [];
    const currentMonth = getCurrentMonth();
    const currentYear = new Date().getFullYear();
    
    const result = attendance.filter((a: any) => {
      if (a.emp_ID !== employeeId) return false;
      const date = new Date(a.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get attendance error:', error);
    return c.json({ error: 'Failed to get attendance' }, 500);
  }
});

app.get('/make-server-a764e3d7/attendance/yesterday', async (c) => {
  try {
    const employees = await kv.get('employees') || [];
    const attendance = await kv.get('attendance') || [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const result = attendance
      .filter((a: any) => a.date === yesterdayStr)
      .map((a: any) => {
        const emp = employees.find((e: any) => e.employee_ID === a.emp_ID);
        return {
          ...a,
          'Employee Name': emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'
        };
      });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get yesterday attendance error:', error);
    return c.json({ error: 'Failed to get yesterday attendance' }, 500);
  }
});

// Leave Routes
app.post('/make-server-a764e3d7/leaves/annual', async (c) => {
  try {
    const { employeeId, startDate, endDate, replacementEmp } = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const counter = await kv.get('counter_leave') || 1;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave = {
      request_ID: counter,
      date_of_request: getCurrentDate(),
      start_date: startDate,
      end_date: endDate,
      num_days: numDays,
      status: 'pending',
      type: 'annual',
      emp_ID: employeeId,
      replacement_emp_ID: replacementEmp
    };
    
    leaves.push(newLeave);
    await kv.set('leaves', leaves);
    await kv.set('counter_leave', counter + 1);
    
    return c.json({ success: true, message: 'Annual leave submitted successfully' });
  } catch (error) {
    console.log('Submit annual leave error:', error);
    return c.json({ error: 'Failed to submit annual leave' }, 500);
  }
});

app.post('/make-server-a764e3d7/leaves/accidental', async (c) => {
  try {
    const { employeeId, startDate } = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const counter = await kv.get('counter_leave') || 1;
    
    const newLeave = {
      request_ID: counter,
      date_of_request: getCurrentDate(),
      start_date: startDate,
      end_date: startDate,
      num_days: 1,
      status: 'pending',
      type: 'accidental',
      emp_ID: employeeId
    };
    
    leaves.push(newLeave);
    await kv.set('leaves', leaves);
    await kv.set('counter_leave', counter + 1);
    
    return c.json({ success: true, message: 'Accidental leave submitted successfully' });
  } catch (error) {
    console.log('Submit accidental leave error:', error);
    return c.json({ error: 'Failed to submit accidental leave' }, 500);
  }
});

app.post('/make-server-a764e3d7/leaves/medical', async (c) => {
  try {
    const data = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const counter = await kv.get('counter_leave') || 1;
    
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave = {
      request_ID: counter,
      date_of_request: getCurrentDate(),
      start_date: data.start_date,
      end_date: data.end_date,
      num_days: numDays,
      status: 'pending',
      type: 'medical',
      medical_type: data.type,
      emp_ID: data.employee_ID
    };
    
    leaves.push(newLeave);
    await kv.set('leaves', leaves);
    await kv.set('counter_leave', counter + 1);
    
    return c.json({ success: true, message: 'Medical leave submitted successfully' });
  } catch (error) {
    console.log('Submit medical leave error:', error);
    return c.json({ error: 'Failed to submit medical leave' }, 500);
  }
});

app.post('/make-server-a764e3d7/leaves/unpaid', async (c) => {
  try {
    const data = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const counter = await kv.get('counter_leave') || 1;
    
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave = {
      request_ID: counter,
      date_of_request: getCurrentDate(),
      start_date: data.start_date,
      end_date: data.end_date,
      num_days: numDays,
      status: 'pending',
      type: 'unpaid',
      emp_ID: data.employee_ID
    };
    
    leaves.push(newLeave);
    await kv.set('leaves', leaves);
    await kv.set('counter_leave', counter + 1);
    
    return c.json({ success: true, message: 'Unpaid leave submitted successfully' });
  } catch (error) {
    console.log('Submit unpaid leave error:', error);
    return c.json({ error: 'Failed to submit unpaid leave' }, 500);
  }
});

app.post('/make-server-a764e3d7/leaves/compensation', async (c) => {
  try {
    const data = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const counter = await kv.get('counter_leave') || 1;
    
    const newLeave = {
      request_ID: counter,
      date_of_request: getCurrentDate(),
      start_date: data.compensation_date,
      end_date: data.compensation_date,
      num_days: 1,
      status: 'pending',
      type: 'compensation',
      reason: data.reason,
      original_workday: data.date_of_original_workday,
      replacement_emp_ID: data.replacement_emp,
      emp_ID: data.employee_ID
    };
    
    leaves.push(newLeave);
    await kv.set('leaves', leaves);
    await kv.set('counter_leave', counter + 1);
    
    return c.json({ success: true, message: 'Compensation leave submitted successfully' });
  } catch (error) {
    console.log('Submit compensation leave error:', error);
    return c.json({ error: 'Failed to submit compensation leave' }, 500);
  }
});

app.get('/make-server-a764e3d7/leaves/status/:employeeId', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const leaves = await kv.get('leaves') || [];
    
    const result = leaves
      .filter((l: any) => l.emp_ID === employeeId)
      .map((l: any) => ({
        request_id: l.request_ID,
        date_of_request: l.date_of_request,
        status: l.status
      }));
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get leave status error:', error);
    return c.json({ error: 'Failed to get leave status' }, 500);
  }
});

app.get('/make-server-a764e3d7/leaves/pending/:employeeId', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const leaves = await kv.get('leaves') || [];
    const employees = await kv.get('employees') || [];
    const roles = await kv.get('roles') || [];
    
    const approverRole = roles.find((r: any) => r.emp_id === employeeId);
    if (!approverRole || !['Dean', 'Vice Dean', 'President'].includes(approverRole.role_name)) {
      return c.json({ success: true, data: [] });
    }
    
    const pendingLeaves = leaves.filter((l: any) => l.status === 'pending');
    const result = pendingLeaves.map((l: any) => {
      const emp = employees.find((e: any) => e.employee_ID === l.emp_ID);
      return {
        Emp1_ID: employeeId,
        Leave_ID: l.request_ID,
        leaveType: l.type.charAt(0).toUpperCase() + l.type.slice(1),
        requestor: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
        leave: l
      };
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get pending approvals error:', error);
    return c.json({ error: 'Failed to get pending approvals' }, 500);
  }
});

app.post('/make-server-a764e3d7/leaves/approve', async (c) => {
  try {
    const { approverId, leaveId, status } = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const employees = await kv.get('employees') || [];
    
    const leave = leaves.find((l: any) => l.request_ID === leaveId);
    if (!leave) {
      return c.json({ success: false, message: 'Leave not found' }, 404);
    }
    
    leave.status = status;
    
    if (status === 'approved' && leave.type === 'annual') {
      const emp = employees.find((e: any) => e.employee_ID === leave.emp_ID);
      if (emp) {
        emp.annual_balance -= leave.num_days;
      }
    }
    
    if (status === 'approved' && leave.type === 'accidental') {
      const emp = employees.find((e: any) => e.employee_ID === leave.emp_ID);
      if (emp) {
        emp.accidental_balance -= 1;
      }
    }
    
    await kv.set('leaves', leaves);
    await kv.set('employees', employees);
    
    return c.json({ success: true, message: `Leave ${status} successfully` });
  } catch (error) {
    console.log('Approve leave error:', error);
    return c.json({ error: 'Failed to approve leave' }, 500);
  }
});

app.get('/make-server-a764e3d7/leaves/pending', async (c) => {
  try {
    const leaves = await kv.get('leaves') || [];
    const employees = await kv.get('employees') || [];
    
    const pendingLeaves = leaves.filter((l: any) => l.status === 'pending');
    const result = pendingLeaves.map((l: any) => {
      const emp = employees.find((e: any) => e.employee_ID === l.emp_ID);
      return {
        request_ID: l.request_ID,
        employee_ID: l.emp_ID,
        employee: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
        leaveType: l.type.charAt(0).toUpperCase() + l.type.slice(1),
        start_date: l.start_date,
        end_date: l.end_date,
        num_days: l.num_days,
        date_of_request: l.date_of_request
      };
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get pending leaves error:', error);
    return c.json({ error: 'Failed to get pending leaves' }, 500);
  }
});

app.post('/make-server-a764e3d7/leaves/hr-approve', async (c) => {
  try {
    const { requestId, hrId, leaveType } = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    
    const leave = leaves.find((l: any) => l.request_ID === requestId);
    if (!leave) {
      return c.json({ success: false, message: 'Leave not found' }, 404);
    }
    
    leave.status = 'approved';
    await kv.set('leaves', leaves);
    
    return c.json({ success: true, message: 'Leave approved by HR successfully' });
  } catch (error) {
    console.log('HR approve leave error:', error);
    return c.json({ error: 'Failed to approve leave' }, 500);
  }
});

app.get('/make-server-a764e3d7/leaves/medical/rejected', async (c) => {
  try {
    const leaves = await kv.get('leaves') || [];
    const result = leaves.filter((l: any) => l.type === 'medical' && l.status === 'rejected');
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get rejected medical leaves error:', error);
    return c.json({ error: 'Failed to get rejected medical leaves' }, 500);
  }
});

app.delete('/make-server-a764e3d7/leaves/remove-approved/:employeeId', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const attendance = await kv.get('attendance') || [];
    const leaves = await kv.get('leaves') || [];
    
    const approvedLeaves = leaves.filter((l: any) => l.emp_ID === employeeId && l.status === 'approved');
    
    for (const leave of approvedLeaves) {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);
      
      for (let d = new Date(leaveStart); d <= leaveEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const index = attendance.findIndex((a: any) => a.emp_ID === employeeId && a.date === dateStr);
        if (index !== -1) {
          attendance.splice(index, 1);
        }
      }
    }
    
    await kv.set('attendance', attendance);
    return c.json({ success: true, message: 'Approved leave days removed from attendance' });
  } catch (error) {
    console.log('Remove approved leaves error:', error);
    return c.json({ error: 'Failed to remove approved leaves' }, 500);
  }
});

app.get('/make-server-a764e3d7/leaves/all', async (c) => {
  try {
    const leaves = await kv.get('leaves') || [];
    const employees = await kv.get('employees') || [];
    
    const result = leaves.map((l: any) => {
      const emp = employees.find((e: any) => e.employee_ID === l.emp_ID);
      return {
        ...l,
        employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
        employee_dept: emp?.dept_name || ''
      };
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get all leaves error:', error);
    return c.json({ error: 'Failed to get all leaves' }, 500);
  }
});

// Deduction Routes
app.get('/make-server-a764e3d7/deductions/:employeeId/:month', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const month = parseInt(c.req.param('month'));
    const deductions = await kv.get('deductions') || [];
    
    const result = deductions.filter((d: any) => {
      if (d.emp_ID !== employeeId) return false;
      const date = new Date(d.date);
      return date.getMonth() + 1 === month;
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get deductions error:', error);
    return c.json({ error: 'Failed to get deductions' }, 500);
  }
});

app.post('/make-server-a764e3d7/deductions/hours', async (c) => {
  try {
    const { employeeId } = await c.req.json();
    const attendance = await kv.get('attendance') || [];
    const deductions = await kv.get('deductions') || [];
    const counter = await kv.get('counter_deduction') || 1;
    const currentMonth = getCurrentMonth();
    
    let currentCounter = counter;
    let count = 0;
    
    const monthAttendance = attendance.filter((a: any) => {
      if (a.emp_ID !== employeeId) return false;
      const date = new Date(a.date);
      return date.getMonth() + 1 === currentMonth && a.status === 'attended' && a.total_duration < 480;
    });
    
    for (const att of monthAttendance) {
      deductions.push({
        deduction_ID: currentCounter++,
        type: 'missing_hours',
        amount: 50,
        date: att.date,
        status: 'pending',
        emp_ID: employeeId
      });
      count++;
    }
    
    await kv.set('deductions', deductions);
    await kv.set('counter_deduction', currentCounter);
    
    return c.json({ success: true, message: `Added ${count} deductions for missing hours` });
  } catch (error) {
    console.log('Add deduction hours error:', error);
    return c.json({ error: 'Failed to add deduction hours' }, 500);
  }
});

app.post('/make-server-a764e3d7/deductions/days', async (c) => {
  try {
    const { employeeId } = await c.req.json();
    const attendance = await kv.get('attendance') || [];
    const deductions = await kv.get('deductions') || [];
    const counter = await kv.get('counter_deduction') || 1;
    const currentMonth = getCurrentMonth();
    
    let currentCounter = counter;
    let count = 0;
    
    const monthAttendance = attendance.filter((a: any) => {
      if (a.emp_ID !== employeeId) return false;
      const date = new Date(a.date);
      return date.getMonth() + 1 === currentMonth && a.status === 'absent';
    });
    
    for (const att of monthAttendance) {
      deductions.push({
        deduction_ID: currentCounter++,
        type: 'missing_days',
        amount: 100,
        date: att.date,
        status: 'pending',
        emp_ID: employeeId
      });
      count++;
    }
    
    await kv.set('deductions', deductions);
    await kv.set('counter_deduction', currentCounter);
    
    return c.json({ success: true, message: `Added ${count} deductions for missing days` });
  } catch (error) {
    console.log('Add deduction days error:', error);
    return c.json({ error: 'Failed to add deduction days' }, 500);
  }
});

app.post('/make-server-a764e3d7/deductions/unpaid', async (c) => {
  try {
    const { employeeId } = await c.req.json();
    const leaves = await kv.get('leaves') || [];
    const deductions = await kv.get('deductions') || [];
    const employees = await kv.get('employees') || [];
    const counter = await kv.get('counter_deduction') || 1;
    
    const emp = employees.find((e: any) => e.employee_ID === employeeId);
    if (!emp) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const unpaidLeaves = leaves.filter((l: any) => 
      l.emp_ID === employeeId && l.type === 'unpaid' && l.status === 'approved'
    );
    
    let currentCounter = counter;
    const dailyRate = emp.salary / 30;
    
    for (const leave of unpaidLeaves) {
      const amount = dailyRate * leave.num_days;
      deductions.push({
        deduction_ID: currentCounter++,
        type: 'unpaid_leave',
        amount: amount,
        date: leave.start_date,
        status: 'pending',
        emp_ID: employeeId
      });
    }
    
    await kv.set('deductions', deductions);
    await kv.set('counter_deduction', currentCounter);
    
    return c.json({ success: true, message: `Added deductions for unpaid leave` });
  } catch (error) {
    console.log('Add deduction unpaid error:', error);
    return c.json({ error: 'Failed to add deduction unpaid' }, 500);
  }
});

app.delete('/make-server-a764e3d7/deductions/remove-resigned', async (c) => {
  try {
    const employees = await kv.get('employees') || [];
    const deductions = await kv.get('deductions') || [];
    
    const resignedIds = employees
      .filter((e: any) => e.employment_status === 'resigned')
      .map((e: any) => e.employee_ID);
    
    const remainingDeductions = deductions.filter((d: any) => !resignedIds.includes(d.emp_ID));
    const removed = deductions.length - remainingDeductions.length;
    
    await kv.set('deductions', remainingDeductions);
    
    return c.json({ success: true, message: `Removed ${removed} deductions for resigned employees` });
  } catch (error) {
    console.log('Remove resigned deductions error:', error);
    return c.json({ error: 'Failed to remove resigned deductions' }, 500);
  }
});

// Payroll Routes
app.get('/make-server-a764e3d7/payroll/:employeeId/last-month', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const payroll = await kv.get('payroll') || [];
    
    const result = payroll.filter((p: any) => p.emp_ID === employeeId);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get last month payroll error:', error);
    return c.json({ error: 'Failed to get last month payroll' }, 500);
  }
});

app.post('/make-server-a764e3d7/payroll/generate', async (c) => {
  try {
    const { employeeId, fromDate, toDate } = await c.req.json();
    const employees = await kv.get('employees') || [];
    const deductions = await kv.get('deductions') || [];
    const payroll = await kv.get('payroll') || [];
    const counter = await kv.get('counter_payroll') || 1;
    
    const employee = employees.find((e: any) => e.employee_ID === employeeId);
    if (!employee) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const baseSalary = employee.salary;
    const bonusAmount = 500;
    
    const periodDeductions = deductions.filter((d: any) => {
      const dedDate = new Date(d.date);
      return d.emp_ID === employeeId &&
             dedDate >= new Date(fromDate) &&
             dedDate <= new Date(toDate);
    });
    
    const deductionsAmount = periodDeductions.reduce((sum: number, d: any) => sum + d.amount, 0);
    const finalSalary = baseSalary + bonusAmount - deductionsAmount;
    
    const newPayroll = {
      ID: counter,
      payment_date: getCurrentDate(),
      final_salary_amount: finalSalary,
      from_date: fromDate,
      to_date: toDate,
      comments: '',
      bonus_amount: bonusAmount,
      deductions_amount: deductionsAmount,
      emp_ID: employeeId
    };
    
    payroll.push(newPayroll);
    
    // Finalize deductions
    periodDeductions.forEach((d: any) => {
      d.status = 'finalized';
    });
    
    await kv.set('payroll', payroll);
    await kv.set('deductions', deductions);
    await kv.set('counter_payroll', counter + 1);
    
    return c.json({ success: true, message: 'Payroll generated successfully', data: newPayroll });
  } catch (error) {
    console.log('Generate payroll error:', error);
    return c.json({ error: 'Failed to generate payroll' }, 500);
  }
});

app.post('/make-server-a764e3d7/payroll/generate-all', async (c) => {
  try {
    const { fromDate, toDate } = await c.req.json();
    const employees = await kv.get('employees') || [];
    const deductions = await kv.get('deductions') || [];
    const payroll = await kv.get('payroll') || [];
    let counter = await kv.get('counter_payroll') || 1;
    
    const results = [];
    
    for (const employee of employees) {
      if (employee.employment_status === 'active' || employee.employment_status === 'onleave') {
        const baseSalary = employee.salary;
        const bonusAmount = 500;
        
        const periodDeductions = deductions.filter((d: any) => {
          const dedDate = new Date(d.date);
          return d.emp_ID === employee.employee_ID &&
                 dedDate >= new Date(fromDate) &&
                 dedDate <= new Date(toDate);
        });
        
        const deductionsAmount = periodDeductions.reduce((sum: number, d: any) => sum + d.amount, 0);
        const finalSalary = baseSalary + bonusAmount - deductionsAmount;
        
        const newPayroll = {
          ID: counter++,
          payment_date: getCurrentDate(),
          final_salary_amount: finalSalary,
          from_date: fromDate,
          to_date: toDate,
          comments: '',
          bonus_amount: bonusAmount,
          deductions_amount: deductionsAmount,
          emp_ID: employee.employee_ID
        };
        
        payroll.push(newPayroll);
        results.push(newPayroll);
        
        periodDeductions.forEach((d: any) => {
          d.status = 'finalized';
        });
      }
    }
    
    await kv.set('payroll', payroll);
    await kv.set('deductions', deductions);
    await kv.set('counter_payroll', counter);
    
    return c.json({ success: true, message: `Generated payroll for ${results.length} employees`, data: results });
  } catch (error) {
    console.log('Generate payroll for all error:', error);
    return c.json({ error: 'Failed to generate payroll for all' }, 500);
  }
});

app.get('/make-server-a764e3d7/payroll/all', async (c) => {
  try {
    const payroll = await kv.get('payroll') || [];
    const employees = await kv.get('employees') || [];
    
    const result = payroll.map((p: any) => {
      const emp = employees.find((e: any) => e.employee_ID === p.emp_ID);
      return {
        ...p,
        employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
        employee_dept: emp?.dept_name || ''
      };
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get all payroll error:', error);
    return c.json({ error: 'Failed to get all payroll' }, 500);
  }
});

// Performance Routes
app.get('/make-server-a764e3d7/performance/:employeeId/:semester', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const semester = c.req.param('semester');
    const evaluations = await kv.get('evaluations') || [];
    
    const result = evaluations.filter((e: any) => e.employee_ID === employeeId && e.semester === semester);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get performance error:', error);
    return c.json({ error: 'Failed to get performance' }, 500);
  }
});

app.get('/make-server-a764e3d7/performance/winter', async (c) => {
  try {
    const evaluations = await kv.get('evaluations') || [];
    const employees = await kv.get('employees') || [];
    
    const winterEvals = evaluations.filter((e: any) => e.semester.startsWith('W'));
    const result = winterEvals.map((e: any) => {
      const emp = employees.find((emp: any) => emp.employee_ID === e.employee_ID);
      return {
        ...e,
        'Employee Name': emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'
      };
    });
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.log('Get winter performance error:', error);
    return c.json({ error: 'Failed to get winter performance' }, 500);
  }
});

app.post('/make-server-a764e3d7/performance/evaluate', async (c) => {
  try {
    const data = await c.req.json();
    const evaluations = await kv.get('evaluations') || [];
    const counter = await kv.get('counter_evaluation') || 1;
    
    const newEvaluation = {
      evaluation_ID: counter,
      employee_ID: data.employee_ID,
      evaluator_ID: data.evaluator_ID,
      rating: data.rating,
      comments: data.comments,
      semester: data.semester,
      evaluation_date: getCurrentDate()
    };
    
    evaluations.push(newEvaluation);
    await kv.set('evaluations', evaluations);
    await kv.set('counter_evaluation', counter + 1);
    
    return c.json({ success: true, message: 'Evaluation submitted successfully' });
  } catch (error) {
    console.log('Submit evaluation error:', error);
    return c.json({ error: 'Failed to submit evaluation' }, 500);
  }
});

// Holiday Routes
app.post('/make-server-a764e3d7/holidays', async (c) => {
  try {
    const { name, fromDate, toDate } = await c.req.json();
    const holidays = await kv.get('holidays') || [];
    
    holidays.push({
      name,
      from_date: fromDate,
      to_date: toDate
    });
    
    await kv.set('holidays', holidays);
    
    return c.json({ success: true, message: 'Holiday added successfully' });
  } catch (error) {
    console.log('Add holiday error:', error);
    return c.json({ error: 'Failed to add holiday' }, 500);
  }
});

app.delete('/make-server-a764e3d7/holidays/remove-attendance', async (c) => {
  try {
    const holidays = await kv.get('holidays') || [];
    const attendance = await kv.get('attendance') || [];
    
    let removed = 0;
    const remainingAttendance = attendance.filter((a: any) => {
      const attDate = new Date(a.date);
      const isHoliday = holidays.some((h: any) => {
        const hStart = new Date(h.from_date);
        const hEnd = new Date(h.to_date);
        return attDate >= hStart && attDate <= hEnd;
      });
      if (isHoliday) removed++;
      return !isHoliday;
    });
    
    await kv.set('attendance', remainingAttendance);
    
    return c.json({ success: true, message: `Removed ${removed} attendance records during holidays` });
  } catch (error) {
    console.log('Remove holiday attendance error:', error);
    return c.json({ error: 'Failed to remove holiday attendance' }, 500);
  }
});

// Operations Routes
app.post('/make-server-a764e3d7/operations/replace-employee', async (c) => {
  try {
    const { emp1Id, emp2Id, fromDate, toDate } = await c.req.json();
    
    // In a real system, this would create a replacement record
    // For now, we'll just acknowledge it
    
    return c.json({ success: true, message: 'Employee replacement recorded successfully' });
  } catch (error) {
    console.log('Replace employee error:', error);
    return c.json({ error: 'Failed to replace employee' }, 500);
  }
});

app.post('/make-server-a764e3d7/operations/update-status', async (c) => {
  try {
    const { employeeId } = await c.req.json();
    const employees = await kv.get('employees') || [];
    const leaves = await kv.get('leaves') || [];
    
    const emp = employees.find((e: any) => e.employee_ID === employeeId);
    if (!emp) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const today = new Date();
    const activeLeaves = leaves.filter((l: any) => {
      if (l.emp_ID !== employeeId || l.status !== 'approved') return false;
      const start = new Date(l.start_date);
      const end = new Date(l.end_date);
      return today >= start && today <= end;
    });
    
    emp.employment_status = activeLeaves.length > 0 ? 'onleave' : 'active';
    
    await kv.set('employees', employees);
    
    return c.json({ success: true, message: 'Employment status updated successfully' });
  } catch (error) {
    console.log('Update status error:', error);
    return c.json({ error: 'Failed to update status' }, 500);
  }
});

app.delete('/make-server-a764e3d7/operations/remove-day-off/:employeeId', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const employees = await kv.get('employees') || [];
    const attendance = await kv.get('attendance') || [];
    
    const emp = employees.find((e: any) => e.employee_ID === employeeId);
    if (!emp) {
      return c.json({ success: false, message: 'Employee not found' }, 404);
    }
    
    const dayOff = emp.official_day_off;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOffIndex = daysOfWeek.indexOf(dayOff);
    
    const removedAttendance = attendance.filter((a: any) => {
      if (a.emp_ID !== employeeId) return true;
      const date = new Date(a.date);
      return date.getDay() !== dayOffIndex;
    });
    
    const removed = attendance.length - removedAttendance.length;
    
    await kv.set('attendance', removedAttendance);
    
    return c.json({ success: true, message: `Removed ${removed} day-off records` });
  } catch (error) {
    console.log('Remove day-off error:', error);
    return c.json({ error: 'Failed to remove day-off' }, 500);
  }
});

// Role Routes
app.get('/make-server-a764e3d7/roles/check-approver/:employeeId', async (c) => {
  try {
    const employeeId = parseInt(c.req.param('employeeId'));
    const roles = await kv.get('roles') || [];
    
    const role = roles.find((r: any) => r.emp_id === employeeId);
    if (!role) {
      return c.json({ success: true, data: { isApprover: false, role: null } });
    }
    
    const isApprover = ['Dean', 'Vice Dean', 'President'].includes(role.role_name);
    
    return c.json({ success: true, data: { isApprover, role: role.role_name } });
  } catch (error) {
    console.log('Check approver error:', error);
    return c.json({ error: 'Failed to check approver' }, 500);
  }
});

// Initialize data on startup
await initializeSampleData();

Deno.serve(app.fetch);