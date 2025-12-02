/**
 * Example usage of the API in React components
 * Import these patterns into your actual components
 */

import { employeeAPI, leaveAPI, hrAPI, adminAPI } from './apiClient';
import { useState, useEffect } from 'react';

// ==================== EMPLOYEE EXAMPLES ====================

export const EmployeeLoginExample = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await employeeAPI.login(parseInt(employeeId), password);
      if (response.success) {
        console.log('Login successful:', response.data);
        // Store user data in state/context
        localStorage.setItem('employee', JSON.stringify(response.data));
        // Redirect to dashboard
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="number" 
        value={employeeId} 
        onChange={(e) => setEmployeeId(e.target.value)}
        placeholder="Employee ID"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export const EmployeeProfileExample = () => {
  const [profile, setProfile] = useState<any>(null);
  const employeeId = 1; // Get from logged-in user

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await employeeAPI.getProfile(employeeId);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [employeeId]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{profile.first_name} {profile.last_name}</h2>
      <p>Email: {profile.email}</p>
      <p>Department: {profile.dept_name}</p>
      <p>Annual Balance: {profile.annual_balance} days</p>
      <p>Accidental Balance: {profile.accidental_balance} days</p>
    </div>
  );
};

export const EmployeeAttendanceExample = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const employeeId = 1;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await employeeAPI.getAttendance(employeeId);
        setAttendance(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Duration (min)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {attendance.map((record) => (
          <tr key={record.attendance_ID}>
            <td>{new Date(record.date).toLocaleDateString()}</td>
            <td>{record.check_in_time}</td>
            <td>{record.check_out_time}</td>
            <td>{record.total_duration}</td>
            <td>{record.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ==================== LEAVE EXAMPLES ====================

export const SubmitAnnualLeaveExample = () => {
  const [formData, setFormData] = useState({
    employee_id: 1,
    replacement_emp: 2,
    start_date: '',
    end_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await leaveAPI.submitAnnual(formData);
      alert(response.message);
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('Failed to submit leave request');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        value={formData.replacement_emp}
        onChange={(e) => setFormData({...formData, replacement_emp: parseInt(e.target.value)})}
        placeholder="Replacement Employee ID"
      />
      <input 
        type="date" 
        value={formData.start_date}
        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
      />
      <input 
        type="date" 
        value={formData.end_date}
        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
      />
      <button type="submit">Submit Annual Leave</button>
    </form>
  );
};

export const LeaveStatusExample = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const employeeId = 1;

  useEffect(() => {
    const fetchLeaveStatus = async () => {
      try {
        const response = await leaveAPI.getStatus(employeeId);
        setLeaves(response.data);
      } catch (error) {
        console.error('Error fetching leave status:', error);
      }
    };
    fetchLeaveStatus();
  }, []);

  return (
    <div>
      <h3>My Leave Requests</h3>
      {leaves.map((leave) => (
        <div key={leave.request_ID}>
          <p>Request ID: {leave.request_ID}</p>
          <p>Date: {new Date(leave.date_of_request).toLocaleDateString()}</p>
          <p>Status: {leave.final_approval_status}</p>
        </div>
      ))}
    </div>
  );
};

// ==================== HR EXAMPLES ====================

export const HRLoginExample = () => {
  const [credentials, setCredentials] = useState({
    employee_id: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await hrAPI.login(
        parseInt(credentials.employee_id), 
        credentials.password
      );
      if (response.success) {
        console.log('HR Login successful:', response.data);
        localStorage.setItem('hr_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('HR login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="number" 
        value={credentials.employee_id}
        onChange={(e) => setCredentials({...credentials, employee_id: e.target.value})}
        placeholder="HR ID"
      />
      <input 
        type="password" 
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="Password"
      />
      <button type="submit">HR Login</button>
    </form>
  );
};

export const HRApproveLeaveExample = () => {
  const [requestId, setRequestId] = useState('');
  const hrId = 5; // Get from logged-in HR user

  const handleApprove = async () => {
    try {
      const response = await hrAPI.approveAnnualAccidental(
        parseInt(requestId), 
        hrId
      );
      alert(response.message);
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  return (
    <div>
      <input 
        type="number" 
        value={requestId}
        onChange={(e) => setRequestId(e.target.value)}
        placeholder="Leave Request ID"
      />
      <button onClick={handleApprove}>Approve Leave</button>
    </div>
  );
};

export const HRUpdateAttendanceExample = () => {
  const handleUpdateAttendance = async (
    employeeId: number,
    checkIn: string,
    checkOut: string
  ) => {
    try {
      const response = await hrAPI.updateAttendance(employeeId, checkIn, checkOut);
      alert(response.message);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <button onClick={() => handleUpdateAttendance(1, '09:00:00', '17:00:00')}>
      Update Attendance
    </button>
  );
};

export const HRAddPayrollExample = () => {
  const handleAddPayroll = async () => {
    try {
      const response = await hrAPI.addPayroll(
        1, // employee_id
        '2024-12-01', // from_date
        '2024-12-31'  // to_date
      );
      alert(response.message);
    } catch (error) {
      console.error('Error adding payroll:', error);
    }
  };

  return (
    <button onClick={handleAddPayroll}>Add Payroll for Employee</button>
  );
};

// ==================== ADMIN EXAMPLES ====================

export const AdminDepartmentStatsExample = () => {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDepartmentStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching department stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h3>Department Statistics</h3>
      {stats.map((dept) => (
        <div key={dept.Department}>
          <p>{dept.Department}: {dept['Number of Employees']} employees</p>
        </div>
      ))}
    </div>
  );
};

export const AdminAddDepartmentExample = () => {
  const [deptData, setDeptData] = useState({
    name: '',
    building_location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminAPI.addDepartment(
        deptData.name,
        deptData.building_location
      );
      alert(response.message);
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={deptData.name}
        onChange={(e) => setDeptData({...deptData, name: e.target.value})}
        placeholder="Department Name"
      />
      <input 
        type="text" 
        value={deptData.building_location}
        onChange={(e) => setDeptData({...deptData, building_location: e.target.value})}
        placeholder="Building Location"
      />
      <button type="submit">Add Department</button>
    </form>
  );
};

export const AdminAddHolidayExample = () => {
  const handleAddHoliday = async () => {
    try {
      const response = await adminAPI.addHoliday(
        'New Year',
        '2025-01-01',
        '2025-01-01'
      );
      alert(response.message);
    } catch (error) {
      console.error('Error adding holiday:', error);
    }
  };

  return (
    <button onClick={handleAddHoliday}>Add Holiday</button>
  );
};
