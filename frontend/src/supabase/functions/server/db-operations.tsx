// Database operations helper functions
import * as kv from './kv_store.tsx';

// ==================== HELPER FUNCTIONS ====================

// Generate unique IDs
let employeeCounter = 1000;
let leaveCounter = 1;
let attendanceCounter = 1;
let payrollCounter = 1;
let performanceCounter = 1;
let deductionCounter = 1;
let documentCounter = 1;
let holidayCounter = 1;
let replaceCounter = 1;

export async function initializeCounters() {
  const counters = await kv.get('counters');
  if (counters) {
    employeeCounter = counters.employee || 1000;
    leaveCounter = counters.leave || 1;
    attendanceCounter = counters.attendance || 1;
    payrollCounter = counters.payroll || 1;
    performanceCounter = counters.performance || 1;
    deductionCounter = counters.deduction || 1;
    documentCounter = counters.document || 1;
    holidayCounter = counters.holiday || 1;
    replaceCounter = counters.replace || 1;
  }
}

export async function saveCounters() {
  await kv.set('counters', {
    employee: employeeCounter,
    leave: leaveCounter,
    attendance: attendanceCounter,
    payroll: payrollCounter,
    performance: performanceCounter,
    deduction: deductionCounter,
    document: documentCounter,
    holiday: holidayCounter,
    replace: replaceCounter,
  });
}

export function getNextEmployeeId() {
  return employeeCounter++;
}

export function getNextLeaveId() {
  return leaveCounter++;
}

export function getNextAttendanceId() {
  return attendanceCounter++;
}

export function getNextPayrollId() {
  return payrollCounter++;
}

export function getNextPerformanceId() {
  return performanceCounter++;
}

export function getNextDeductionId() {
  return deductionCounter++;
}

export function getNextDocumentId() {
  return documentCounter++;
}

export function getNextHolidayId() {
  return holidayCounter++;
}

export function getNextReplaceId() {
  return replaceCounter++;
}

// ==================== EMPLOYEE OPERATIONS ====================

export async function getAllEmployees() {
  const keys = await kv.getByPrefix('employee:');
  return keys.map(k => k.value);
}

export async function getEmployeeById(id: number) {
  return await kv.get(`employee:${id}`);
}

export async function createEmployee(data: any) {
  const id = getNextEmployeeId();
  const employee = { employee_ID: id, ...data };
  await kv.set(`employee:${id}`, employee);
  await saveCounters();
  return employee;
}

export async function updateEmployee(id: number, data: any) {
  const employee = await getEmployeeById(id);
  if (!employee) return null;
  const updated = { ...employee, ...data };
  await kv.set(`employee:${id}`, updated);
  return updated;
}

// ==================== DEPARTMENT OPERATIONS ====================

export async function getAllDepartments() {
  const keys = await kv.getByPrefix('department:');
  return keys.map(k => k.value);
}

export async function getDepartmentByName(name: string) {
  return await kv.get(`department:${name}`);
}

export async function createDepartment(data: any) {
  await kv.set(`department:${data.name}`, data);
  return data;
}

// ==================== ROLE OPERATIONS ====================

export async function getAllRoles() {
  const keys = await kv.getByPrefix('role:');
  return keys.map(k => k.value);
}

export async function getRoleByName(name: string) {
  return await kv.get(`role:${name}`);
}

export async function createRole(data: any) {
  await kv.set(`role:${data.role_name}`, data);
  return data;
}

export async function getEmployeeRoles(empId: number) {
  const keys = await kv.getByPrefix(`employee_role:${empId}:`);
  return keys.map(k => k.value);
}

export async function assignRoleToEmployee(empId: number, roleName: string) {
  await kv.set(`employee_role:${empId}:${roleName}`, { emp_ID: empId, role_name: roleName });
}

// ==================== LEAVE OPERATIONS ====================

export async function createLeave(data: any) {
  const id = getNextLeaveId();
  const numDays = Math.floor((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const leave = {
    request_ID: id,
    date_of_request: data.date_of_request || new Date().toISOString().split('T')[0],
    start_date: data.start_date,
    end_date: data.end_date,
    num_days: numDays,
    final_approval_status: 'pending',
    ...data
  };
  await kv.set(`leave:${id}`, leave);
  await saveCounters();
  return leave;
}

export async function getLeaveById(id: number) {
  return await kv.get(`leave:${id}`);
}

export async function updateLeave(id: number, data: any) {
  const leave = await getLeaveById(id);
  if (!leave) return null;
  const updated = { ...leave, ...data };
  await kv.set(`leave:${id}`, updated);
  return updated;
}

export async function getAllLeaves() {
  const keys = await kv.getByPrefix('leave:');
  return keys.map(k => k.value).filter(l => typeof l.request_ID !== 'undefined');
}

// Specific leave types
export async function createAnnualLeave(leaveId: number, empId: number, replacementEmp: number) {
  await kv.set(`annual_leave:${leaveId}`, { request_ID: leaveId, emp_ID: empId, replacement_emp: replacementEmp });
}

export async function createAccidentalLeave(leaveId: number, empId: number) {
  await kv.set(`accidental_leave:${leaveId}`, { request_ID: leaveId, emp_ID: empId });
}

export async function createMedicalLeave(leaveId: number, empId: number, data: any) {
  await kv.set(`medical_leave:${leaveId}`, { request_ID: leaveId, Emp_ID: empId, ...data });
}

export async function createUnpaidLeave(leaveId: number, empId: number) {
  await kv.set(`unpaid_leave:${leaveId}`, { request_ID: leaveId, emp_ID: empId });
}

export async function createCompensationLeave(leaveId: number, empId: number, data: any) {
  await kv.set(`compensation_leave:${leaveId}`, { request_ID: leaveId, emp_ID: empId, ...data });
}

export async function getAnnualLeaveByLeaveId(leaveId: number) {
  return await kv.get(`annual_leave:${leaveId}`);
}

export async function getAccidentalLeaveByLeaveId(leaveId: number) {
  return await kv.get(`accidental_leave:${leaveId}`);
}

export async function getMedicalLeaveByLeaveId(leaveId: number) {
  return await kv.get(`medical_leave:${leaveId}`);
}

export async function getUnpaidLeaveByLeaveId(leaveId: number) {
  return await kv.get(`unpaid_leave:${leaveId}`);
}

export async function getCompensationLeaveByLeaveId(leaveId: number) {
  return await kv.get(`compensation_leave:${leaveId}`);
}

// ==================== ATTENDANCE OPERATIONS ====================

export async function createAttendance(data: any) {
  const id = getNextAttendanceId();
  const attendance = { attendance_ID: id, status: 'absent', ...data };
  await kv.set(`attendance:${id}`, attendance);
  await kv.set(`attendance_emp_date:${data.emp_ID}:${data.date}`, id);
  await saveCounters();
  return attendance;
}

export async function getAttendanceById(id: number) {
  return await kv.get(`attendance:${id}`);
}

export async function getAttendanceByEmpAndDate(empId: number, date: string) {
  const attId = await kv.get(`attendance_emp_date:${empId}:${date}`);
  if (!attId) return null;
  return await getAttendanceById(attId);
}

export async function updateAttendance(id: number, data: any) {
  const attendance = await getAttendanceById(id);
  if (!attendance) return null;
  const updated = { ...attendance, ...data };
  await kv.set(`attendance:${id}`, updated);
  return updated;
}

export async function getAllAttendance() {
  const keys = await kv.getByPrefix('attendance:');
  return keys.map(k => k.value).filter(a => typeof a.attendance_ID !== 'undefined');
}

export async function deleteAttendance(id: number) {
  const attendance = await getAttendanceById(id);
  if (attendance) {
    await kv.del(`attendance_emp_date:${attendance.emp_ID}:${attendance.date}`);
  }
  await kv.del(`attendance:${id}`);
}

// ==================== PAYROLL OPERATIONS ====================

export async function createPayroll(data: any) {
  const id = getNextPayrollId();
  const payroll = { ID: id, ...data };
  await kv.set(`payroll:${id}`, payroll);
  await saveCounters();
  return payroll;
}

export async function getAllPayroll() {
  const keys = await kv.getByPrefix('payroll:');
  return keys.map(k => k.value);
}

// ==================== PERFORMANCE OPERATIONS ====================

export async function createPerformance(data: any) {
  const id = getNextPerformanceId();
  const performance = { performance_ID: id, ...data };
  await kv.set(`performance:${id}`, performance);
  await saveCounters();
  return performance;
}

export async function getAllPerformance() {
  const keys = await kv.getByPrefix('performance:');
  return keys.map(k => k.value);
}

// ==================== DEDUCTION OPERATIONS ====================

export async function createDeduction(data: any) {
  const id = getNextDeductionId();
  const deduction = { deduction_ID: id, status: 'pending', ...data };
  await kv.set(`deduction:${id}`, deduction);
  await saveCounters();
  return deduction;
}

export async function getDeductionById(id: number) {
  return await kv.get(`deduction:${id}`);
}

export async function updateDeduction(id: number, data: any) {
  const deduction = await getDeductionById(id);
  if (!deduction) return null;
  const updated = { ...deduction, ...data };
  await kv.set(`deduction:${id}`, updated);
  return updated;
}

export async function getAllDeductions() {
  const keys = await kv.getByPrefix('deduction:');
  return keys.map(k => k.value);
}

export async function deleteDeduction(id: number) {
  await kv.del(`deduction:${id}`);
}

// ==================== HOLIDAY OPERATIONS ====================

export async function createHoliday(data: any) {
  const id = getNextHolidayId();
  const holiday = { holiday_id: id, ...data };
  await kv.set(`holiday:${id}`, holiday);
  await saveCounters();
  return holiday;
}

export async function getAllHolidays() {
  const keys = await kv.getByPrefix('holiday:');
  return keys.map(k => k.value);
}

// ==================== DOCUMENT OPERATIONS ====================

export async function createDocument(data: any) {
  const id = getNextDocumentId();
  const document = { document_ID: id, status: 'valid', ...data };
  await kv.set(`document:${id}`, document);
  await saveCounters();
  return document;
}

export async function getAllDocuments() {
  const keys = await kv.getByPrefix('document:');
  return keys.map(k => k.value);
}

// ==================== EMPLOYEE APPROVE LEAVE OPERATIONS ====================

export async function createEmployeeApproveLeave(emp1Id: number, leaveId: number, status: string) {
  await kv.set(`employee_approve_leave:${emp1Id}:${leaveId}`, {
    Emp1_ID: emp1Id,
    Leave_ID: leaveId,
    status: status
  });
}

export async function updateEmployeeApproveLeave(emp1Id: number, leaveId: number, status: string) {
  const approval = await kv.get(`employee_approve_leave:${emp1Id}:${leaveId}`);
  if (!approval) return null;
  const updated = { ...approval, status };
  await kv.set(`employee_approve_leave:${emp1Id}:${leaveId}`, updated);
  return updated;
}

export async function getApprovalsByLeaveId(leaveId: number) {
  const keys = await kv.getByPrefix(`employee_approve_leave:`);
  return keys.map(k => k.value).filter(a => a.Leave_ID === leaveId);
}

// ==================== EMPLOYEE REPLACE OPERATIONS ====================

export async function createEmployeeReplace(data: any) {
  const id = getNextReplaceId();
  const replace = { Table_ID: id, ...data };
  await kv.set(`employee_replace:${id}`, replace);
  await saveCounters();
  return replace;
}

export async function getAllEmployeeReplaces() {
  const keys = await kv.getByPrefix('employee_replace:');
  return keys.map(k => k.value);
}

// ==================== HELPER FUNCTIONS ====================

export function calculateTotalDuration(checkIn: string | null, checkOut: string | null): number | null {
  if (!checkIn || !checkOut) return null;
  
  const [inHour, inMin] = checkIn.split(':').map(Number);
  const [outHour, outMin] = checkOut.split(':').map(Number);
  
  const inMinutes = inHour * 60 + inMin;
  const outMinutes = outHour * 60 + outMin;
  
  return outMinutes - inMinutes;
}

export function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getDayOfWeek(date: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

export async function isOnLeave(empId: number, fromDate: string, toDate: string): Promise<boolean> {
  const leaves = await getAllLeaves();
  
  for (const leave of leaves) {
    if (leave.final_approval_status === 'rejected') continue;
    
    // Check if this leave belongs to the employee
    const annualLeave = await getAnnualLeaveByLeaveId(leave.request_ID);
    const accidentalLeave = await getAccidentalLeaveByLeaveId(leave.request_ID);
    const medicalLeave = await getMedicalLeaveByLeaveId(leave.request_ID);
    const unpaidLeave = await getUnpaidLeaveByLeaveId(leave.request_ID);
    const compensationLeave = await getCompensationLeaveByLeaveId(leave.request_ID);
    
    const belongsToEmployee = 
      (annualLeave && annualLeave.emp_ID === empId) ||
      (accidentalLeave && accidentalLeave.emp_ID === empId) ||
      (medicalLeave && medicalLeave.Emp_ID === empId) ||
      (unpaidLeave && unpaidLeave.emp_ID === empId) ||
      (compensationLeave && compensationLeave.emp_ID === empId);
    
    if (!belongsToEmployee) continue;
    
    // Check date overlap
    const leaveStart = new Date(leave.start_date);
    const leaveEnd = new Date(leave.end_date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    if (!(leaveEnd < from || leaveStart > to)) {
      return true;
    }
  }
  
  return false;
}

export function calculateSalary(employee: any, roles: any[]): number {
  if (roles.length === 0) return 0;
  
  // Get highest rank role
  const sortedRoles = roles.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const primaryRole = sortedRoles[0];
  
  const baseSalary = primaryRole.base_salary || 0;
  const percentageYOE = primaryRole.percentage_YOE || 0;
  const yearsOfExperience = employee.years_of_experience || 0;
  
  return baseSalary + (percentageYOE / 100) * yearsOfExperience * baseSalary;
}

export function getRatePerHour(salary: number): number {
  return salary / (22 * 8);
}
