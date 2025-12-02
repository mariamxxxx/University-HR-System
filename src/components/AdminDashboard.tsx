import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../utils/api.tsx';
import { fetchEmployeesFromBackend } from './admin/AdminPart1';


interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesPerDept, setEmployeesPerDept] = useState<any[]>([]);
  const [rejectedMedicals, setRejectedMedicals] = useState<any[]>([]);
  const [yesterdayAttendance, setYesterdayAttendance] = useState<any[]>([]);
  const [winterPerformance, setWinterPerformance] = useState<any[]>([]);
  const [allPayroll, setAllPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [attendanceData, setAttendanceData] = useState({ employee_ID: '', check_in_time: '', check_out_time: '' });
  const [holidayData, setHolidayData] = useState({ name: '', from_date: '', to_date: '' });
  const [employeeIdForDayOff, setEmployeeIdForDayOff] = useState('');
  const [employeeIdForLeaves, setEmployeeIdForLeaves] = useState('');
  const [employeeIdForStatus, setEmployeeIdForStatus] = useState('');
  const [replacementData, setReplacementData] = useState({ Emp1_ID: '', Emp2_ID: '', from_date: '', to_date: '' });

  useEffect(() => {
    if (activeSection === 'overview') {
      loadOverviewData();
    }
  }, [activeSection]);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [empResult, deptResult] = await Promise.all([
        fetchEmployeesFromBackend(),
        api.getEmployeesPerDept()
      ]);
      setEmployees(empResult);
      setEmployeesPerDept(deptResult.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: null },
    { id: 'employees', name: 'Employees', icon: null },
    { id: 'attendance', name: 'Attendance', icon: null },
    { id: 'leaves', name: 'Leaves', icon: null },
    { id: 'payroll', name: 'Payroll', icon: null },
    { id: 'performance', name: 'Performance', icon: null },
    { id: 'operations', name: 'Operations', icon: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-gray-900 text-xl">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">System Administration & Management</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Pills */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {employeesPerDept.map((dept, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg opacity-90">{dept.dept_name}</h3>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl mb-1">{dept.Number_of_Employees}</p>
                  <p className="text-sm opacity-80">employees</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const result = await api.initiateAttendance();
                        toast.success(result.message);
                      } catch (error: any) {
                        toast.error(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all"
                  >
                    Initialize Today's Attendance
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Remove all deductions for resigned employees?')) return;
                      setLoading(true);
                      try {
                        const result = await api.removeResignedDeductions();
                        toast.success(result.message);
                      } catch (error: any) {
                        toast.error(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    Remove Resigned Employee Deductions
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  System Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Total Employees</span>
                    <span className="text-gray-900">{employees.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Active Employees</span>
                    <span className="text-green-600">{employees.filter(e => e.employment_status === 'active').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">On Leave</span>
                    <span className="text-yellow-600">{employees.filter(e => e.employment_status === 'onleave').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Section */}
        {activeSection === 'employees' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              All Employees
            </h3>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const result = await fetchEmployeesFromBackend();
                  setEmployees(result);
                  toast.success('Employee list refreshed');
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Refresh List
            </button>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700">Contract</th>
                      <th className="text-left py-3 px-4 text-gray-700">Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.employee_ID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{emp.employee_ID}</td>
                        <td className="py-3 px-4 text-gray-900">{emp.first_name} {emp.last_name}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.dept_name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                            emp.employment_status === 'active' ? 'bg-green-100 text-green-700' :
                            emp.employment_status === 'onleave' ? 'bg-yellow-100 text-yellow-700' :
                            emp.employment_status === 'resigned' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {emp.employment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{emp.type_of_contract}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.years_of_experience}y</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Attendance Section */}
        {activeSection === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <span>✏️</span>
                Update Attendance
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const result = await api.updateAttendance(parseInt(attendanceData.employee_ID), attendanceData.check_in_time, attendanceData.check_out_time);
                  toast.success(result.message);
                  setAttendanceData({ employee_ID: '', check_in_time: '', check_out_time: '' });
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }} className="grid md:grid-cols-4 gap-4">
                <input
                  type="number"
                  placeholder="Employee ID"
                  value={attendanceData.employee_ID}
                  onChange={(e) => setAttendanceData({ ...attendanceData, employee_ID: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="time"
                  placeholder="Check-in"
                  value={attendanceData.check_in_time}
                  onChange={(e) => setAttendanceData({ ...attendanceData, check_in_time: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  placeholder="Check-out"
                  value={attendanceData.check_out_time}
                  onChange={(e) => setAttendanceData({ ...attendanceData, check_out_time: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50">
                  Update
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <span>📆</span>
                Add Holiday
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const result = await api.addHoliday(holidayData.name, holidayData.from_date, holidayData.to_date);
                  toast.success(result.message);
                  setHolidayData({ name: '', from_date: '', to_date: '' });
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }} className="grid md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Holiday Name"
                  value={holidayData.name}
                  onChange={(e) => setHolidayData({ ...holidayData, name: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="date"
                  value={holidayData.from_date}
                  onChange={(e) => setHolidayData({ ...holidayData, from_date: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="date"
                  value={holidayData.to_date}
                  onChange={(e) => setHolidayData({ ...holidayData, to_date: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50">
                  Add Holiday
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await api.getYesterdayAttendance();
                    setYesterdayAttendance(result.data);
                    toast.success('Yesterday\'s attendance loaded');
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                View Yesterday's Attendance
              </button>
              {yesterdayAttendance.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-700">Employee</th>
                        <th className="text-left py-3 px-4 text-gray-700">Check-in</th>
                        <th className="text-left py-3 px-4 text-gray-700">Check-out</th>
                        <th className="text-left py-3 px-4 text-gray-700">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yesterdayAttendance.map((att, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{att['Employee Name']}</td>
                          <td className="py-3 px-4 text-gray-600">{att.check_in_time || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{att.check_out_time || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{att.total_duration || 'N/A'} mins</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs ${att.status === 'attended' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaves Section */}
        {activeSection === 'leaves' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <span>❌</span>
                Rejected Medical Leaves
              </h3>
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await api.getRejectedMedicals();
                    setRejectedMedicals(result.data);
                    toast.success('Rejected medical leaves loaded');
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Load Rejected Medical Leaves
              </button>
              {rejectedMedicals.length > 0 && (
                <div className="space-y-2">
                  {rejectedMedicals.map((medical) => (
                    <div key={medical.request_ID} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">Request #{medical.request_ID} - Employee {medical.emp_ID}</p>
                          <p className="text-gray-600 text-sm">{medical.start_date} to {medical.end_date} ({medical.num_days} days)</p>
                        </div>
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Rejected</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <span>🗑️</span>
                Remove Approved Leaves from Attendance
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const result = await api.removeApprovedLeaves(parseInt(employeeIdForLeaves));
                  toast.success(result.message);
                  setEmployeeIdForLeaves('');
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }} className="flex gap-4">
                <input
                  type="number"
                  placeholder="Employee ID"
                  value={employeeIdForLeaves}
                  onChange={(e) => setEmployeeIdForLeaves(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50">
                  Remove Leave Records
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payroll Section */}
        {activeSection === 'payroll' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Employee Payroll Records (Last Month)
            </h3>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const result = await api.getAllPayroll();
                  setAllPayroll(result.data);
                  toast.success('Payroll records loaded');
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Load Payroll Records
            </button>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : allPayroll.length === 0 ? (
              <p className="text-gray-600">No payroll records found. Click "Load Payroll Records" to view.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-gray-700">Period</th>
                      <th className="text-left py-3 px-4 text-gray-700">Payment Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">Bonus</th>
                      <th className="text-left py-3 px-4 text-gray-700">Deductions</th>
                      <th className="text-left py-3 px-4 text-gray-700">Final Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPayroll.map((payroll) => (
                      <tr key={payroll.ID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{payroll.ID}</td>
                        <td className="py-3 px-4 text-gray-900">{payroll.employee_name}</td>
                        <td className="py-3 px-4 text-gray-600">{payroll.employee_dept}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{payroll.from_date} to {payroll.to_date}</td>
                        <td className="py-3 px-4 text-gray-600">{payroll.payment_date}</td>
                        <td className="py-3 px-4 text-green-600">+${payroll.bonus_amount?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 px-4 text-red-600">-${payroll.deductions_amount?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 px-4 text-indigo-700">${payroll.final_salary_amount?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Performance Section */}
        {activeSection === 'performance' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <span>⭐</span>
              Winter Semester Performance
            </h3>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const result = await api.getWinterPerformance();
                  setWinterPerformance(result.data);
                  toast.success('Performance data loaded');
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Load Winter Performance
            </button>
            {winterPerformance.length > 0 && (
              <div className="space-y-4">
                {winterPerformance.map((perf, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">{perf['Employee Name']}</p>
                        <p className="text-gray-600 text-sm">{perf.semester} - {perf.comments}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${i < perf.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-gray-700">{perf.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Operations Section */}
        {activeSection === 'operations' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <span>🔄</span>
                  Employee Replacement
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const result = await api.replaceEmployee(parseInt(replacementData.Emp1_ID), parseInt(replacementData.Emp2_ID), replacementData.from_date, replacementData.to_date);
                    toast.success(result.message);
                    setReplacementData({ Emp1_ID: '', Emp2_ID: '', from_date: '', to_date: '' });
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-4">
                  <input
                    type="number"
                    placeholder="Employee 1 ID (Being Replaced)"
                    value={replacementData.Emp1_ID}
                    onChange={(e) => setReplacementData({ ...replacementData, Emp1_ID: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Employee 2 ID (Replacement)"
                    value={replacementData.Emp2_ID}
                    onChange={(e) => setReplacementData({ ...replacementData, Emp2_ID: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={replacementData.from_date}
                      onChange={(e) => setReplacementData({ ...replacementData, from_date: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="date"
                      value={replacementData.to_date}
                      onChange={(e) => setReplacementData({ ...replacementData, to_date: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50">
                    Record Replacement
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Update Employment Status
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const result = await api.updateEmploymentStatus(parseInt(employeeIdForStatus));
                    toast.success(result.message);
                    setEmployeeIdForStatus('');
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-4">
                  <input
                    type="number"
                    placeholder="Employee ID"
                    value={employeeIdForStatus}
                    onChange={(e) => setEmployeeIdForStatus(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50">
                    Update Status
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <span>🧹</span>
                Cleanup Operations
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={async () => {
                    if (!confirm('Remove all attendance during holidays?')) return;
                    setLoading(true);
                    try {
                      const result = await api.removeHolidayAttendance();
                      toast.success(result.message);
                    } catch (error: any) {
                      toast.error(error.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Remove Holiday Attendance
                </button>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const result = await api.removeDayOff(parseInt(employeeIdForDayOff));
                    toast.success(result.message);
                    setEmployeeIdForDayOff('');
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }} className="col-span-2 flex gap-4">
                  <input
                    type="number"
                    placeholder="Employee ID"
                    value={employeeIdForDayOff}
                    onChange={(e) => setEmployeeIdForDayOff(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button type="submit" disabled={loading} className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50">
                    Remove Day-off
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
