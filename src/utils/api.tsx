// api.tsx — defensive, explicit endpoints
const ROOT_BASE = "http://localhost:5000";
const HR_BASE = `${ROOT_BASE}/api/hr`; // use for payroll endpoints that live under /api/hr

// API configuration
const API_BASE_URL = 'http://localhost:5000';


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
    { role_name: 'Vice Dean', title: 'Vice Dean', description: 'Vice Dean', rank: 4, emp_id: 1002 },
    { role_name: 'Professor', title: 'Professor', description: 'Professor', rank: 5, emp_id: 1002 },
    { role_name: 'Assistant Professor', title: 'Assistant Professor', description: 'Assistant Professor', rank: 7, emp_id: 1003 },
    { role_name: 'HR Representative', title: 'HR Representative', description: 'HR Rep CS', rank: 11, emp_id: 1004 },
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
    },
    {
      attendance_ID: 7,
      date: '2024-12-3',
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

export const getStoredEmployeeId = (): number | null => {
  const id = localStorage.getItem("employee_id");
  return id ? parseInt(id, 10) : null;
};

export const setStoredEmployeeId = (id: number): void => {
  localStorage.setItem("employee_id", id.toString());
};

export const clearStoredEmployeeId = (): void => {
  localStorage.removeItem("employee_id");
};

// Try to parse JSON safely — if it fails, return a consistent error object
async function safeJsonResponse(resp: Response) {
  let text: string;
  try {
    // read as text first so we can give a helpful message
    text = await resp.text();
    try {
      // try parse
      const parsed = JSON.parse(text);
      return parsed;
    } catch (parseErr) {
      // not valid JSON
      return { success: false, message: `Invalid JSON from server (status ${resp.status})`, raw: text };
    }
  } catch (err) {
    return { success: false, message: "Failed to read response from server" };
  }
}


export const api = {
  
  //-----------------------------------------------DANA---------------------------------
   // HR login (root path)
  hrLogin: async (employee_ID: number, password: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/hr-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ employee_ID, password }),
      });

      const json = await safeJsonResponse(response);
      // If non-OK and server returned a JSON-like object, surface its message
      if (!response.ok) {
        return { success: false, message: json?.message || `HTTP ${response.status}` };
      }
      // Otherwise return whatever the server returned
      return json;
    } catch (err: any) {
      console.error("hrLogin error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Get pending leaves – requires hrId
  getPendingLeaves: async (hrId: number) => {
    try {
      // server route (your server previously used /pending-leaves at root)
      const url = `${ROOT_BASE}/pending-leaves?hrId=${encodeURIComponent(hrId)}`;

      const response = await fetch(url, { method: "GET" });
      const json = await safeJsonResponse(response);

      if (!response.ok) {
        return { success: false, message: json?.message || `HTTP ${response.status}`, data: [] };
      }

      // If server returned wrapped { success: true, data: [...] } we forward data,
      // otherwise we assume the body itself is the data array/object.
      if (json && typeof json === "object" && "success" in json) {
        return { success: json.success, message: json.message, data: json.data ?? [] };
      } else {
        return { success: true, data: json ?? [] };
      }
    } catch (err: any) {
      console.error("getPendingLeaves error:", err);
      return { success: false, message: `Network error: ${err.message || err}`, data: [] };
    }
  },

  // Approve endpoints — these use HR_BASE only if you implemented them under /api/hr, but
  // default to ROOT paths. Adjust server if needed.
  approveAnnualLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/approve-annual-accidental`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("approveAnnualLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  approveUnpaidLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/approve-unpaid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("approveUnpaidLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  approveCompensationLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/approve-compensation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("approveCompensationLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Generic processLeave: selects endpoint by type then calls it
  processLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      let endpoint = "";
      switch (leaveType.toLowerCase()) {
        case "annual":
        case "accidental":
          endpoint = "/approve-annual-accidental";
          break;
        case "unpaid":
          endpoint = "/approve-unpaid";
          break;
        case "compensation":
          endpoint = "/approve-compensation";
          break;
        default:
          throw new Error("Invalid leave type");
      }

      const response = await fetch(`${ROOT_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });

      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("processLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Deductions (assume routes are at root; change to HR_BASE if your server defines them under /api/hr)
  deductHours: async (employee_ID: number) => {
    try {
      const response = await fetch(`${ROOT_BASE}/deduction-hours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("deductHours error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  deductDays: async (employee_ID: number) => {
    try {
      const response = await fetch(`${ROOT_BASE}/deduction-days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("deductDays error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  deductUnpaid: async (employee_ID: number) => {
    try {
      const response = await fetch(`${ROOT_BASE}/deduction-unpaid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("deductUnpaid error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Payroll — your server used /api/hr/generate-payroll in earlier snippet, so call HR_BASE here.
  generatePayroll: async (employee_ID: number, from_date: string, to_date: string) => {
    try {
      const response = await fetch(`${HR_BASE}/generate-payroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID, from_date, to_date }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("generatePayroll error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },
  
  //-------------------------------------------AISEL-----------------------------------------------------

  // Employee login

  employeeLogin: async (employeeId: number, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employeeId,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store employee ID for future use
        setStoredEmployeeId(employeeId);
        return { 
          success: true, 
          message: result.message || 'Login successful', 
          data: result.data 
        };
      } else {
        return { 
          success: false, 
          message: result.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Employee login error:', error);
      // Fallback to mock data if backend is not available
      await new Promise(resolve => setTimeout(resolve, 300));
      const employee = mockData.employees.find(e => e.employee_ID === employeeId);
      if (employee && employee.password === password) {
        setStoredEmployeeId(employeeId);
        return { success: true, message: 'Login successful (mock)', data: employee };
      }
      return { success: false, message: 'Backend unavailable and credentials not found in mock data' };
    }
  },
  
  // Get all employees
  getEmployees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/view-employees`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('getEmployees error:', error);
      // fallback to mock
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, data: mockData.employees };
    }
  },

    

  // Get yesterday's attendance
  getYesterdayAttendance: async () => {
    const res = await fetch("http://localhost:5000/yesterday-all-attendance");
    const data = await res.json();
    if (!data.success) return { success: false };

    return { success: true, data: data.data };
  },

  // Get winter performance
  getWinterPerformance: async () => {
    const res = await fetch("http://localhost:5000/winter-performance");
    const data = await res.json();
    if (!data.success) return { success: false };

    return { success: true, data: data.data };
  },

  // Remove holiday attendance
  removeHolidayAttendance: async () => {
   try {
    const response = await fetch("http://localhost:5000/remove-holiday", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    return { success: true, message: `Removed official holiday attendance records` }
    } catch (error) {
    return { success: false, message: "Frontend error: " + error };
    }
  },

  // Remove day-off
  removeDayOff: async (employeeId: number) => {
   try {
    const response = await fetch("http://localhost:5000/remove-dayoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId })
    });

    const result = await response.json();
    return { success: true, message: `Removed unattended day-off attendance records` }

  } catch (error) {
    return { success: false, message: "Frontend error: " + error };
  }
  },

  // Remove approved leaves
  removeApprovedLeaves: async (employeeId: number) => {
   try {
    const response = await fetch("http://localhost:5000/remove-approved-leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId })
    });

    const result = await response.json();
    return { success: true, message: `Removed approved leaves from attendance records` }

  } catch (error) {
    return { success: false, message: "Frontend error: " + error };
  }
  },

  // Replace employee
  replaceEmployee: async (emp1: number, emp2: number, fromDate: string, toDate: string) => {
    try {
    const response = await fetch("http://localhost:5000/employee-replace-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emp1, emp2, fromDate, toDate })
    });

    const result = await response.json();
    return { success: true, message: `Employee replacement recorded successfully` }

  } catch (error) {
    return { success: false, message: "Frontend error: " + error };
  }
  },

  // Update employment status
  updateEmploymentStatus: async (employeeId: number) => {
     try {
    const response = await fetch("http://localhost:5000/update-employment-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId })
    });

    const result = await response.json();
    return { success: true, message: `Employment status updated successfully` }

  } catch (error) {
    return { success: false, message: "Frontend error: " + error };
  }
  },

  // Get employee performance
  getPerformance: async (employeeId: number, semester: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/performance/${employeeId}/${semester}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message || 'Failed to fetch performance', data: [] };
      }
    } catch (error) {
      console.error('Get performance error:', error);
      return { 
        success: false, 
        message: `Failed to connect to server: ${error}`,
        data: [] 
      };
    }
  },

  // Get employee attendance
  getAttendance: async (employeeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/attendance/${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message || 'Failed to fetch attendance', data: [] };
      }
    } catch (error) {
      console.error('Get attendance error:', error);
      return { 
        success: false, 
        message: `Failed to connect to server: ${error}`,
        data: [] 
      };
    }
  },

  // Get last month payroll
  getLastMonthPayroll: async (employeeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/payroll/${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message || 'Failed to fetch payroll', data: [] };
      }
    } catch (error) {
      console.error('Get payroll error:', error);
      return { 
        success: false, 
        message: `Failed to connect to server: ${error}`,
        data: [] 
      };
    }
  },

  // Get deductions
  getDeductions: async (employeeId: number, month: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/deductions/${employeeId}/${month}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message || 'Failed to fetch deductions', data: [] };
      }
    } catch (error) {
      console.error('Get deductions error:', error);
      return { 
        success: false, 
        message: `Failed to connect to server: ${error}`,
        data: [] 
      };
    }
  },

  // Submit annual leave
  submitAnnualLeave: async (employeeId: number, startDate: string, endDate: string, replacementEmp: number | null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submit-annual-leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_ID: employeeId,
          start_date: startDate,
          end_date: endDate,
          replacement_emp: replacementEmp
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errorMsg = err.error || err.message || 'Failed to submit annual leave';
        return { success: false, message: errorMsg };
      }

      const result = await response.json().catch(() => ({}));
      return { success: true, message: result.message || 'Annual leave submitted successfully', data: result.data || null };
    } catch (error: any) {
      console.error('submitAnnualLeave error:', error);
      // fallback to mock
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
      
      return { success: true, message: 'Annual leave submitted successfully (mock)', data: leave };
    }
  },

  // Get leave status
  getLeaveStatus: async (employeeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/leave/status/${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message || 'Failed to fetch leave status', data: [] };
      }
    } catch (error) {
      console.error('Get leave status error:', error);
      return { 
        success: false, 
        message: `Failed to connect to server: ${error}`,
        data: [] 
      };
    }
  },
///////////////////////////////////////////////////Rokaia/////////////////////////////////////////////////////
  
// Submit accidental leave
  submitAccidentalLeave: async (employeeId: number, startDate: string, endDate: string) => {
    const response = await fetch('http://localhost:5000/submit-accidental-leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_ID: employeeId,
        start_date: startDate,
        end_date: endDate
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit accidental leave');
    }
    
    return response.json();
  },

    // Submit medical leave
  submitMedicalLeave: async (data: any) => {
    const response = await fetch('http://localhost:5000/submit-medical-leave', {
      method: 'POST', //means i need to send new data
      headers: { 'Content-Type': 'application/json' }, // telling the backend that im sending json data
      body: JSON.stringify({ // the actual data being sent to the backend
        employee_ID: data.employee_ID,
        start_date: data.start_date,
        end_date: data.end_date,
        type: data.type,
        insurance_status: data.insurance_status,
        disability_details: data.disability_details,
        document_description: data.document_description,
        file_name: data.file_name
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit medical leave');
    }
    
    return response.json();
  },

    // Submit unpaid leave
  submitUnpaidLeave: async (data: any) => {
    const response = await fetch('http://localhost:5000/submit-unpaid-leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_ID: data.employee_ID,
        start_date: data.start_date,
        end_date: data.end_date,
        document_description: data.document_description,
        file_name: data.file_name
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit unpaid leave');
    }
    
    return response.json();
  },

   // Submit compensation leave
  submitCompensationLeave: async (data: any) => {
    const response = await fetch('http://localhost:5000/submit-compensation-leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_ID: data.employee_ID,
        compensation_date: data.compensation_date,
        reason: data.reason,
        date_of_original_workday: data.date_of_original_workday,
        replacement_emp: data.replacement_emp
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit compensation leave');
    }
    
    return response.json();
  },

  
  
   // Approve/Reject unpaid leave (Dean/Vice-Dean/President)
  approveUnpaidLeave: async (requestId: number, upperboardId: number) => {
    const response = await fetch('http://localhost:5000/approve-unpaid-leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_ID: requestId,
        upperboard_ID: upperboardId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process unpaid leave');
    }
    
    return response.json();
  },

  // Approve/Reject annual leave (Dean/Vice-Dean/President)
  approveAnnualLeave: async (requestId: number, upperboardId: number, replacementId: number) => {
    const response = await fetch('http://localhost:5000/approve-annual-leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_ID: requestId,
        upperboard_ID: upperboardId,
        replacement_ID: replacementId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process annual leave');
    }
    
    return response.json();
  },

  // Dean/HR evaluate employee
  evaluateEmployee: async (employeeId: number, rating: number, comment: string, semester: string) => {
    const response = await fetch('http://localhost:5000/evaluate-employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_ID: employeeId,
        rating: rating,
        comment: comment,
        semester: semester
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit evaluation');
    }
    
    return response.json();
  },



   isEmployeeApprover: async (employeeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/roles/${employeeId}`);
      if (!response.ok) throw new Error('Failed to fetch roles');
      const result = await response.json();
      if (result.success) {
        return { success: true, data: result.data };
      }
      return { success: false, message: result.message || 'Failed to get role' };
    } catch (error) {
      // Fallback to mock data if backend is unavailable
      await new Promise(resolve => setTimeout(resolve, 100));
      const role = mockData.roles.find(r => r.emp_id === employeeId);
      if (!role) {
        return { success: true, data: { isApprover: false, role: null } };
      }
      const isApprover = role.role_name === 'Dean' || role.role_name === 'Vice Dean' || role.role_name === 'President';
      return { success: true, data: { isApprover, role: role.role_name } };
    }
  },

  


  

  /////////////////////////////////////////////////////////////End Rokaia/////////////////////////////////////////////////////

  
  
  
  
  
  
  // Get pending approvals for employee
  getPendingApprovals: async (employeeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pending-approvals/${employeeId}`);
      if (!response.ok) throw new Error('Failed to fetch pending approvals');
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error) {
      console.error('getPendingApprovals error:', error);
      // fallback to mock
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
    }
  },

  // Approve leave
  approveLeave: async (employeeId: number, leaveId: number, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approve-unpaid-leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_ID: leaveId,
          upperboard_ID: employeeId,
          status: status
        })
      });
      
      if (!response.ok) throw new Error('Failed to process leave');
      
      const result = await response.json();
      return { success: true, message: result.message || `Leave ${status} successfully` };
    } catch (error) {
      console.error('approveLeave error:', error);
      // fallback to mock
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
      
      return { success: true, message: `Leave ${status} successfully (mock)` };
    }
  },

  // Submit evaluation
  submitEvaluation: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluate-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_ID: data.employee_ID,
          rating: data.rating,
          comment: data.comments || data.comment || '',
          semester: data.semester
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errorMsg = err.error || err.message || 'Failed to submit evaluation';
        return { success: false, message: errorMsg };
      }

      const result = await response.json().catch(() => ({}));
      return { success: true, message: result.message || 'Evaluation submitted successfully', data: result.data || null };
    } catch (error: any) {
      // fallback to mock if backend unavailable
      console.error('submitEvaluation error:', error);
      await new Promise(resolve => setTimeout(resolve, 300));
      const performance = {
        performance_ID: mockData.counters.performance++,
        rating: data.rating,
        comments: data.comments,
        semester: data.semester,
        emp_ID: data.employee_ID
      };

      mockData.performance.push(performance);
      return { success: true, message: 'Evaluation submitted (mock)', data: performance };
    }
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
 
};
