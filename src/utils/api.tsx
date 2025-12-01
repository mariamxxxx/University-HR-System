import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a764e3d7`;

// Helper function to make API calls
async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Authentication
  adminLogin: async (adminId: string, password: string) => {
    return apiCall('/auth/admin/login', 'POST', { adminId, password });
  },

  employeeLogin: async (employeeId: number, password: string) => {
    return apiCall('/auth/employee/login', 'POST', { employeeId, password });
  },

  hrLogin: async (employeeId: number, password: string) => {
    return apiCall('/auth/hr/login', 'POST', { employeeId, password });
  },

  signupEmployee: async (data: any) => {
    return apiCall('/auth/signup', 'POST', data);
  },

  // Employee operations
  getEmployees: async () => {
    return apiCall('/employees');
  },

  getEmployeesPerDept: async () => {
    return apiCall('/employees/by-department');
  },

  // Attendance
  initiateAttendance: async () => {
    return apiCall('/attendance/initiate', 'POST');
  },

  updateAttendance: async (employeeId: number, checkIn: string, checkOut: string) => {
    return apiCall('/attendance/update', 'POST', { employeeId, checkIn, checkOut });
  },

  getAttendance: async (employeeId: number) => {
    return apiCall(`/attendance/${employeeId}`);
  },

  getYesterdayAttendance: async () => {
    return apiCall('/attendance/yesterday');
  },

  // Leaves
  submitAnnualLeave: async (employeeId: number, startDate: string, endDate: string, replacementEmp: number | null) => {
    return apiCall('/leaves/annual', 'POST', { employeeId, startDate, endDate, replacementEmp });
  },

  submitAccidentalLeave: async (employeeId: number, startDate: string) => {
    return apiCall('/leaves/accidental', 'POST', { employeeId, startDate });
  },

  submitMedicalLeave: async (data: any) => {
    return apiCall('/leaves/medical', 'POST', data);
  },

  submitUnpaidLeave: async (data: any) => {
    return apiCall('/leaves/unpaid', 'POST', data);
  },

  submitCompensationLeave: async (data: any) => {
    return apiCall('/leaves/compensation', 'POST', data);
  },

  getLeaveStatus: async (employeeId: number) => {
    return apiCall(`/leaves/status/${employeeId}`);
  },

  getPendingApprovals: async (employeeId: number) => {
    return apiCall(`/leaves/pending/${employeeId}`);
  },

  approveLeave: async (approverId: number, leaveId: number, status: string) => {
    return apiCall('/leaves/approve', 'POST', { approverId, leaveId, status });
  },

  getPendingLeaves: async () => {
    return apiCall('/leaves/pending');
  },

  hrApproveLeave: async (requestId: number, hrId: number, leaveType: string) => {
    return apiCall('/leaves/hr-approve', 'POST', { requestId, hrId, leaveType });
  },

  getRejectedMedicals: async () => {
    return apiCall('/leaves/medical/rejected');
  },

  removeApprovedLeaves: async (employeeId: number) => {
    return apiCall(`/leaves/remove-approved/${employeeId}`, 'DELETE');
  },

  getAllLeaves: async () => {
    return apiCall('/leaves/all');
  },

  // Deductions
  getDeductions: async (employeeId: number, month: number) => {
    return apiCall(`/deductions/${employeeId}/${month}`);
  },

  addDeductionHours: async (employeeId: number) => {
    return apiCall('/deductions/hours', 'POST', { employeeId });
  },

  addDeductionDays: async (employeeId: number) => {
    return apiCall('/deductions/days', 'POST', { employeeId });
  },

  addDeductionUnpaid: async (employeeId: number) => {
    return apiCall('/deductions/unpaid', 'POST', { employeeId });
  },

  removeResignedDeductions: async () => {
    return apiCall('/deductions/remove-resigned', 'DELETE');
  },

  // Payroll
  getLastMonthPayroll: async (employeeId: number) => {
    return apiCall(`/payroll/${employeeId}/last-month`);
  },

  generatePayroll: async (employeeId: number, fromDate: string, toDate: string) => {
    return apiCall('/payroll/generate', 'POST', { employeeId, fromDate, toDate });
  },

  generatePayrollForAll: async (fromDate: string, toDate: string) => {
    return apiCall('/payroll/generate-all', 'POST', { fromDate, toDate });
  },

  getAllPayroll: async () => {
    return apiCall('/payroll/all');
  },

  // Performance
  getPerformance: async (employeeId: number, semester: string) => {
    return apiCall(`/performance/${employeeId}/${semester}`);
  },

  getWinterPerformance: async () => {
    return apiCall('/performance/winter');
  },

  submitEvaluation: async (data: any) => {
    return apiCall('/performance/evaluate', 'POST', data);
  },

  // Holidays
  addHoliday: async (name: string, fromDate: string, toDate: string) => {
    return apiCall('/holidays', 'POST', { name, fromDate, toDate });
  },

  removeHolidayAttendance: async () => {
    return apiCall('/holidays/remove-attendance', 'DELETE');
  },

  // Operations
  replaceEmployee: async (emp1Id: number, emp2Id: number, fromDate: string, toDate: string) => {
    return apiCall('/operations/replace-employee', 'POST', { emp1Id, emp2Id, fromDate, toDate });
  },

  updateEmploymentStatus: async (employeeId: number) => {
    return apiCall('/operations/update-status', 'POST', { employeeId });
  },

  removeDayOff: async (employeeId: number) => {
    return apiCall(`/operations/remove-day-off/${employeeId}`, 'DELETE');
  },

  // Role check
  isEmployeeApprover: async (employeeId: number) => {
    return apiCall(`/roles/check-approver/${employeeId}`);
  }
};
