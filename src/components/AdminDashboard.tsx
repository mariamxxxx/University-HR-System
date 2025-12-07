import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../utils/api.tsx';
import { formatTime } from '../utils/time';
import {fetchEmployeesFromBackend, 
        fetchEmployeesPerDeptFromBackend, 
        fetchRejectedMedicalsFromBackend,
        removeResignedDeductionsFromBackend,
        updateAttendanceFromBackend,
        addHolidayToBackend,
        initiateAttendanceInBackend
 } from './admin/AdminPart1';


interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesPerDept, setEmployeesPerDept] = useState<any[]>([]);
  const [rejectedMedicals, setRejectedMedicals] = useState<any[]>([]);
  const [yesterdayAttendance, setYesterdayAttendance] = useState<any[]>([]);
  const [yesterdayLoaded, setYesterdayLoaded] = useState(false);
  const [winterPerformance, setWinterPerformance] = useState<any[]>([]);
  const [winterLoaded, setWinterLoaded] = useState(false);
  const [allPayroll, setAllPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [attendanceData, setAttendanceData] = useState({ employee_ID: '', check_in_time: '', check_out_time: '' });
  const [holidayData, setHolidayData] = useState({ name: '', from_date: '', to_date: '' });
  const [employeeIdForDayOff, setEmployeeIdForDayOff] = useState('');
  const [employeeIdForLeaves, setEmployeeIdForLeaves] = useState('');
  const [employeeIdForStatus, setEmployeeIdForStatus] = useState('');
  const [replacementData, setReplacementData] = useState({ Emp1_ID: '', Emp2_ID: '', from_date: '', to_date: '' });

  const statusCounts = employees.reduce(
    (acc, emp) => {
      if (emp.employment_status === 'active') acc.active += 1;
      if (emp.employment_status === 'onleave') acc.onLeave += 1;
      return acc;
    },
    { active: 0, onLeave: 0 }
  );

  const statusCards = [
    {
      label: 'Total Employees',
      value: employees.length,
      description: 'Organization-wide',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      label: 'Active Employees',
      value: statusCounts.active,
      description: 'Currently on duty',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      label: 'On Leave',
      value: statusCounts.onLeave,
      description: 'Approved leaves',
      gradient: 'from-yellow-500 to-amber-500'
    }
  ];

  useEffect(() => {
    if (activeSection === 'overview') {
      loadOverviewData();
    }
  }, [activeSection]);

  const loadOverviewData = async () => {
    setLoading(true);
    let success = false;
    try {
      const result = await fetchEmployeesFromBackend();
      setEmployees(result);

      const deptResult = await fetchEmployeesPerDeptFromBackend();
      const normalizedDept = deptResult.map((dept: any) => ({
        dept_name: dept.dept_name || 'Unassigned',
        Number_of_Employees: dept.Number_of_Employees || 0
      }));
      setEmployeesPerDept(normalizedDept);
      success = true;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

    return success;
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: null },
    { id: 'employees', name: 'Employees', icon: null },
    { id: 'attendance', name: 'Attendance', icon: null },
    { id: 'leaves', name: 'Leaves', icon: null },
    { id: 'performance', name: 'Performance', icon: null },
    { id: 'operations', name: 'Operations', icon: null }
  ];

  const handleFullRefresh = async () => {
    setActiveSection('overview');
    setEmployees([]);
    setEmployeesPerDept([]);
    setRejectedMedicals([]);
    setYesterdayAttendance([]);
    setYesterdayLoaded(false);
    setWinterPerformance([]);
    setWinterLoaded(false);
    setAllPayroll([]);
    setAttendanceData({ employee_ID: '', check_in_time: '', check_out_time: '' });
    setHolidayData({ name: '', from_date: '', to_date: '' });
    setEmployeeIdForDayOff('');
    setEmployeeIdForLeaves('');
    setEmployeeIdForStatus('');
    setReplacementData({ Emp1_ID: '', Emp2_ID: '', from_date: '', to_date: '' });

    const refreshed = await loadOverviewData();
    if (refreshed) {
      toast.success('Admin dashboard refreshed');
    } else {
      toast.error('Failed to refresh admin data');
    }
  };

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
            <div className="flex items-center gap-3">
              <button
                onClick={handleFullRefresh}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.5 9A7.5 7.5 0 0119 12M18.5 15A7.5 7.5 0 015 12" />
                </svg>
                Refresh Data
              </button>
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
              {statusCards.map((card) => (
                <div key={card.label} className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg opacity-90">{card.label}</h3>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl mb-1">{card.value}</p>
                  <p className="text-sm opacity-80">{card.description}</p>
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
                <div className="space-y-6">
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const result = await initiateAttendanceInBackend();
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
                        const result = await removeResignedDeductionsFromBackend();
                        toast.success(result.message);
                      } catch (error: any) {
                        toast.error(error.message || 'Failed to remove deductions');
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Employees per Department
                </h3>
                {employeesPerDept.length === 0 ? (
                  <p className="text-gray-600">No department data available yet.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-2 text-gray-600 font-medium">Department</th>
                          <th className="text-right px-4 py-2 text-gray-600 font-medium">Employees</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeesPerDept.map((dept, idx) => (
                          <tr key={dept.dept_name ?? idx} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-900">{dept.dept_name}</td>
                            <td className="px-4 py-2 text-right text-gray-900 font-semibold">{dept.Number_of_Employees}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Employees Section */}
        {activeSection === 'employees' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 -mx-4 sm:-mx-6 lg:-mx-8">
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
                      <th className="text-left py-3 px-4 text-gray-700">Gender</th>
                      <th className="text-left py-3 px-4 text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-gray-700">Address</th>
                      <th className="text-left py-3 px-4 text-gray-700">Experience</th>
                      <th className="text-left py-3 px-4 text-gray-700">Day Off</th>
                      <th className="text-left py-3 px-4 text-gray-700">Contract</th>
                      <th className="text-left py-3 px-4 text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700">Annual Balance</th>
                      <th className="text-left py-3 px-4 text-gray-700">Accidental Balance</th>

                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.employee_ID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{emp.employee_ID}</td>
                        <td className="py-3 px-4 text-gray-900">{emp.first_name} {emp.last_name}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                            emp.gender?.toLowerCase() === 'f' ? 'bg-red-100 text-pink-700' :
                            emp.gender?.toLowerCase() === 'm' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {emp.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{emp.email}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.address}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.years_of_experience}y</td>
                        <td className="py-3 px-4 text-gray-600">{emp.official_day_off}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.type_of_contract}</td>
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
                        <td className="py-3 px-4 text-gray-600">{emp.annual_balance} days</td>
                        <td className="py-3 px-4 text-gray-600">{emp.accidental_balance} days</td>
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
                Update Attendance
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const result = await updateAttendanceFromBackend(parseInt(attendanceData.employee_ID), attendanceData.check_in_time, attendanceData.check_out_time);
                  toast.success(result.message);
                  setAttendanceData({ employee_ID: '', check_in_time: '', check_out_time: '' });
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }} className="grid md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium" htmlFor="attendance-employee-id">
                    Employee ID
                  </label>
                  <input
                    id="attendance-employee-id"
                    type="number"
                    placeholder="Employee ID"
                    value={attendanceData.employee_ID}
                    onChange={(e) => setAttendanceData({ ...attendanceData, employee_ID: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium" htmlFor="check-in-time">
                    From Time (Check-in)
                  </label>
                  <input
                    id="check-in-time"
                    type="time"
                    placeholder="Check-in"
                    value={attendanceData.check_in_time}
                    onChange={(e) => setAttendanceData({ ...attendanceData, check_in_time: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium" htmlFor="check-out-time">
                    To Time (Check-out)
                  </label>
                  <input
                    id="check-out-time"
                    type="time"
                    placeholder="Check-out"
                    value={attendanceData.check_out_time}
                    onChange={(e) => setAttendanceData({ ...attendanceData, check_out_time: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50">
                  Update
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                Add Holiday
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const result = await addHolidayToBackend(holidayData.name, holidayData.from_date, holidayData.to_date);
                  toast.success(result.message);
                  setHolidayData({ name: '', from_date: '', to_date: '' });
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }} className="grid md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium" htmlFor="holiday-name">
                    Holiday Name
                  </label>
                  <input
                    id="holiday-name"
                    type="text"
                    placeholder="Holiday Name"
                    value={holidayData.name}
                    onChange={(e) => setHolidayData({ ...holidayData, name: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium" htmlFor="holiday-from-date">
                    From Date
                  </label>
                  <input
                    id="holiday-from-date"
                    type="date"
                    value={holidayData.from_date}
                    onChange={(e) => setHolidayData({ ...holidayData, from_date: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600 font-medium" htmlFor="holiday-to-date">
                    To Date
                  </label>
                  <input
                    id="holiday-to-date"
                    type="date"
                    value={holidayData.to_date}
                    onChange={(e) => setHolidayData({ ...holidayData, to_date: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50">
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
                    setYesterdayLoaded(true);
                  }
                }}
                className="w-full mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                View Yesterday's Attendance
              </button>
              {yesterdayLoaded ? (
                yesterdayAttendance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 text-gray-700">Employee ID</th>
                          <th className="text-left py-3 px-4 text-gray-700">Check-in Time</th>
                          <th className="text-left py-3 px-4 text-gray-700">Check-out Time</th>
                          <th className="text-left py-3 px-4 text-gray-700">Duration</th>
                          <th className="text-left py-3 px-4 text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yesterdayAttendance.map((att, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-900">{att.emp_ID}</td>
                            <td className="py-3 px-4 text-gray-600">{formatTime(att.check_in_time)}</td>
                            <td className="py-3 px-4 text-gray-600">{formatTime(att.check_out_time)}</td>
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
                ) : (
                  <p className="text-gray-600 text-center my-6">No attendance records to show</p>
                )
              ) : null}
            </div>
          </div>
        )}

        {/* Leaves Section */}
        {activeSection === 'leaves' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                Rejected Medical Leaves
              </h3>
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await fetchRejectedMedicalsFromBackend();
                    setRejectedMedicals(Array.isArray(result) ? result : result?.data ?? []);
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
                          <p className="text-gray-900">Request #{medical.request_ID} - Employee {medical.Emp_ID}</p>
                          <p className="text-gray-600 text-sm"> {medical.disability_details == null ? 'No disability details' : medical.disability_details}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{medical.insurance_status ? 'Insured' : 'Not Insured'}</span>                        
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{medical.type}</span>                                               
                      </div>
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
                  setWinterLoaded(true);
                }
              }}
              className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              View Winter Performance
            </button>
            {winterLoaded ? (
              winterPerformance.length > 0 ? (
                <div className="space-y-4">
                  {winterPerformance.map((perf, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-gray-900">{perf['emp_ID']}</p>
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
              ) : (
                <p className="text-gray-600 text-center my-6">No performance records to show</p>
              )
            ) : null}
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
                    <div>
                      <label className="block text-gray-500 mb-1 text-center">From Date</label>
                      <input
                        type="date"
                        value={replacementData.from_date}
                        onChange={(e) => setReplacementData({ ...replacementData, from_date: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1 text-center">To Date</label>
                      <input
                        type="date"
                        value={replacementData.to_date}
                        onChange={(e) => setReplacementData({ ...replacementData, to_date: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
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
                <div className="space-y-3">
                  <div>
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
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                      Remove Official Holiday Attendance
                    </button>
                  </div>

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
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Employee ID"
                      value={employeeIdForDayOff}
                      onChange={(e) => setEmployeeIdForDayOff(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50">
                      Remove Unattended Day-off
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
