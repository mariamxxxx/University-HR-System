import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mockAPI } from '../utils/mockData.tsx';

interface HRDashboardProps {
  user: any;
  onLogout: () => void;
}

export function HRDashboard({ user, onLogout }: HRDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeIdForDeduction, setEmployeeIdForDeduction] = useState('');
  const [payrollForm, setPayrollForm] = useState({ employee_ID: '', from_date: '', to_date: '' });

  const sections = [
    { id: 'overview', name: 'Overview', icon: null },
    { id: 'leaves', name: 'Leave Approvals', icon: null },
    { id: 'deductions', name: 'Deductions', icon: null },
    { id: 'payroll', name: 'Payroll', icon: null }
  ];

  useEffect(() => {
    if (activeSection === 'overview' || activeSection === 'leaves') {
      loadPendingLeaves();
    }
  }, [activeSection]);

  const loadPendingLeaves = async () => {
    setLoading(true);
    try {
      const result = await mockAPI.getPendingLeaves();
      setPendingLeaves(result.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number, leaveType: string) => {
    setLoading(true);
    try {
      const result = await mockAPI.hrApproveLeave(requestId, user.employee_ID, leaveType);
      toast.success(result.message);
      loadPendingLeaves();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-gray-900 text-xl">HR Portal</h1>
                <p className="text-gray-600 text-sm">{user.first_name} {user.last_name} • {user.dept_name}</p>
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
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
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
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg opacity-90">Pending Leaves</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl mb-1">{pendingLeaves.length}</p>
                <p className="text-sm opacity-80">awaiting review</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg opacity-90">Annual Leaves</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl mb-1">{pendingLeaves.filter(l => l.leaveType === 'Annual').length}</p>
                <p className="text-sm opacity-80">pending</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg opacity-90">Other Leaves</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl mb-1">{pendingLeaves.filter(l => l.leaveType !== 'Annual').length}</p>
                <p className="text-sm opacity-80">pending</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveSection('leaves')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all text-left"
                >
                  <p className="text-sm opacity-90 mb-1">Review</p>
                  <p className="text-lg">Leave Requests</p>
                </button>
                <button
                  onClick={() => setActiveSection('payroll')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all text-left"
                >
                  <p className="text-sm opacity-90 mb-1">Generate</p>
                  <p className="text-lg">Monthly Payroll</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leave Approvals Section */}
        {activeSection === 'leaves' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending Leave Requests
              </h3>
              <button
                onClick={loadPendingLeaves}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : pendingLeaves.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">No pending leave requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div key={leave.request_ID} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                            leave.leaveType === 'Annual' ? 'bg-blue-100 text-blue-700' :
                            leave.leaveType === 'Accidental' ? 'bg-yellow-100 text-yellow-700' :
                            leave.leaveType === 'Medical' ? 'bg-red-100 text-red-700' :
                            leave.leaveType === 'Unpaid' ? 'bg-gray-100 text-gray-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {leave.leaveType} Leave
                          </span>
                          <span className="text-gray-600">Request #{leave.request_ID}</span>
                        </div>
                        <p className="text-gray-900 mb-2">Employee: {leave.employee} (ID: {leave.employee_ID})</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{leave.start_date} → {leave.end_date}</span>
                          <span>{leave.num_days} days</span>
                          <span>Submitted: {leave.date_of_request}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApprove(leave.request_ID, leave.leaveType)}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        Process Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deductions Section */}
        {activeSection === 'deductions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Add Deductions
              </h3>
              <div className="max-w-md mb-6">
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="number"
                  value={employeeIdForDeduction}
                  onChange={(e) => setEmployeeIdForDeduction(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-6">
                  <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Missing Hours
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">Deduct for attendance with less than 8 hours</p>
                  <button
                    onClick={async () => {
                      if (!employeeIdForDeduction) {
                        toast.error('Please enter employee ID');
                        return;
                      }
                      setLoading(true);
                      try {
                        const result = await mockAPI.addDeductionHours(parseInt(employeeIdForDeduction));
                        toast.success(result.message);
                      } catch (error: any) {
                        toast.error(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !employeeIdForDeduction}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                  >
                    Add Deduction
                  </button>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
                  <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Missing Days
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">Deduct for absent days in current month</p>
                  <button
                    onClick={async () => {
                      if (!employeeIdForDeduction) {
                        toast.error('Please enter employee ID');
                        return;
                      }
                      setLoading(true);
                      try {
                        const result = await mockAPI.addDeductionDays(parseInt(employeeIdForDeduction));
                        toast.success(result.message);
                      } catch (error: any) {
                        toast.error(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !employeeIdForDeduction}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                  >
                    Add Deduction
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Unpaid Leave
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">Deduct for approved unpaid leave days</p>
                  <button
                    onClick={async () => {
                      if (!employeeIdForDeduction) {
                        toast.error('Please enter employee ID');
                        return;
                      }
                      setLoading(true);
                      try {
                        const result = await mockAPI.addDeductionUnpaid(parseInt(employeeIdForDeduction));
                        toast.success(result.message);
                      } catch (error: any) {
                        toast.error(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !employeeIdForDeduction}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all disabled:opacity-50"
                  >
                    Add Deduction
                  </button>
                </div>
              </div>
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
              Generate Monthly Payroll
            </h3>
            <p className="text-gray-600 mb-6">Calculate final salary including base salary, bonuses, and deductions</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const result = await mockAPI.generatePayroll(parseInt(payrollForm.employee_ID), payrollForm.from_date, payrollForm.to_date);
                toast.success(result.message);
                setPayrollForm({ employee_ID: '', from_date: '', to_date: '' });
              } catch (error: any) {
                toast.error(error.message);
              } finally {
                setLoading(false);
              }
            }} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="number"
                  value={payrollForm.employee_ID}
                  onChange={(e) => setPayrollForm({ ...payrollForm, employee_ID: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={payrollForm.from_date}
                    onChange={(e) => setPayrollForm({ ...payrollForm, from_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={payrollForm.to_date}
                    onChange={(e) => setPayrollForm({ ...payrollForm, to_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 text-lg"
              >
                {loading ? 'Generating...' : 'Generate Payroll'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}