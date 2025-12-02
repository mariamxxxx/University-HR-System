import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../utils/api.tsx';

export function AdminPart2() {
  const [activeSection, setActiveSection] = useState<string>('yesterday-attendance');
  const [yesterdayAttendance, setYesterdayAttendance] = useState<any[]>([]);
  const [winterPerformance, setWinterPerformance] = useState<any[]>([]);
  const [employeeIdForDayOff, setEmployeeIdForDayOff] = useState('');
  const [employeeIdForLeaves, setEmployeeIdForLeaves] = useState('');
  const [employeeIdForStatus, setEmployeeIdForStatus] = useState('');
  const [replacementData, setReplacementData] = useState({
    Emp1_ID: '',
    Emp2_ID: '',
    from_date: '',
    to_date: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchYesterdayAttendance = async () => {
    setLoading(true);
    try {
      const result = await api.getYesterdayAttendance();
      setYesterdayAttendance(result.data);
      toast.success('Yesterday\'s attendance loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch yesterday\'s attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchWinterPerformance = async () => {
    setLoading(true);
    try {
      const result = await api.getWinterPerformance();
      setWinterPerformance(result.data);
      toast.success('Winter performance data loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch winter performance');
    } finally {
      setLoading(false);
    }
  };

  const removeHolidayAttendance = async () => {
    if (!confirm('Are you sure you want to remove all attendance records during official holidays?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.removeHolidayAttendance();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove holiday attendance');
    } finally {
      setLoading(false);
    }
  };

  const removeDayOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.removeDayOff(parseInt(employeeIdForDayOff));
      toast.success(result.message);
      setEmployeeIdForDayOff('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove day-off attendance');
    } finally {
      setLoading(false);
    }
  };

  const removeApprovedLeaves = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.removeApprovedLeaves(parseInt(employeeIdForLeaves));
      toast.success(result.message);
      setEmployeeIdForLeaves('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove approved leaves');
    } finally {
      setLoading(false);
    }
  };

  const replaceEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.replaceEmployee(parseInt(replacementData.Emp1_ID), parseInt(replacementData.Emp2_ID), replacementData.from_date, replacementData.to_date);
      toast.success(result.message);
      setReplacementData({ Emp1_ID: '', Emp2_ID: '', from_date: '', to_date: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to record employee replacement');
    } finally {
      setLoading(false);
    }
  };

  const updateEmploymentStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.updateEmploymentStatus(parseInt(employeeIdForStatus));
      toast.success(result.message);
      setEmployeeIdForStatus('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update employment status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'yesterday-attendance') {
      fetchYesterdayAttendance();
    } else if (activeSection === 'winter-performance') {
      fetchWinterPerformance();
    }
  }, [activeSection]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveSection('yesterday-attendance')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'yesterday-attendance'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Yesterday's Attendance</div>
        </button>
        <button
          onClick={() => setActiveSection('winter-performance')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'winter-performance'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Winter Performance</div>
        </button>
        <button
          onClick={() => setActiveSection('remove-holiday')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'remove-holiday'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Remove Holiday Att.</div>
        </button>
        <button
          onClick={() => setActiveSection('remove-dayoff')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'remove-dayoff'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Remove Day-off</div>
        </button>
        <button
          onClick={() => setActiveSection('remove-leaves')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'remove-leaves'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Remove Approved Leaves</div>
        </button>
        <button
          onClick={() => setActiveSection('replace')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'replace'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Replace Employee</div>
        </button>
        <button
          onClick={() => setActiveSection('update-status')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'update-status'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Update Status</div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeSection === 'yesterday-attendance' && (
          <div>
            <h3 className="text-gray-900 mb-4">Yesterday's Attendance Records</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : yesterdayAttendance.length === 0 ? (
              <p className="text-gray-600">No attendance records found for yesterday</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">Check-in</th>
                      <th className="text-left py-3 px-4 text-gray-700">Check-out</th>
                      <th className="text-left py-3 px-4 text-gray-700">Duration (mins)</th>
                      <th className="text-left py-3 px-4 text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yesterdayAttendance.map((att, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{att['Employee Name']}</td>
                        <td className="py-3 px-4 text-gray-600">{att.date}</td>
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

        {activeSection === 'winter-performance' && (
          <div>
            <h3 className="text-gray-900 mb-4">Performance - Winter Semesters</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : winterPerformance.length === 0 ? (
              <p className="text-gray-600">No winter performance records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 text-gray-700">Semester</th>
                      <th className="text-left py-3 px-4 text-gray-700">Rating</th>
                      <th className="text-left py-3 px-4 text-gray-700">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winterPerformance.map((perf, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{perf['Employee Name']}</td>
                        <td className="py-3 px-4 text-gray-600">{perf.semester}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < perf.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-gray-600">{perf.rating}/5</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{perf.comments || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'remove-holiday' && (
          <div>
            <h3 className="text-gray-900 mb-4">Remove Attendance During Official Holidays</h3>
            <p className="text-gray-600 mb-6">
              This will remove all attendance records that fall within official holiday periods.
            </p>
            <button
              onClick={removeHolidayAttendance}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Remove Holiday Attendance'}
            </button>
          </div>
        )}

        {activeSection === 'remove-dayoff' && (
          <div>
            <h3 className="text-gray-900 mb-4">Remove Unattended Day-off</h3>
            <p className="text-gray-600 mb-4">
              Remove absent attendance records for an employee's official day-off in the current month.
            </p>
            <form onSubmit={removeDayOff} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="number"
                  value={employeeIdForDayOff}
                  onChange={(e) => setEmployeeIdForDayOff(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Remove Day-off Records'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'remove-leaves' && (
          <div>
            <h3 className="text-gray-900 mb-4">Remove Approved Leaves from Attendance</h3>
            <p className="text-gray-600 mb-4">
              Remove attendance records for an employee during their approved leave periods.
            </p>
            <form onSubmit={removeApprovedLeaves} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="number"
                  value={employeeIdForLeaves}
                  onChange={(e) => setEmployeeIdForLeaves(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Remove Approved Leave Records'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'replace' && (
          <div>
            <h3 className="text-gray-900 mb-4">Record Employee Replacement</h3>
            <form onSubmit={replaceEmployee} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Employee 1 ID (Being Replaced)</label>
                <input
                  type="number"
                  value={replacementData.Emp1_ID}
                  onChange={(e) => setReplacementData({ ...replacementData, Emp1_ID: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Employee 2 ID (Replacement)</label>
                <input
                  type="number"
                  value={replacementData.Emp2_ID}
                  onChange={(e) => setReplacementData({ ...replacementData, Emp2_ID: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={replacementData.from_date}
                  onChange={(e) => setReplacementData({ ...replacementData, from_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={replacementData.to_date}
                  onChange={(e) => setReplacementData({ ...replacementData, to_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Record Replacement'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'update-status' && (
          <div>
            <h3 className="text-gray-900 mb-4">Update Employment Status Based on Leave</h3>
            <p className="text-gray-600 mb-4">
              Automatically update employee status to 'onleave' or 'active' based on current leave status.
            </p>
            <form onSubmit={updateEmploymentStatus} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="number"
                  value={employeeIdForStatus}
                  onChange={(e) => setEmployeeIdForStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Employment Status'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
