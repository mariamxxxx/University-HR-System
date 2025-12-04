import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../utils/api.tsx';
import { LeaveBalanceCard } from './LeaveBalanceCard.tsx';

interface EmployeeDashboardProps {
  user: any;
  onLogout: () => void;
}

export function EmployeeDashboard({ user, onLogout }: EmployeeDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [deductions, setDeductions] = useState<any[]>([]);
  const [leaveStatus, setLeaveStatus] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [semester, setSemester] = useState('');
  const [performanceError, setPerformanceError] = useState('');
  const [deductionMonth, setDeductionMonth] = useState('');
  const [deductionsLoaded, setDeductionsLoaded] = useState(false);
  const [leaveStatusLoaded, setLeaveStatusLoaded] = useState(false);
  
  // Leave application state
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('');
  const [annualLeaveForm, setAnnualLeaveForm] = useState({ start_date: '', end_date: '', replacement_emp: '' });
  const [accidentalLeaveForm, setAccidentalLeaveForm] = useState({ start_date: '', end_date: '' });
  const [medicalLeaveForm, setMedicalLeaveForm] = useState({
    start_date: '', end_date: '', type: 'sick', insurance_status: 'yes', disability_details: '', document_description: '', file_name: ''
  });
  const [unpaidLeaveForm, setUnpaidLeaveForm] = useState({ start_date: '', end_date: '', document_description: '', file_name: '' });
  const [compensationLeaveForm, setCompensationLeaveForm] = useState({ 
    compensation_date: '', 
    reason: '', 
    date_of_original_workday: '', 
    replacement_emp: '' 
  });
  
  const [evaluationForm, setEvaluationForm] = useState({ employee_ID: '', rating: '5', comments: '', semester: '' });

  // Leave filters and sorting
  const [leaveFilter, setLeaveFilter] = useState<string>('all');
  const [leaveSortBy, setLeaveSortBy] = useState<string>('date');

  useEffect(() => {
    checkUserRole();
    if (activeSection === 'overview') {
      loadOverviewData();
    }
  }, [activeSection]);

  const checkUserRole = async () => {
    try {
      const result = await api.isEmployeeApprover(user.employee_ID);
      if (result.success) {
        setIsApprover(result.data.isApprover);
        setUserRole(result.data.role);
      }
    } catch (error) {
      console.error('Error checking role:', error);
    }
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: null },
    { id: 'attendance', name: 'Attendance', icon: null },
    { id: 'leaves', name: 'Apply Leaves', icon: null },
    ...(isApprover ? [{ id: 'approvals', name: 'Approve Leaves', icon: null }] : []),
    { id: 'performance', name: 'Performance', icon: null },
    { id: 'payrolls', name: 'Payrolls', icon: null },
    ...(userRole === 'Dean' ? [{ id: 'evaluate', name: 'Evaluate', icon: null }] : [])
  ];

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [attResult, statusResult] = await Promise.all([
        api.getAttendance(user.employee_ID),
        api.getLeaveStatus(user.employee_ID)
      ]);
      setAttendance(attResult.data || []);
      setLeaveStatus(statusResult.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };


  // const handleAnnualLeaveSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const result = await api.submitAnnualLeave(
  //       user.employee_ID, 
  //       annualLeaveForm.start_date, 
  //       annualLeaveForm.end_date, 
  //       annualLeaveForm.replacement_emp ? parseInt(annualLeaveForm.replacement_emp) : null
  //     );
  //     toast.success(result.message);
  //     setAnnualLeaveForm({ start_date: '', end_date: '', replacement_emp: '' });
  //     setSelectedLeaveType('');
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  {/*AW*/}
  const handleAnnualLeaveSubmit = async(e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{

      const result= await api.submitAnnualLeave (user.employee_ID, annualLeaveForm.start_date, annualLeaveForm.end_date,
      annualLeaveForm.replacement_emp ? parseInt(annualLeaveForm.replacement_emp) :null);
      toast.success(result.message);
      setAnnualLeaveForm({ start_date: '', end_date: '', replacement_emp:'' });
      setSelectedLeaveType('');
    }
    catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }


  };

  const handleAccidentalLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitAccidentalLeave(user.employee_ID, accidentalLeaveForm.start_date, accidentalLeaveForm.end_date);
      toast.success(result.message);
      setAccidentalLeaveForm({ start_date: '', end_date: '' });
      setSelectedLeaveType('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMedicalLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitMedicalLeave({ employee_ID: user.employee_ID, ...medicalLeaveForm });
      toast.success(result.message);
      setMedicalLeaveForm({ start_date: '', end_date: '', type: 'sick', insurance_status: 'yes', disability_details: '', document_description: '', file_name: '' });
      setSelectedLeaveType('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpaidLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitUnpaidLeave({ employee_ID: user.employee_ID, ...unpaidLeaveForm });
      toast.success(result.message);
      setUnpaidLeaveForm({ start_date: '', end_date: '', document_description: '', file_name: '' });
      setSelectedLeaveType('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompensationLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitCompensationLeave({ 
        employee_ID: user.employee_ID, 
        ...compensationLeaveForm,
        replacement_emp: parseInt(compensationLeaveForm.replacement_emp)
      });
      toast.success(result.message);
      setCompensationLeaveForm({ compensation_date: '', reason: '', date_of_original_workday: '', replacement_emp: '' });
      setSelectedLeaveType('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedApprovals = () => {
    let filtered = [...pendingApprovals];
    
    // Only Vice Dean, Dean, and President can approve annual and unpaid leaves
    // Filter to show only annual and unpaid leaves for these roles
    filtered = filtered.filter(a => a.leave?.type === 'annual' || a.leave?.type === 'unpaid');
    
    // Apply filter
    if (leaveFilter !== 'all') {
      filtered = filtered.filter(a => a.leave?.type === leaveFilter);
    }
    
    // Apply sort
    if (leaveSortBy === 'date') {
      filtered.sort((a, b) => new Date(a.leave.start_date).getTime() - new Date(b.leave.start_date).getTime());
    } else if (leaveSortBy === 'type') {
      filtered.sort((a, b) => a.leave.type.localeCompare(b.leave.type));
    } else if (leaveSortBy === 'employee') {
      filtered.sort((a, b) => a.requestor.localeCompare(b.requestor));
    }
    
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-gray-900 text-xl">{user.first_name} {user.last_name}</h1>
                <p className="text-gray-600 text-sm">Employee ID: {user.employee_ID} • {user.dept_name}</p>
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
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <LeaveBalanceCard 
              annual_balance={user.annual_balance} 
              accidental_balance={user.accidental_balance} 
            />

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg opacity-90">Status</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl mb-1 capitalize">{user.employment_status}</p>
                <p className="text-sm opacity-80">{user.type_of_contract}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg opacity-90">Experience</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl mb-1">{user.years_of_experience}</p>
                <p className="text-sm opacity-80">years</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg opacity-90">Department</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl mb-1">{user.dept_name}</p>
                <p className="text-sm opacity-80">department</p>
              </div>
            </div>

            {payroll.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last Month's Payroll
                </h3>
                {payroll.map((pay) => (
                  <div key={pay.ID} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Base + Bonus</p>
                        <p className="text-green-700 text-lg">+${pay.bonus_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Deductions</p>
                        <p className="text-red-700 text-lg">-${pay.deductions_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Period</p>
                        <p className="text-gray-900 text-sm">{pay.from_date} to {pay.to_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Final Salary</p>
                        <p className="text-indigo-700 text-2xl">${pay.final_salary_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          
          </div>
        )}

        {/* Attendance Section */}
        {activeSection === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Attendance (Current Month)
                </h3>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const result = await api.getAttendance(user.employee_ID);
                      setAttendance(result.data || []);
                      toast.success('Attendance refreshed');
                    } catch (error: any) {
                      toast.error(error.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
              {attendance.length === 0 ? (
                <p className="text-gray-600">No attendance records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-gray-700">Check-in</th>
                        <th className="text-left py-3 px-4 text-gray-700">Check-out</th>
                        <th className="text-left py-3 px-4 text-gray-700">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((att) => (
                        <tr key={att.attendance_ID} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{new Date(att.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-gray-600">{att.check_in_time || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{att.check_out_time || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{att.total_duration ? `${att.total_duration} mins` : 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                              att.status === 'attended' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
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

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Check Deductions
              </h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Month (1-12)"
                  value={deductionMonth}
                  onChange={(e) => setDeductionMonth(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={async () => {
                    if (!deductionMonth) {
                      toast.error('Please enter a month');
                      return;
                    }
                    setLoading(true);
                    setDeductionsLoaded(false);
                    try {
                      const result = await api.getDeductions(user.employee_ID, parseInt(deductionMonth));
                      setDeductions(result.data || []);
                      setDeductionsLoaded(true);
                      toast.success('Deductions loaded');
                    } catch (error: any) {
                      toast.error(error.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors"
                >
                  Load Deductions
                </button>
              </div>
              {deductions.length > 0 ? (
                <div className="space-y-3">
                  {deductions.map((ded) => (
                    <div key={ded.deduction_ID} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                      <div>
                        <p className="text-gray-900 font-medium">Date: {new Date(ded.date).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-sm mt-1">Status: {ded.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-700 font-semibold text-lg">-${ded.amount?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : deductionsLoaded ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No absence deductions found for the given month</p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Apply Leaves Section */}
        {activeSection === 'leaves' && (
          <div className="space-y-6">
            {!selectedLeaveType ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-gray-900 mb-6 text-center text-2xl">Select Leave Type</h3>
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                  <button
                    onClick={() => setSelectedLeaveType('annual')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center group w-64"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 mb-2">Annual Leave</h4>
                    <p className="text-sm text-gray-600">Planned vacation time</p>
                    <p className="text-xs font-bold text-green-600 mt-2">{user.annual_balance} days available</p>
                  </button>

                  <button
                    onClick={() => setSelectedLeaveType('accidental')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center group w-64"
                  >
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 mb-2">Accidental Leave</h4>
                    <p className="text-sm text-gray-600">Emergency leave (48hr window)</p>
                    <p className="text-xs font-bold text-green-600 mt-2">{user.accidental_balance} days available</p>
                  </button>

                  <button
                    onClick={() => setSelectedLeaveType('medical')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center group w-64"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 mb-2">Medical Leave</h4>
                    <p className="text-sm text-gray-600">Sick/Maternity leave</p>
                    <p className="text-xs text-gray-500 mt-2">Requires documentation</p>
                  </button>

                  <button
                    onClick={() => setSelectedLeaveType('unpaid')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center group w-64"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 mb-2">Unpaid Leave</h4>
                    <p className="text-sm text-gray-600">Leave without pay</p>
                    <p className="text-xs text-gray-500 mt-2">Max 30 days/year</p>
                  </button>

                  <button
                    onClick={() => setSelectedLeaveType('compensation')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center group w-64"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 mb-2">Compensation Leave</h4>
                    <p className="text-sm text-gray-600">Day off for extra work</p>
                    <p className="text-xs text-gray-500 mt-2">Requires approval</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedLeaveType('')}
                    className="bg-indigo-500 text-white hover:bg-indigo-600 p-2 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-gray-900 text-2xl font-bold">
                    {selectedLeaveType.charAt(0).toUpperCase() + selectedLeaveType.slice(1)} Leave Application
                  </h3>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-2xl">
                

                {selectedLeaveType === 'accidental' && (
                  <form onSubmit={handleAccidentalLeaveSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-gray-700 mb-2">Start Date</label>
                      <input type="date" value={accidentalLeaveForm.start_date} onChange={(e) => setAccidentalLeaveForm({ ...accidentalLeaveForm, start_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">End Date</label>
                      <input type="date" value={accidentalLeaveForm.end_date} onChange={(e) => setAccidentalLeaveForm({ ...accidentalLeaveForm, end_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <p className="text-sm text-gray-600">Note: Must be requested within 48 hours of the leave date</p>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Accidental Leave'}
                    </button>
                  </form>
                )}
{/* 
                {selectedLeaveType === 'annual' && (
                  <form onSubmit={handleAnnualLeaveSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-gray-700 mb-2">Start Date</label>
                      <input type="date" value={annualLeaveForm.start_date} onChange={(e) => setAnnualLeaveForm({ ...annualLeaveForm, start_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">End Date</label>
                      <input type="date" value={annualLeaveForm.end_date} onChange={(e) => setAnnualLeaveForm({ ...annualLeaveForm, end_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Replacement Employee ID</label>
                      <input type="number" placeholder="Enter replacement employee ID" value={annualLeaveForm.replacement_emp} onChange={(e) => setAnnualLeaveForm({ ...annualLeaveForm, replacement_emp: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Annual Leave'}
                    </button>
                  </form>
                )} */}
                {/* AW */}
                {selectedLeaveType==='annual' &&(
                  <form onSubmit={ handleAnnualLeaveSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-gray-700 mb-2">Start Date</label>
                      <input type='date' value={annualLeaveForm.start_date} onChange={(e)=> setAnnualLeaveForm({...annualLeaveForm, start_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">End Date</label>
                      <input type='date' value={annualLeaveForm.end_date} onChange={(e)=> setAnnualLeaveForm({...annualLeaveForm, end_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Replacement Employee ID</label>
                      <input type='number' placeholder="Enter replacement employee ID" value={annualLeaveForm.replacement_emp} onChange={(e)=> setAnnualLeaveForm({...annualLeaveForm, replacement_emp: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"> {loading ? 'Submitting...' : 'Submit Annual Leave'}</button>


                  </form>
                )}
   
                {selectedLeaveType === 'medical' && (
                  <form onSubmit={handleMedicalLeaveSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-gray-700 mb-2">Start Date</label>
                      <input type="date" value={medicalLeaveForm.start_date} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, start_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">End Date</label>
                      <input type="date" value={medicalLeaveForm.end_date} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, end_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Medical Leave Type</label>
                      <select value={medicalLeaveForm.type} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, type: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                        <option value="sick">Sick Leave</option>
                        <option value="maternity">Maternity Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Insurance Valid?</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="insurance" checked={medicalLeaveForm.insurance_status === 'yes'} onChange={() => setMedicalLeaveForm({ ...medicalLeaveForm, insurance_status: 'yes' })} className="w-4 h-4" />
                          <span className="text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="insurance" checked={medicalLeaveForm.insurance_status === 'no'} onChange={() => setMedicalLeaveForm({ ...medicalLeaveForm, insurance_status: 'no' })} className="w-4 h-4" />
                          <span className="text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Disability Details (if any)</label>
                      <input type="text" value={medicalLeaveForm.disability_details} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, disability_details: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Enter disability details if applicable" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Document Description</label>
                      <input type="text" value={medicalLeaveForm.document_description} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, document_description: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Describe the supporting document" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">File Name</label>
                      <input type="text" value={medicalLeaveForm.file_name} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, file_name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="medical-certificate.pdf" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Medical Leave'}
                    </button>
                  </form>
                )}

                {selectedLeaveType === 'unpaid' && (
                  <form onSubmit={handleUnpaidLeaveSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-gray-700 mb-2">Start Date</label>
                      <input type="date" value={unpaidLeaveForm.start_date} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, start_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">End Date</label>
                      <input type="date" value={unpaidLeaveForm.end_date} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, end_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Document Description (Memo)</label>
                      <input type="text" value={unpaidLeaveForm.document_description} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, document_description: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Describe the memo or supporting document" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">File Name</label>
                      <input type="text" value={unpaidLeaveForm.file_name} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, file_name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="memo.pdf" />
                    </div>
                    <p className="text-sm text-gray-600">Note: Maximum 30 days per year. Leave will not be paid.</p>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Unpaid Leave'}
                    </button>
                  </form>
                )}

                {selectedLeaveType === 'compensation' && (
                  <form onSubmit={handleCompensationLeaveSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-gray-700 mb-2">Compensation Date (Day Off)</label>
                      <input type="date" value={compensationLeaveForm.compensation_date} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, compensation_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Original Workday Date</label>
                      <input type="date" value={compensationLeaveForm.date_of_original_workday} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, date_of_original_workday: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                      <p className="text-sm text-gray-600 mt-1">The date you worked extra/overtime</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Reason</label>
                      <textarea value={compensationLeaveForm.reason} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, reason: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Explain why you worked on the original date" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Replacement Employee ID</label>
                      <input type="number" placeholder="Enter replacement employee ID" value={compensationLeaveForm.replacement_emp} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, replacement_emp: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Compensation Leave'}
                    </button>
                  </form>
                )}
                  </div>
                </div>
              </div>
            )}

            {!selectedLeaveType && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Leave Status (Current Month)
              </h3>
              <button
                onClick={async () => {
                  setLoading(true);
                  setLeaveStatusLoaded(false);
                  try {
                    const result = await api.getLeaveStatus(user.employee_ID);
                    setLeaveStatus(result.data || []);
                    setLeaveStatusLoaded(true);
                    toast.success('Leave status loaded');
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Load Leave Status
              </button>
              {leaveStatusLoaded && (leaveStatus.length === 0 ? (
                <p className="text-gray-600">No leave requests found for this month.</p>
              ) : (
                <div className="space-y-3">
                  {leaveStatus.map((leave) => (
                    <div key={leave.request_ID} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 font-medium">Request ID: #{leave.request_ID}</p>
                          <p className="text-gray-600 text-sm mt-1">Submitted: {new Date(leave.date_of_request).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            leave.final_approval_status === 'Approved' ? 'bg-green-100 text-green-700' :
                            leave.final_approval_status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {leave.final_approval_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Approve Leaves Section - Only for Dean/Vice Dean/President */}
        {activeSection === 'approvals' && isApprover && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Approvals
            </h3>
            <p className="text-gray-600 text-sm mb-4">As a {userRole}, approve or reject leave requests</p>
            
            {/* Filters and Sort */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">Filter by Type</label>
                <select
                  value={leaveFilter}
                  onChange={(e) => setLeaveFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="annual">Annual Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">Sort by</label>
                <select
                  value={leaveSortBy}
                  onChange={(e) => setLeaveSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="date">Date</option>
                  <option value="type">Leave Type</option>
                  <option value="employee">Employee Name</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const result = await api.getPendingApprovals(user.employee_ID);
                      setPendingApprovals(result.data || []);
                      toast.success('Approvals loaded');
                    } catch (error: any) {
                      toast.error(error.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors h-fit"
                >
                  Load Approvals
                </button>
              </div>
            </div>

            {pendingApprovals.length === 0 ? (
              <p className="text-gray-600">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {getFilteredAndSortedApprovals().map((approval) => (
                  <div key={`${approval.Emp1_ID}-${approval.Leave_ID}`} className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                            approval.leave?.type === 'annual' ? 'bg-green-100 text-green-700' :
                            approval.leave?.type === 'accidental' ? 'bg-yellow-100 text-yellow-700' :
                            approval.leave?.type === 'medical' ? 'bg-red-100 text-red-700' :
                            approval.leave?.type === 'unpaid' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {approval.leaveType}
                          </span>
                          <span className="text-gray-600 text-sm">Request #{approval.Leave_ID}</span>
                        </div>
                        <p className="text-gray-900 mb-1">Requested by: {approval.requestor}</p>
                        <p className="text-gray-600 text-sm">Period: {approval.leave.start_date} to {approval.leave.end_date} ({approval.leave.num_days} days)</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const result = await api.approveLeave(user.employee_ID, approval.Leave_ID, 'approved');
                              toast.success(result.message);
                              const refreshResult = await api.getPendingApprovals(user.employee_ID);
                              setPendingApprovals(refreshResult.data || []);
                            } catch (error: any) {
                              toast.error(error.message);
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const result = await api.approveLeave(user.employee_ID, approval.Leave_ID, 'rejected');
                              toast.success(result.message);
                              const refreshResult = await api.getPendingApprovals(user.employee_ID);
                              setPendingApprovals(refreshResult.data || []);
                            } catch (error: any) {
                              toast.error(error.message);
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Performance Section */}
        {activeSection === 'performance' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              My Performance
            </h3>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Semester (e.g., W24)"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={async () => {
                  if (!semester) {
                    toast.error('Please enter a semester');
                    return;
                  }
                  setLoading(true);
                  setPerformanceError('');
                  try {
                    const result = await api.getPerformance(user.employee_ID, semester);
                    console.log('Performance result:', result);
                    setPerformanceData(result.data || []);
                    if (result.data && result.data.length === 0) {
                      setPerformanceError('No performance found for the given semester');
                    }
                  } catch (error: any) {
                    setPerformanceError(error.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors"
              >
                Load Performance
              </button>
            </div>
            {performanceError && (
              <p className="text-red-600 text-sm mb-4">{performanceError}</p>
            )}
            {performanceData.length === 0 ? (
              <p className="text-gray-600"></p>
            ) : (
              <div className="space-y-4">
                {performanceData.map((perf, idx) => (
                  <div key={perf.performance_ID || idx} className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Performance ID</p>
                        <p className="text-gray-900 text-lg">#{perf.performance_ID}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Semester</p>
                        <p className="text-gray-900 text-lg">{perf.semester}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-1">Comments</p>
                      <p className="text-gray-900">{perf.comments || 'No comments'}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-yellow-200">
                      <div>
                        <p className="text-gray-600 text-sm">Rating</p>
                        <div className="flex items-center gap-1 mt-1">
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
                          <span className="ml-2 text-gray-700 text-lg font-semibold">{perf.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payrolls Section */}
        {activeSection === 'payrolls' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              My Payroll History
            </h3>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const result = await api.getLastMonthPayroll(user.employee_ID);
                  setPayroll(result.data || []);
                  toast.success('Payroll records loaded');
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Load Last Month's Payroll
            </button>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : payroll.length === 0 ? (
              <p className="text-gray-600"></p>
            ) : (
              <div className="space-y-4">
                {payroll.map((pay) => (
                  <div key={pay.ID} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Payroll ID</p>
                        <p className="text-gray-900 text-lg">#{pay.ID}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Payment Date</p>
                        <p className="text-gray-900 text-lg">{new Date(pay.payment_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Pay Period</p>
                        <p className="text-gray-900">{new Date(pay.from_date).toLocaleDateString()} to {new Date(pay.to_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Bonus Amount</p>
                        <p className="text-green-700 text-lg">+${pay.bonus_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Deductions</p>
                        <p className="text-red-700 text-lg">-${pay.deductions_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Final Salary</p>
                        <p className="text-indigo-700 text-2xl">${pay.final_salary_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                    {pay.comments && (
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        <p className="text-gray-600 text-sm mb-1">Comments</p>
                        <p className="text-gray-900">{pay.comments}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evaluate Section - Only for Deans */}
        {activeSection === 'evaluate' && userRole === 'Dean' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Evaluate Employee (Dean Only - Same Department)
            </h3>
            <p className="text-gray-600 text-sm mb-4">As a Dean, you can only evaluate employees within your department: {user.dept_name}</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                // Check if employee exists and is in same department
                const employeesResult = await api.getEmployees();
                const targetEmployee = employeesResult.data.find((emp: any) => emp.employee_ID === parseInt(evaluationForm.employee_ID));
                
                if (!targetEmployee) {
                  toast.error('Employee not found');
                  setLoading(false);
                  return;
                }
                
                if (targetEmployee.dept_name !== user.dept_name) {
                  toast.error(`You can only evaluate employees in your department (${user.dept_name}). This employee is in ${targetEmployee.dept_name}.`);
                  setLoading(false);
                  return;
                }
                
                const result = await api.submitEvaluation({ evaluator_ID: user.employee_ID, ...evaluationForm, employee_ID: parseInt(evaluationForm.employee_ID), rating: parseInt(evaluationForm.rating) });
                toast.success(result.message);
                setEvaluationForm({ employee_ID: '', rating: '5', comments: '', semester: '' });
              } catch (error: any) {
                toast.error(error.message);
              } finally {
                setLoading(false);
              }
            }} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input type="number" placeholder="Employee ID" value={evaluationForm.employee_ID} onChange={(e) => setEvaluationForm({ ...evaluationForm, employee_ID: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Semester</label>
                <input type="text" placeholder="Semester (e.g., W24)" value={evaluationForm.semester} onChange={(e) => setEvaluationForm({ ...evaluationForm, semester: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <select value={evaluationForm.rating} onChange={(e) => setEvaluationForm({ ...evaluationForm, rating: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Comments</label>
                <textarea value={evaluationForm.comments} onChange={(e) => setEvaluationForm({ ...evaluationForm, comments: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Comments" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50">
                Submit Evaluation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
