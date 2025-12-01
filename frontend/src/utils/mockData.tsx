// Mock data store for prototype testing
let mockData = {
  employees: [
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
      annual_balance: 30,
      accidental_balance: 5,
      salary: 16500,
      hire_date: '2005-01-01',
      last_working_date: null,
      dept_name: 'Computer Science'
    },
    {
      employee_ID: 1006,
      first_name: 'David',
      last_name: 'Miller',
      email: 'david.miller@university.edu',
      password: 'password123',
      address: '111 Birch Ln',
      gender: 'M',
      official_day_off: 'Friday',
      years_of_experience: 12,
      national_ID: '6789012345678901',
      employment_status: 'active',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Anna Miller',
      emergency_contact_phone: '67890123456',
      annual_balance: 25,
      accidental_balance: 5,
      salary: 10800,
      hire_date: '2012-03-15',
      last_working_date: null,
      dept_name: 'Engineering'
    },
    {
      employee_ID: 1007,
      first_name: 'Jennifer',
      last_name: 'Garcia',
      email: 'jennifer.garcia@university.edu',
      password: 'password123',
      address: '222 Cedar St',
      gender: 'F',
      official_day_off: 'Saturday',
      years_of_experience: 7,
      national_ID: '7890123456789012',
      employment_status: 'resigned',
      type_of_contract: 'full_time',
      emergency_contact_name: 'Carlos Garcia',
      emergency_contact_phone: '78901234567',
      annual_balance: 21,
      accidental_balance: 5,
      salary: 8240,
      hire_date: '2017-08-20',
      last_working_date: '2024-11-15',
      dept_name: 'Business'
    }
  ],
  departments: [
    { name: 'Computer Science', building_location: 'Building A' },
    { name: 'Engineering', building_location: 'Building B' },
    { name: 'Business', building_location: 'Building C' }
  ],
  roles: [
    { role_name: 'President', title: 'President', description: 'University President', rank: 1, emp_id: 1005 },
    { role_name: 'Dean', title: 'Dean', description: 'Department Dean', rank: 3, emp_id: 1001 },
    { role_name: 'Professor', title: 'Professor', description: 'Professor', rank: 5, emp_id: 1002 },
    { role_name: 'Assistant Professor', title: 'Assistant Professor', description: 'Assistant Professor', rank: 7, emp_id: 1003 },
    { role_name: 'HR_Representative_Computer Science', title: 'HR Representative', description: 'HR Rep CS', rank: 11, emp_id: 1004 },
    { role_name: 'Dean', title: 'Dean', description: 'Engineering Dean', rank: 3, emp_id: 1006 }
  ],
  attendance: [
    {
      attendance_ID: 1,
      date: '2024-11-27',
      check_in_time: '08:00',
      check_out_time: '17:00',
      total_duration: 540,
      status: 'attended',
      emp_ID: 1001
    },
    {
      attendance_ID: 2,
      date: '2024-11-27',
      check_in_time: '08:30',
      check_out_time: '16:30',
      total_duration: 480,
      status: 'attended',
      emp_ID: 1002
    },
    {
      attendance_ID: 3,
      date: '2024-11-27',
      check_in_time: null,
      check_out_time: null,
      total_duration: null,
      status: 'absent',
      emp_ID: 1003
    },
    {
      attendance_ID: 4,
      date: '2024-11-27',
      check_in_time: '09:00',
      check_out_time: '15:00',
      total_duration: 360,
      status: 'attended',
      emp_ID: 1004
    },
    {
      attendance_ID: 5,
      date: '2024-11-28',
      check_in_time: null,
      check_out_time: null,
      total_duration: null,
      status: 'absent',
      emp_ID: 1001
    },
    {
      attendance_ID: 6,
      date: '2024-11-28',
      check_in_time: null,
      check_out_time: null,
      total_duration: null,
      status: 'absent',
      emp_ID: 1002
    }
  ],
  leaves: [
    {
      request_ID: 1,
      date_of_request: '2024-11-20',
      start_date: '2024-12-01',
      end_date: '2024-12-05',
      num_days: 5,
      final_approval_status: 'pending',
      type: 'annual',
      emp_ID: 1002,
      replacement_emp: 1003
    },
    {
      request_ID: 2,
      date_of_request: '2024-11-25',
      start_date: '2024-11-26',
      end_date: '2024-11-26',
      num_days: 1,
      final_approval_status: 'approved',
      type: 'accidental',
      emp_ID: 1003
    },
    {
      request_ID: 3,
      date_of_request: '2024-11-15',
      start_date: '2024-11-18',
      end_date: '2024-11-22',
      num_days: 5,
      final_approval_status: 'rejected',
      type: 'medical',
      emp_ID: 1004,
      medical_type: 'sick',
      insurance_status: false
    }
  ],
  performance: [
    {
      performance_ID: 1,
      rating: 5,
      comments: 'Excellent teaching and research',
      semester: 'W23',
      emp_ID: 1002
    },
    {
      performance_ID: 2,
      rating: 4,
      comments: 'Good performance',
      semester: 'W23',
      emp_ID: 1003
    },
    {
      performance_ID: 3,
      rating: 5,
      comments: 'Outstanding leadership',
      semester: 'W24',
      emp_ID: 1001
    }
  ],
  payroll: [
    {
      ID: 1,
      payment_date: '2024-11-01',
      final_salary_amount: 8500,
      from_date: '2024-10-01',
      to_date: '2024-10-31',
      comments: 'October payroll',
      bonus_amount: 500,
      deductions_amount: 200,
      emp_ID: 1002
    }
  ],
  deductions: [
    {
      deduction_ID: 1,
      emp_ID: 1004,
      date: '2024-11-27',
      amount: 150,
      type: 'missing_hours',
      status: 'pending',
      unpaid_ID: null as number | null,
      attendance_ID: 4
    },
    {
      deduction_ID: 2,
      emp_ID: 1007,
      date: '2024-11-20',
      amount: 300,
      type: 'missing_days',
      status: 'pending',
      unpaid_ID: null as number | null,
      attendance_ID: null
    }
  ],
  holidays: [
    {
      holiday_id: 1,
      name: 'Christmas Break',
      from_date: '2024-12-24',
      to_date: '2024-12-26'
    }
  ],
  approvals: [
    {
      Emp1_ID: 1001,
      Leave_ID: 1,
      status: 'pending'
    },
    {
      Emp1_ID: 1004,
      Leave_ID: 1,
      status: 'pending'
    }
  ],
  counters: {
    employee: 1008,
    leave: 4,
    attendance: 7,
    performance: 4,
    payroll: 2,
    deduction: 3,
    holiday: 2
  }
};

// Helper functions
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

function getDayOfWeek(date: string) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

// Mock API functions
export const mockAPI = {
  // Admin login
  adminLogin: async (adminId: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (adminId === 'admin' && password === 'admin123') {
      return { success: true, message: 'Admin login successful' };
    }
    return { success: false, message: 'Invalid admin credentials' };
  },

  // Employee signup
  signupEmployee: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    const emailExists = mockData.employees.some(e => e.email === data.email);
    if (emailExists) {
      return { success: false, message: 'Email already exists' };
    }

    // Create new employee
    const newEmployee = {
      employee_ID: mockData.counters.employee++,
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

    mockData.employees.push(newEmployee);
    return { success: true, message: `Employee account created successfully. Your Employee ID is: ${newEmployee.employee_ID}` };
  },

  // Employee login
  employeeLogin: async (employeeId: number, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    if (employee && employee.password === password) {
      return { success: true, message: 'Login successful', data: employee };
    }
    return { success: false, message: employee ? 'Invalid password' : 'Employee not found' };
  },

  // HR login
  hrLogin: async (employeeId: number, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    if (employee.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    const hasHRRole = mockData.roles.some(r => r.emp_id === employeeId && r.role_name.includes('HR'));
    if (!hasHRRole) {
      return { success: false, message: 'Not an HR employee' };
    }
    return { success: true, message: 'HR login successful', data: employee };
  },

  // Get all employees
  getEmployees: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: mockData.employees };
  },

  // Get employees per department
  getEmployeesPerDept: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const counts = mockData.departments.map(dept => ({
      dept_name: dept.name,
      Number_of_Employees: mockData.employees.filter(e => e.dept_name === dept.name).length
    }));
    return { success: true, data: counts };
  },

  // Get rejected medical leaves
  getRejectedMedicals: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const rejected = mockData.leaves.filter(l => l.type === 'medical' && l.final_approval_status === 'rejected');
    return { success: true, data: rejected };
  },

  // Remove deductions for resigned employees
  removeResignedDeductions: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const resignedIds = mockData.employees.filter(e => e.employment_status === 'resigned').map(e => e.employee_ID);
    const removedCount = mockData.deductions.filter(d => resignedIds.includes(d.emp_ID)).length;
    mockData.deductions = mockData.deductions.filter(d => !resignedIds.includes(d.emp_ID));
    return { success: true, message: `Removed ${removedCount} deductions for resigned employees` };
  },

  // Update attendance
  updateAttendance: async (employeeId: number, checkIn: string, checkOut: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentDate = getCurrentDate();
    const attendance = mockData.attendance.find(a => a.emp_ID === employeeId && a.date === currentDate);
    
    if (!attendance) {
      return { success: false, message: 'No attendance record found for today' };
    }

    const totalDuration = checkIn && checkOut ? 
      (parseInt(checkOut.split(':')[0]) * 60 + parseInt(checkOut.split(':')[1])) - 
      (parseInt(checkIn.split(':')[0]) * 60 + parseInt(checkIn.split(':')[1])) : null;
    
    attendance.check_in_time = checkIn || null;
    attendance.check_out_time = checkOut || null;
    attendance.total_duration = totalDuration;
    attendance.status = checkIn ? 'attended' : 'absent';
    
    return { success: true, message: 'Attendance updated successfully' };
  },

  // Add holiday
  addHoliday: async (name: string, fromDate: string, toDate: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const holiday = {
      holiday_id: mockData.counters.holiday++,
      name,
      from_date: fromDate,
      to_date: toDate
    };
    mockData.holidays.push(holiday);
    return { success: true, message: 'Holiday added successfully', data: holiday };
  },

  // Initiate attendance
  initiateAttendance: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentDate = getCurrentDate();
    let count = 0;
    
    mockData.employees.forEach(emp => {
      const existing = mockData.attendance.find(a => a.emp_ID === emp.employee_ID && a.date === currentDate);
      if (!existing) {
        mockData.attendance.push({
          attendance_ID: mockData.counters.attendance++,
          date: currentDate,
          check_in_time: null,
          check_out_time: null,
          total_duration: null,
          status: 'absent',
          emp_ID: emp.employee_ID
        });
        count++;
      }
    });
    
    return { success: true, message: `Initiated attendance for ${count} employees` };
  },

  // Get yesterday's attendance
  getYesterdayAttendance: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const yesterdayDate = getYesterdayDate();
    const yesterdayAttendance = mockData.attendance
      .filter(a => a.date === yesterdayDate)
      .map(a => {
        const emp = mockData.employees.find(e => e.employee_ID === a.emp_ID);
        return {
          'Employee Name': emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
          ...a
        };
      });
    return { success: true, data: yesterdayAttendance };
  },

  // Get winter performance
  getWinterPerformance: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const winter = mockData.performance
      .filter(p => p.semester.startsWith('W'))
      .map(p => {
        const emp = mockData.employees.find(e => e.employee_ID === p.emp_ID);
        return {
          'Employee Name': emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
          ...p
        };
      });
    return { success: true, data: winter };
  },

  // Remove holiday attendance
  removeHolidayAttendance: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let removedCount = 0;
    mockData.holidays.forEach(holiday => {
      const toRemove = mockData.attendance.filter(a => {
        const attDate = new Date(a.date);
        const fromDate = new Date(holiday.from_date);
        const toDate = new Date(holiday.to_date);
        return attDate >= fromDate && attDate <= toDate;
      });
      removedCount += toRemove.length;
    });
    mockData.attendance = mockData.attendance.filter(a => {
      return !mockData.holidays.some(h => {
        const attDate = new Date(a.date);
        const fromDate = new Date(h.from_date);
        const toDate = new Date(h.to_date);
        return attDate >= fromDate && attDate <= toDate;
      });
    });
    return { success: true, message: `Removed ${removedCount} attendance records during holidays` };
  },

  // Remove day-off
  removeDayOff: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    const currentMonth = getCurrentMonth();
    const toRemove = mockData.attendance.filter(a => 
      a.emp_ID === employeeId &&
      a.status === 'absent' &&
      new Date(a.date).getMonth() + 1 === currentMonth &&
      getDayOfWeek(a.date) === employee.official_day_off
    );
    
    mockData.attendance = mockData.attendance.filter(a => !toRemove.includes(a));
    return { success: true, message: `Removed ${toRemove.length} unattended day-off records` };
  },

  // Remove approved leaves
  removeApprovedLeaves: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const approvedLeaves = mockData.leaves.filter(l => 
      l.final_approval_status === 'approved' && l.emp_ID === employeeId
    );
    
    let removedCount = 0;
    approvedLeaves.forEach(leave => {
      const toRemove = mockData.attendance.filter(a => {
        const attDate = new Date(a.date);
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        return attDate >= startDate && attDate <= endDate;
      });
      removedCount += toRemove.length;
    });
    
    mockData.attendance = mockData.attendance.filter(a => {
      return !approvedLeaves.some(l => {
        const attDate = new Date(a.date);
        const startDate = new Date(l.start_date);
        const endDate = new Date(l.end_date);
        return attDate >= startDate && attDate <= endDate;
      });
    });
    
    return { success: true, message: `Removed ${removedCount} attendance records for approved leaves` };
  },

  // Replace employee
  replaceEmployee: async (emp1: number, emp2: number, fromDate: string, toDate: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'Employee replacement recorded successfully' };
  },

  // Update employment status
  updateEmploymentStatus: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    const currentDate = getCurrentDate();
    const isOnLeave = mockData.leaves.some(l => 
      l.emp_ID === employeeId &&
      l.final_approval_status !== 'rejected' &&
      new Date(l.start_date) <= new Date(currentDate) &&
      new Date(l.end_date) >= new Date(currentDate)
    );
    
    employee.employment_status = isOnLeave ? 'onleave' : 'active';
    return { success: true, message: `Employment status updated to ${employee.employment_status}` };
  },

  // Get employee performance
  getPerformance: async (employeeId: number, semester: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const perf = mockData.performance.filter(p => p.emp_ID === employeeId && p.semester === semester);
    return { success: true, data: perf };
  },

  // Get employee attendance
  getAttendance: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    const currentMonth = getCurrentMonth();
    const attendance = mockData.attendance.filter(a => {
      const attMonth = new Date(a.date).getMonth() + 1;
      const isDayOff = a.status === 'absent' && getDayOfWeek(a.date) === employee.official_day_off;
      return a.emp_ID === employeeId && attMonth === currentMonth && !isDayOff;
    });
    
    return { success: true, data: attendance };
  },

  // Get last month payroll
  getLastMonthPayroll: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lastMonth = getCurrentMonth() - 1;
    const payroll = mockData.payroll.filter(p => {
      const payrollMonth = new Date(p.from_date).getMonth() + 1;
      return p.emp_ID === employeeId && payrollMonth === lastMonth;
    });
    return { success: true, data: payroll };
  },

  // Get deductions
  getDeductions: async (employeeId: number, month: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const deductions = mockData.deductions.filter(d => {
      const dedMonth = new Date(d.date).getMonth() + 1;
      return d.emp_ID === employeeId && dedMonth === month && d.type === 'missing_days';
    });
    return { success: true, data: deductions };
  },

  // Submit annual leave
  submitAnnualLeave: async (employeeId: number, startDate: string, endDate: string, replacementEmp: number | null) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    if (employee.type_of_contract !== 'full_time') {
      return { success: false, message: 'Only full-time employees can apply for annual leave' };
    }
    
    if (!replacementEmp) {
      return { success: false, message: 'Replacement employee is required' };
    }
    
    const numDays = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (employee.annual_balance < numDays) {
      return { success: false, message: 'Insufficient annual leave balance' };
    }
    
    const leave = {
      request_ID: mockData.counters.leave++,
      date_of_request: getCurrentDate(),
      start_date: startDate,
      end_date: endDate,
      num_days: numDays,
      final_approval_status: 'pending',
      type: 'annual',
      emp_ID: employeeId,
      replacement_emp: replacementEmp
    };
    
    mockData.leaves.push(leave);
    
    // Add approvals
    const deanRole = mockData.roles.find(r => r.role_name === 'Dean' && mockData.employees.find(e => e.employee_ID === r.emp_id)?.dept_name === employee.dept_name);
    if (deanRole) {
      mockData.approvals.push({ Emp1_ID: deanRole.emp_id, Leave_ID: leave.request_ID, status: 'pending' });
    }
    
    const hrRole = mockData.roles.find(r => r.role_name === `HR_Representative_${employee.dept_name}`);
    if (hrRole) {
      mockData.approvals.push({ Emp1_ID: hrRole.emp_id, Leave_ID: leave.request_ID, status: 'pending' });
    }
    
    return { success: true, message: 'Annual leave submitted successfully', data: leave };
  },

  // Get leave status
  getLeaveStatus: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentMonth = getCurrentMonth();
    const currentYear = new Date().getFullYear();
    
    const leaves = mockData.leaves
      .filter(l => {
        const leaveMonth = new Date(l.start_date).getMonth() + 1;
        const leaveYear = new Date(l.start_date).getFullYear();
        return l.emp_ID === employeeId && leaveMonth === currentMonth && leaveYear === currentYear && 
               (l.type === 'annual' || l.type === 'accidental');
      })
      .map(l => ({
        request_id: l.request_ID,
        date_of_request: l.date_of_request,
        status: l.final_approval_status
      }));
    
    return { success: true, data: leaves };
  },

  // Submit accidental leave
  submitAccidentalLeave: async (employeeId: number, startDate: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    if (employee.accidental_balance < 1) {
      return { success: false, message: 'Insufficient accidental leave balance' };
    }
    
    const leave = {
      request_ID: mockData.counters.leave++,
      date_of_request: getCurrentDate(),
      start_date: startDate,
      end_date: startDate,
      num_days: 1,
      final_approval_status: 'pending',
      type: 'accidental',
      emp_ID: employeeId
    };
    
    mockData.leaves.push(leave);
    
    // Add HR approval
    const hrRole = mockData.roles.find(r => r.role_name === `HR_Representative_${employee.dept_name}`);
    if (hrRole) {
      mockData.approvals.push({ Emp1_ID: hrRole.emp_id, Leave_ID: leave.request_ID, status: 'pending' });
    }
    
    return { success: true, message: 'Accidental leave submitted successfully', data: leave };
  },

  // Submit medical leave
  submitMedicalLeave: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const numDays = Math.floor((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const leave = {
      request_ID: mockData.counters.leave++,
      date_of_request: getCurrentDate(),
      start_date: data.start_date,
      end_date: data.end_date,
      num_days: numDays,
      final_approval_status: 'pending',
      type: 'medical',
      emp_ID: data.employee_ID,
      medical_type: data.type,
      insurance_status: data.insurance_status
    };
    
    mockData.leaves.push(leave);
    return { success: true, message: 'Medical leave submitted successfully', data: leave };
  },

  // Submit unpaid leave
  submitUnpaidLeave: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const numDays = Math.floor((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (numDays > 30) {
      return { success: false, message: 'Unpaid leave cannot exceed 30 days' };
    }
    
    const leave = {
      request_ID: mockData.counters.leave++,
      date_of_request: getCurrentDate(),
      start_date: data.start_date,
      end_date: data.end_date,
      num_days: numDays,
      final_approval_status: 'pending',
      type: 'unpaid',
      emp_ID: data.employee_ID
    };
    
    mockData.leaves.push(leave);
    return { success: true, message: 'Unpaid leave submitted successfully', data: leave };
  },

  // Submit compensation leave
  submitCompensationLeave: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const leave = {
      request_ID: mockData.counters.leave++,
      date_of_request: getCurrentDate(),
      start_date: data.compensation_date,
      end_date: data.compensation_date,
      num_days: 1,
      final_approval_status: 'pending',
      type: 'compensation',
      emp_ID: data.employee_ID,
      date_of_original_workday: data.date_of_original_workday,
      replacement_emp: data.replacement_emp
    };
    
    mockData.leaves.push(leave);
    return { success: true, message: 'Compensation leave submitted successfully', data: leave };
  },

  // Get pending approvals for employee
  getPendingApprovals: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const approvals = mockData.approvals
      .filter(a => a.Emp1_ID === employeeId && a.status === 'pending')
      .map(a => {
        const leave = mockData.leaves.find(l => l.request_ID === a.Leave_ID);
        if (!leave) return null;
        
        const requestor = mockData.employees.find(e => e.employee_ID === leave.emp_ID);
        
        return {
          ...a,
          leave,
          leaveType: leave.type.charAt(0).toUpperCase() + leave.type.slice(1) + ' Leave',
          requestor: requestor ? `${requestor.first_name} ${requestor.last_name}` : 'Unknown'
        };
      })
      .filter(a => a !== null);
    
    return { success: true, data: approvals };
  },

  // Approve leave
  approveLeave: async (employeeId: number, leaveId: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const approval = mockData.approvals.find(a => a.Emp1_ID === employeeId && a.Leave_ID === leaveId);
    if (approval) {
      approval.status = status;
    }
    
    // Check if all approvals are done
    const allApprovals = mockData.approvals.filter(a => a.Leave_ID === leaveId);
    const allApproved = allApprovals.every(a => a.status === 'approved');
    const anyRejected = allApprovals.some(a => a.status === 'rejected');
    
    const leave = mockData.leaves.find(l => l.request_ID === leaveId);
    if (leave) {
      if (anyRejected) {
        leave.final_approval_status = 'rejected';
      } else if (allApproved) {
        leave.final_approval_status = 'approved';
        
        // Update balance
        const employee = mockData.employees.find(e => e.employee_ID === leave.emp_ID);
        if (employee) {
          if (leave.type === 'annual') {
            employee.annual_balance -= leave.num_days;
          } else if (leave.type === 'accidental') {
            employee.accidental_balance -= leave.num_days;
          }
        }
      }
    }
    
    return { success: true, message: `Leave ${status} successfully` };
  },

  // Submit evaluation
  submitEvaluation: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const performance = {
      performance_ID: mockData.counters.performance++,
      rating: data.rating,
      comments: data.comments,
      semester: data.semester,
      emp_ID: data.employee_ID
    };
    
    mockData.performance.push(performance);
    return { success: true, message: 'Evaluation submitted successfully', data: performance };
  },

  // Get pending leaves for HR
  getPendingLeaves: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pending = mockData.leaves
      .filter(l => l.final_approval_status === 'pending')
      .map(l => {
        const employee = mockData.employees.find(e => e.employee_ID === l.emp_ID);
        return {
          ...l,
          leaveType: l.type.charAt(0).toUpperCase() + l.type.slice(1),
          employee: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
          employee_ID: l.emp_ID
        };
      });
    
    return { success: true, data: pending };
  },

  // HR approve leave
  hrApproveLeave: async (requestId: number, hrId: number, leaveType: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const leave = mockData.leaves.find(l => l.request_ID === requestId);
    if (!leave) {
      return { success: false, message: 'Leave request not found' };
    }
    
    const employee = mockData.employees.find(e => e.employee_ID === leave.emp_ID);
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    // Validate based on type
    if (leaveType === 'Annual' || leaveType === 'Accidental') {
      const balance = leaveType === 'Annual' ? employee.annual_balance : employee.accidental_balance;
      if (balance < leave.num_days) {
        leave.final_approval_status = 'rejected';
        return { success: false, message: 'Insufficient leave balance. Leave rejected.' };
      }
    }
    
    // Update approval status
    const approval = mockData.approvals.find(a => a.Emp1_ID === hrId && a.Leave_ID === requestId);
    if (approval) {
      approval.status = 'approved';
    }
    
    // Check if all approvals are done
    const allApprovals = mockData.approvals.filter(a => a.Leave_ID === requestId);
    const allApproved = allApprovals.every(a => a.status === 'approved');
    const anyRejected = allApprovals.some(a => a.status === 'rejected');
    
    if (anyRejected) {
      leave.final_approval_status = 'rejected';
      return { success: true, message: 'Leave rejected' };
    } else if (allApproved) {
      leave.final_approval_status = 'approved';
      
      // Update balance
      if (leaveType === 'Annual') {
        employee.annual_balance -= leave.num_days;
      } else if (leaveType === 'Accidental') {
        employee.accidental_balance -= leave.num_days;
      }
      
      return { success: true, message: 'Leave approved and balance updated' };
    }
    
    return { success: true, message: 'Approval recorded, waiting for other approvals' };
  },

  // Add deduction for hours
  addDeductionHours: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentMonth = getCurrentMonth();
    const underHours = mockData.attendance.filter(a => 
      a.emp_ID === employeeId &&
      new Date(a.date).getMonth() + 1 === currentMonth &&
      a.total_duration !== null &&
      a.total_duration < 480
    );
    
    if (underHours.length === 0) {
      return { success: false, message: 'No missing hours found for this month' };
    }
    
    const totalMissingMinutes = underHours.reduce((sum, a) => sum + (480 - (a.total_duration || 0)), 0);
    const amount = (totalMissingMinutes / 60) * 50; // Assuming $50/hour rate
    
    mockData.deductions.push({
      deduction_ID: mockData.counters.deduction++,
      emp_ID: employeeId,
      date: getCurrentDate(),
      amount,
      type: 'missing_hours',
      status: 'pending',
      unpaid_ID: null,
      attendance_ID: underHours[0].attendance_ID
    });
    
    return { success: true, message: `Deduction of $${amount.toFixed(2)} added for missing hours` };
  },

  // Add deduction for days
  addDeductionDays: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentMonth = getCurrentMonth();
    const absentDays = mockData.attendance.filter(a => 
      a.emp_ID === employeeId &&
      new Date(a.date).getMonth() + 1 === currentMonth &&
      a.status === 'absent'
    );
    
    if (absentDays.length === 0) {
      return { success: false, message: 'No absent days found for this month' };
    }
    
    const amountPerDay = 400; // Assuming $400/day rate
    let count = 0;
    
    absentDays.forEach(att => {
      mockData.deductions.push({
        deduction_ID: mockData.counters.deduction++,
        emp_ID: employeeId,
        date: att.date,
        amount: amountPerDay,
        type: 'missing_days',
        status: 'pending',
        unpaid_ID: null,
        attendance_ID: att.attendance_ID
      });
      count++;
    });
    
    return { success: true, message: `Added ${count} deductions for missing days, total amount: $${(count * amountPerDay).toFixed(2)}` };
  },

  // Add deduction for unpaid leave
  addDeductionUnpaid: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentMonth = getCurrentMonth();
    const unpaidLeave = mockData.leaves.find(l => 
      l.type === 'unpaid' &&
      l.emp_ID === employeeId &&
      l.final_approval_status === 'approved' &&
      (new Date(l.start_date).getMonth() + 1 === currentMonth || new Date(l.end_date).getMonth() + 1 === currentMonth)
    );
    
    if (!unpaidLeave) {
      return { success: false, message: 'No unpaid leave found for this month' };
    }
    
    const amount = unpaidLeave.num_days * 400; // Assuming $400/day
    
    mockData.deductions.push({
      deduction_ID: mockData.counters.deduction++,
      emp_ID: employeeId,
      date: unpaidLeave.start_date,
      amount,
      type: 'unpaid',
      status: 'pending',
      unpaid_ID: unpaidLeave.request_ID,
      attendance_ID: null
    });
    
    return { success: true, message: `Deduction of $${amount.toFixed(2)} added for unpaid leave` };
  },

  // Generate payroll
  generatePayroll: async (employeeId: number, fromDate: string, toDate: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const employee = mockData.employees.find(e => e.employee_ID === employeeId);
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    
    const baseSalary = employee.salary;
    const bonusAmount = 500; // Mock bonus
    
    // Calculate deductions in period
    const deductions = mockData.deductions.filter(d => {
      const dedDate = new Date(d.date);
      return d.emp_ID === employeeId &&
             dedDate >= new Date(fromDate) &&
             dedDate <= new Date(toDate);
    });
    
    const deductionsAmount = deductions.reduce((sum, d) => sum + d.amount, 0);
    const finalSalary = baseSalary + bonusAmount - deductionsAmount;
    
    const payroll = {
      ID: mockData.counters.payroll++,
      payment_date: getCurrentDate(),
      final_salary_amount: finalSalary,
      from_date: fromDate,
      to_date: toDate,
      comments: '',
      bonus_amount: bonusAmount,
      deductions_amount: deductionsAmount,
      emp_ID: employeeId
    };
    
    mockData.payroll.push(payroll);
    
    // Finalize deductions
    deductions.forEach(d => {
      d.status = 'finalized';
    });
    
    return { success: true, message: 'Payroll generated successfully', data: payroll };
  },

  // Generate payroll for all employees
  generatePayrollForAll: async (fromDate: string, toDate: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const results = [];
    
    for (const employee of mockData.employees) {
      if (employee.employment_status === 'active' || employee.employment_status === 'onleave') {
        const baseSalary = employee.salary;
        const bonusAmount = 500;
        
        const deductions = mockData.deductions.filter(d => {
          const dedDate = new Date(d.date);
          return d.emp_ID === employee.employee_ID &&
                 dedDate >= new Date(fromDate) &&
                 dedDate <= new Date(toDate);
        });
        
        const deductionsAmount = deductions.reduce((sum, d) => sum + d.amount, 0);
        const finalSalary = baseSalary + bonusAmount - deductionsAmount;
        
        const payroll = {
          ID: mockData.counters.payroll++,
          payment_date: getCurrentDate(),
          final_salary_amount: finalSalary,
          from_date: fromDate,
          to_date: toDate,
          comments: '',
          bonus_amount: bonusAmount,
          deductions_amount: deductionsAmount,
          emp_ID: employee.employee_ID
        };
        
        mockData.payroll.push(payroll);
        results.push(payroll);
        
        deductions.forEach(d => {
          d.status = 'finalized';
        });
      }
    }
    
    return { success: true, message: `Generated payroll for ${results.length} employees`, data: results };
  },

  // Get all leaves with employee info
  getAllLeaves: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const leaves = mockData.leaves.map(l => {
      const employee = mockData.employees.find(e => e.employee_ID === l.emp_ID);
      return {
        ...l,
        employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
        employee_dept: employee?.dept_name || ''
      };
    });
    return { success: true, data: leaves };
  },

  // Get payroll history
  getAllPayroll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const payrolls = mockData.payroll.map(p => {
      const employee = mockData.employees.find(e => e.employee_ID === p.emp_ID);
      return {
        ...p,
        employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
        employee_dept: employee?.dept_name || ''
      };
    });
    return { success: true, data: payrolls };
  },

  // Check if employee is Dean/Vice Dean/President
  isEmployeeApprover: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const role = mockData.roles.find(r => r.emp_id === employeeId);
    if (!role) {
      return { success: true, data: { isApprover: false, role: null } };
    }
    const isApprover = role.role_name === 'Dean' || role.role_name === 'Vice Dean' || role.role_name === 'President';
    return { success: true, data: { isApprover, role: role.role_name } };
  }
};