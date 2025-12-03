import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { UnifiedLogin } from './components/UnifiedLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { HRDashboard } from './components/HRDashboard';
import { clearStoredEmployeeId } from './utils/api';

export default function App() {
  const [view, setView] = useState<'login' | 'admin-dashboard' | 'employee-dashboard' | 'hr-dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (user: any, userType: 'admin' | 'employee' | 'hr') => {
    setCurrentUser(user);
    if (userType === 'admin') {
      setView('admin-dashboard');
    } else if (userType === 'employee') {
      setView('employee-dashboard');
    } else {
      setView('hr-dashboard');
    }
  };

  const handleLogout = () => {
    clearStoredEmployeeId(); // Clear stored employee ID on logout
    setCurrentUser(null);
    setView('login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {view === 'login' && (
        <UnifiedLogin onLogin={handleLogin} />
      )}

      {view === 'admin-dashboard' && currentUser && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {view === 'employee-dashboard' && currentUser && (
        <EmployeeDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {view === 'hr-dashboard' && currentUser && (
        <HRDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
