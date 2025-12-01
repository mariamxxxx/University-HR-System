import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mockAPI } from '../../utils/mockData.tsx';

interface EmployeePart1Props {
  userId: number;
}

export function EmployeePart1({ userId }: EmployeePart1Props) {
  const [activeSection, setActiveSection] = useState('performance');
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [deductions, setDeductions] = useState<any[]>([]);
  const [leaveStatus, setLeaveStatus] = useState<any[]>([]);
  const [semester, setSemester] = useState('');
  const [deductionMonth, setDeductionMonth] = useState('');
  const [annualLeaveForm, setAnnualLeaveForm] = useState({
    start_date: '',
    end_date: '',
    replacement_emp: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchPerformance = async () => {
    if (!semester) {
      toast.error('Please enter a semester');
      return;
    }
    setLoading(true);
    try {
      const result = await mockAPI.getPerformance(userId, semester);
      setPerformanceData(result.data);
      toast.success('Performance data loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch performance');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const result = await mockAPI.getAttendance(userId);
      setAttendance(result.data ?? []);
      toast.success('Attendance records loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const result = await mockAPI.getLastMonthPayroll(userId);
      setPayroll(result.data);
      toast.success('Payroll data loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch payroll');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeductions = async () => {
    if (!deductionMonth) {
      toast.error('Please enter a month (1-12)');
      return;
    }
    setLoading(true);
    try {
      const result = await mockAPI.getDeductions(userId, parseInt(deductionMonth));
      setDeductions(result.data);
      toast.success('Deductions loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch deductions');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveStatus = async () => {
    setLoading(true);
    try {
      const result = await mockAPI.getLeaveStatus(userId);
      setLeaveStatus(result.data);
      toast.success('Leave status loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leave status');
    } finally {
      setLoading(false);
    }
  };

  const submitAnnualLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await mockAPI.submitAnnualLeave(userId, annualLeaveForm.start_date, annualLeaveForm.end_date, annualLeaveForm.replacement_emp ? parseInt(annualLeaveForm.replacement_emp) : null);
      toast.success(result.message);
      setAnnualLeaveForm({ start_date: '', end_date: '', replacement_emp: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit annual leave');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'attendance') {
      fetchAttendance();
    } else if (activeSection === 'payroll') {
      fetchPayroll();
    } else if (activeSection === 'leave-status') {
      fetchLeaveStatus();
    }
  }, [activeSection]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveSection('performance')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'performance'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">My Performance</div>
        </button>
        <button
          onClick={() => setActiveSection('attendance')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'attendance'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">My Attendance</div>
        </button>
        <button
          onClick={() => setActiveSection('payroll')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'payroll'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Last Month Payroll</div>
        </button>
        <button
          onClick={() => setActiveSection('deductions')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'deductions'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Deductions</div>
        </button>
        <button
          onClick={() => setActiveSection('annual-leave')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'annual-leave'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Apply Annual Leave</div>
        </button>
        <button
          onClick={() => setActiveSection('leave-status')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'leave-status'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Leave Status</div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeSection === 'performance' && (
          <div>
            <h3 className="text-gray-900 mb-4">My Performance</h3>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter semester (e.g., W24)"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={fetchPerformance}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Fetch Performance'}
              </button>
            </div>
            {performanceData.length === 0 ? (
              <p className="text-gray-600">No performance records found</p>
            ) : (
              <div className="space-y-4">
                {performanceData.map((perf, idx) => (
                  <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-900">Semester: {perf.semester}</p>
                        <p className="text-green-700 mt-1">{perf.comments || 'No comments'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < perf.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-green-700">{perf.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'attendance' && (
          <div>
            <h3 className="text-gray-900 mb-4">My Attendance (Current Month)</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : attendance.length === 0 ? (
              <p className="text-gray-600">No attendance records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">Check-in</th>
                      <th className="text-left py-3 px-4 text-gray-700">Check-out</th>
                      <th className="text-left py-3 px-4 text-gray-700">Duration (mins)</th>
                      <th className="text-left py-3 px-4 text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((att) => (
                      <tr key={att.attendance_ID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{att.date}</td>
                        <td className="py-3 px-4 text-gray-600">{att.check_in_time || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{att.check_out_time || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{att.total_duration || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs ${
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
        )}

        {activeSection === 'payroll' && (
          <div>
            <h3 className="text-gray-900 mb-4">Last Month's Payroll</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : payroll.length === 0 ? (
              <p className="text-gray-600">No payroll records found for last month</p>
            ) : (
              <div className="space-y-4">
                {payroll.map((pay) => (
                  <div key={pay.ID} className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Payment Date</p>
                        <p className="text-gray-900">{pay.payment_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Period</p>
                        <p className="text-gray-900">{pay.from_date} to {pay.to_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Bonus Amount</p>
                        <p className="text-green-700">${pay.bonus_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Deductions</p>
                        <p className="text-red-700">-${pay.deductions_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 text-sm">Final Salary</p>
                        <p className="text-gray-900 text-2xl">${pay.final_salary_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      {pay.comments && (
                        <div className="md:col-span-2">
                          <p className="text-gray-600 text-sm">Comments</p>
                          <p className="text-gray-700">{pay.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'deductions' && (
          <div>
            <h3 className="text-gray-900 mb-4">Attendance Deductions</h3>
            <div className="flex gap-4 mb-6">
              <input
                type="number"
                min="1"
                max="12"
                placeholder="Enter month (1-12)"
                value={deductionMonth}
                onChange={(e) => setDeductionMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={fetchDeductions}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Fetch Deductions'}
              </button>
            </div>
            {deductions.length === 0 ? (
              <p className="text-gray-600">No deductions found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deductions.map((ded) => (
                      <tr key={ded.deduction_ID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{ded.date}</td>
                        <td className="py-3 px-4 text-red-700">-${ded.amount?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 px-4 text-gray-600">{ded.type}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs ${
                            ded.status === 'finalized' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {ded.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'annual-leave' && (
          <div>
            <h3 className="text-gray-900 mb-4">Apply for Annual Leave</h3>
            <form onSubmit={submitAnnualLeave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={annualLeaveForm.start_date}
                  onChange={(e) => setAnnualLeaveForm({ ...annualLeaveForm, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={annualLeaveForm.end_date}
                  onChange={(e) => setAnnualLeaveForm({ ...annualLeaveForm, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Replacement Employee ID (required)</label>
                <input
                  type="number"
                  value={annualLeaveForm.replacement_emp}
                  onChange={(e) => setAnnualLeaveForm({ ...annualLeaveForm, replacement_emp: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Annual Leave'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'leave-status' && (
          <div>
            <h3 className="text-gray-900 mb-4">Leave Status (Current Month)</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : leaveStatus.length === 0 ? (
              <p className="text-gray-600">No leave requests found for this month</p>
            ) : (
              <div className="space-y-3">
                {leaveStatus.map((leave) => (
                  <div key={leave.request_id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Request ID: {leave.request_id}</p>
                        <p className="text-gray-600 text-sm mt-1">Requested on: {leave.date_of_request}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
