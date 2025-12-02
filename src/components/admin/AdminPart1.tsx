import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../utils/api.tsx';

const BACKEND_BASE_URL = 'http://localhost:5000';

export const fetchEmployeesFromBackend = async () => {
  const response = await fetch(`${BACKEND_BASE_URL}/view-employees`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees from backend');
  }
  return response.json();
};

export function AdminPart1() {
  const [activeSection, setActiveSection] = useState<string>('employees');
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesPerDept, setEmployeesPerDept] = useState<any[]>([]);
  const [rejectedMedicals, setRejectedMedicals] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState({
    employee_ID: '',
    check_in_time: '',
    check_out_time: ''
  });
  const [holidayData, setHolidayData] = useState({
    name: '',
    from_date: '',
    to_date: ''
  });
  const [loading, setLoading] = useState(false);


  // all employees view
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployeesFromBackend();
      setEmployees(data);
      toast.success('Employees loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesPerDept = async () => {
    setLoading(true);
    try {
      const result = await api.getEmployeesPerDept();
      setEmployeesPerDept(result.data);
      toast.success('Department statistics loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch department statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedMedicals = async () => {
    setLoading(true);
    try {
      const result = await api.getRejectedMedicals();
      setRejectedMedicals(result.data);
      toast.success('Rejected medical leaves loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch rejected medical leaves');
    } finally {
      setLoading(false);
    }
  };

  const removeResignedDeductions = async () => {
    if (!confirm('Are you sure you want to remove all deductions for resigned employees?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.removeResignedDeductions();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove deductions');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.updateAttendance(parseInt(attendanceData.employee_ID), attendanceData.check_in_time, attendanceData.check_out_time);
      toast.success(result.message);
      setAttendanceData({ employee_ID: '', check_in_time: '', check_out_time: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update attendance');
    } finally {
      setLoading(false);
    }
  };

  const addHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.addHoliday(holidayData.name, holidayData.from_date, holidayData.to_date);
      toast.success(result.message);
      setHolidayData({ name: '', from_date: '', to_date: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add holiday');
    } finally {
      setLoading(false);
    }
  };

  const initiateAttendance = async () => {
    if (!confirm('This will initialize attendance records for all employees for today. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.initiateAttendance();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'employees') {
      fetchEmployees();
    } else if (activeSection === 'dept-stats') {
      fetchEmployeesPerDept();
    } else if (activeSection === 'rejected-medicals') {
      fetchRejectedMedicals();
    }
  }, [activeSection]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveSection('employees')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'employees'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">View Employees</div>
        </button>
        <button
          onClick={() => setActiveSection('dept-stats')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'dept-stats'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Dept Statistics</div>
        </button>
        <button
          onClick={() => setActiveSection('rejected-medicals')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'rejected-medicals'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Rejected Medicals</div>
        </button>
        <button
          onClick={() => setActiveSection('deductions')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'deductions'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Remove Deductions</div>
        </button>
        <button
          onClick={() => setActiveSection('attendance')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'attendance'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Update Attendance</div>
        </button>
        <button
          onClick={() => setActiveSection('holiday')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'holiday'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Add Holiday</div>
        </button>
        <button
          onClick={() => setActiveSection('initiate')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeSection === 'initiate'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-sm">Initiate Attendance</div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeSection === 'employees' && (
          <div>
            <h3 className="text-gray-900 mb-4">All Employee Profiles</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : employees.length === 0 ? (
              <p className="text-gray-600">No employees found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-gray-700">Email</th>
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
                        <td className="py-3 px-4 text-gray-600">{emp.email}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.dept_name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs ${
                            emp.employment_status === 'active' ? 'bg-green-100 text-green-700' :
                            emp.employment_status === 'onleave' ? 'bg-yellow-100 text-yellow-700' :
                            emp.employment_status === 'resigned' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {emp.employment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{emp.type_of_contract}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.years_of_experience} years</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'dept-stats' && (
          <div>
            <h3 className="text-gray-900 mb-4">Employees Per Department</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : employeesPerDept.length === 0 ? (
              <p className="text-gray-600">No data found</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {employeesPerDept.map((dept) => (
                  <div key={dept.dept_name} className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="text-blue-900 mb-2">{dept.dept_name}</h4>
                    <p className="text-blue-700 text-3xl">{dept.Number_of_Employees}</p>
                    <p className="text-blue-600 text-sm mt-1">employees</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'rejected-medicals' && (
          <div>
            <h3 className="text-gray-900 mb-4">Rejected Medical Leaves</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : rejectedMedicals.length === 0 ? (
              <p className="text-gray-600">No rejected medical leaves found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Request ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Employee ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-gray-700">Start Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">End Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">Days</th>
                      <th className="text-left py-3 px-4 text-gray-700">Insurance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedMedicals.map((medical) => (
                      <tr key={medical.request_ID} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{medical.request_ID}</td>
                        <td className="py-3 px-4 text-gray-900">{medical.Emp_ID}</td>
                        <td className="py-3 px-4 text-gray-600">{medical.type}</td>
                        <td className="py-3 px-4 text-gray-600">{medical.start_date}</td>
                        <td className="py-3 px-4 text-gray-600">{medical.end_date}</td>
                        <td className="py-3 px-4 text-gray-600">{medical.num_days}</td>
                        <td className="py-3 px-4 text-gray-600">{medical.insurance_status ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'deductions' && (
          <div>
            <h3 className="text-gray-900 mb-4">Remove Deductions for Resigned Employees</h3>
            <p className="text-gray-600 mb-6">
              This will remove all pending deductions for employees who have resigned from the system.
            </p>
            <button
              onClick={removeResignedDeductions}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Remove Deductions'}
            </button>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div>
            <h3 className="text-gray-900 mb-4">Update Attendance for Current Day</h3>
            <form onSubmit={updateAttendance} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input
                  type="number"
                  value={attendanceData.employee_ID}
                  onChange={(e) => setAttendanceData({ ...attendanceData, employee_ID: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Check-in Time (leave empty for absent)</label>
                <input
                  type="time"
                  value={attendanceData.check_in_time}
                  onChange={(e) => setAttendanceData({ ...attendanceData, check_in_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Check-out Time</label>
                <input
                  type="time"
                  value={attendanceData.check_out_time}
                  onChange={(e) => setAttendanceData({ ...attendanceData, check_out_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Attendance'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'holiday' && (
          <div>
            <h3 className="text-gray-900 mb-4">Add Official Holiday</h3>
            <form onSubmit={addHoliday} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Holiday Name</label>
                <input
                  type="text"
                  value={holidayData.name}
                  onChange={(e) => setHolidayData({ ...holidayData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={holidayData.from_date}
                  onChange={(e) => setHolidayData({ ...holidayData, from_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={holidayData.to_date}
                  onChange={(e) => setHolidayData({ ...holidayData, to_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Holiday'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'initiate' && (
          <div>
            <h3 className="text-gray-900 mb-4">Initiate Attendance for Current Day</h3>
            <p className="text-gray-600 mb-6">
              This will create attendance records for all employees for today's date with default absent status.
            </p>
            <button
              onClick={initiateAttendance}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Initiate Attendance'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
