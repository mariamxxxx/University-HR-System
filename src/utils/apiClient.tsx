// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Employee API functions
export const employeeAPI = {
  // Authentication
  login: (employee_id: number, password: string) =>
    apiRequest('/employees/login', {
      method: 'POST',
      body: JSON.stringify({ employee_id, password }),
    }),

  // Get employee data
  getProfile: (id: number) => apiRequest(`/employees/${id}/profile`),
  
  getPerformance: (id: number, period: string) => 
    apiRequest(`/employees/${id}/performance?period=${period}`),
  
  getAttendance: (id: number) => 
    apiRequest(`/employees/${id}/attendance`),
  
  getLastPayroll: (id: number) => 
    apiRequest(`/employees/${id}/payroll`),
  
  getDeductions: (id: number, month?: number) => 
    apiRequest(`/employees/${id}/deductions${month ? `?month=${month}` : ''}`),
};

// Leave API functions
export const leaveAPI = {
  // Submit leave requests
  submitAnnual: (data: {
    employee_id: number;
    replacement_emp: number;
    start_date: string;
    end_date: string;
  }) =>
    apiRequest('/leaves/annual', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitAccidental: (data: {
    employee_id: number;
    start_date: string;
    end_date: string;
  }) =>
    apiRequest('/leaves/accidental', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitMedical: (data: {
    employee_id: number;
    start_date: string;
    end_date: string;
    medical_type: string;
    insurance_status: boolean;
    disability_details: string;
    document_description: string;
    file_name: string;
  }) =>
    apiRequest('/leaves/medical', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitUnpaid: (data: {
    employee_id: number;
    start_date: string;
    end_date: string;
    document_description: string;
    file_name: string;
  }) =>
    apiRequest('/leaves/unpaid', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitCompensation: (data: {
    employee_id: number;
    compensation_date: string;
    reason: string;
    date_of_original_workday: string;
    rep_emp_id: number;
  }) =>
    apiRequest('/leaves/compensation', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get leave status
  getStatus: (employee_id: number) => 
    apiRequest(`/leaves/status/${employee_id}`),

  checkOnLeave: (employee_id: number, from_date: string, to_date: string) =>
    apiRequest(`/leaves/check-onleave?employee_id=${employee_id}&from_date=${from_date}&to_date=${to_date}`),
};

// HR API functions
export const hrAPI = {
  // Authentication
  login: (employee_id: number, password: string) =>
    apiRequest('/hr/login', {
      method: 'POST',
      body: JSON.stringify({ employee_id, password }),
    }),

  // Leave approvals
  approveAnnualAccidental: (request_id: number, hr_id: number) =>
    apiRequest('/hr/approve/annual-accidental', {
      method: 'POST',
      body: JSON.stringify({ request_id, hr_id }),
    }),

  approveUnpaid: (request_id: number, hr_id: number) =>
    apiRequest('/hr/approve/unpaid', {
      method: 'POST',
      body: JSON.stringify({ request_id, hr_id }),
    }),

  approveCompensation: (request_id: number, hr_id: number) =>
    apiRequest('/hr/approve/compensation', {
      method: 'POST',
      body: JSON.stringify({ request_id, hr_id }),
    }),

  // Payroll and deductions
  addPayroll: (employee_id: number, from_date: string, to_date: string) =>
    apiRequest('/hr/payroll/add', {
      method: 'POST',
      body: JSON.stringify({ employee_id, from_date, to_date }),
    }),

  deductHours: (employee_id: number) =>
    apiRequest('/hr/deduction/hours', {
      method: 'POST',
      body: JSON.stringify({ employee_id }),
    }),

  deductDays: (employee_id: number) =>
    apiRequest('/hr/deduction/days', {
      method: 'POST',
      body: JSON.stringify({ employee_id }),
    }),

  deductUnpaid: (employee_id: number) =>
    apiRequest('/hr/deduction/unpaid', {
      method: 'POST',
      body: JSON.stringify({ employee_id }),
    }),

  // Attendance
  updateAttendance: (employee_id: number, check_in_time?: string, check_out_time?: string) =>
    apiRequest('/hr/attendance/update', {
      method: 'POST',
      body: JSON.stringify({ employee_id, check_in_time, check_out_time }),
    }),

  // Evaluation
  addEvaluation: (data: {
    employee_id: number;
    rating: number;
    comment: string;
    semester: string;
  }) =>
    apiRequest('/hr/evaluation', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // View all data
  getAllEmployees: () => apiRequest('/hr/employees'),
  getAllPerformance: () => apiRequest('/hr/performance'),
  getAllAttendance: () => apiRequest('/hr/attendance'),
};

// Admin API functions
export const adminAPI = {
  // Leave approvals (Dean/Upperboard)
  approveAnnual: (request_id: number, upperboard_id: number, replacement_id: number) =>
    apiRequest('/admin/approve/annual', {
      method: 'POST',
      body: JSON.stringify({ request_id, upperboard_id, replacement_id }),
    }),

  approveUnpaid: (request_id: number, upperboard_id: number) =>
    apiRequest('/admin/approve/unpaid', {
      method: 'POST',
      body: JSON.stringify({ request_id, upperboard_id }),
    }),

  // Department and role management
  getDepartments: () => apiRequest('/admin/departments'),
  getRoles: () => apiRequest('/admin/roles'),
  getDepartmentStats: () => apiRequest('/admin/departments/stats'),

  addDepartment: (name: string, building_location: string) =>
    apiRequest('/admin/departments', {
      method: 'POST',
      body: JSON.stringify({ name, building_location }),
    }),

  addRole: (data: {
    role_name: string;
    title: string;
    description: string;
    rank: number;
    base_salary: number;
    percentage_YOE: number;
    percentage_overtime: number;
    annual_balance: number;
    accidental_balance: number;
  }) =>
    apiRequest('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Holiday management
  addHoliday: (holiday_name: string, from_date: string, to_date: string) =>
    apiRequest('/admin/holidays', {
      method: 'POST',
      body: JSON.stringify({ holiday_name, from_date, to_date }),
    }),

  // Employee replacement
  replaceEmployee: (emp1_id: number, emp2_id: number, from_date: string, to_date: string) =>
    apiRequest('/admin/replace-employee', {
      method: 'POST',
      body: JSON.stringify({ emp1_id, emp2_id, from_date, to_date }),
    }),
};

export default {
  employee: employeeAPI,
  leave: leaveAPI,
  hr: hrAPI,
  admin: adminAPI,
};
