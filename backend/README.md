# University HR Management System - Backend API

## 📍 Database Setup

Your SQL Server database schema is already in: `backend/database/schema.sql`

---

## 🚀 Setup Steps

### 1. Configure Database Connection

Create a `.env` file in the **root directory** (copy from `.env.example`):

```env
DB_HOST=localhost
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=University_HR_ManagementSystem
DB_PORT=1433
PORT=5000
NODE_ENV=development
```

### 2. Start SQL Server

Make sure your SQL Server instance is running and accessible.

### 3. Initialize Database (if needed)

If you haven't already run your SQL file, you can execute it manually in SQL Server Management Studio (SSMS) or use:

```powershell
sqlcmd -S localhost -U sa -P your_password -i backend\database\schema.sql
```

### 4. Start the Backend Server

```bash
npm run server
```

The server will run on `http://localhost:5000`

### 5. Start the Frontend (in a new terminal)

```bash
npm run dev
```

The React app will run on `http://localhost:5173`

---

## 📡 API Endpoints

### **Employee Endpoints** (`/api/employees`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Employee login |
| GET | `/:id/profile` | Get employee profile |
| GET | `/:id/performance?period=W24` | Get performance (semester) |
| GET | `/:id/attendance` | Get current month attendance |
| GET | `/:id/payroll` | Get last month payroll |
| GET | `/:id/deductions?month=12` | Get deductions |

### **Leave Endpoints** (`/api/leaves`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/annual` | Submit annual leave |
| POST | `/accidental` | Submit accidental leave |
| POST | `/medical` | Submit medical leave |
| POST | `/unpaid` | Submit unpaid leave |
| POST | `/compensation` | Submit compensation leave |
| GET | `/status/:employee_id` | Get leave status |
| GET | `/check-onleave?employee_id=1&from_date=2024-01-01&to_date=2024-01-05` | Check if on leave |

### **HR Endpoints** (`/api/hr`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | HR login |
| POST | `/approve/annual-accidental` | Approve annual/accidental |
| POST | `/approve/unpaid` | Approve unpaid leave |
| POST | `/approve/compensation` | Approve compensation |
| POST | `/payroll/add` | Add payroll |
| POST | `/deduction/hours` | Calculate hour deductions |
| POST | `/deduction/days` | Calculate day deductions |
| POST | `/deduction/unpaid` | Calculate unpaid deductions |
| POST | `/attendance/update` | Update attendance |
| POST | `/evaluation` | Add performance evaluation |
| GET | `/employees` | Get all employees |
| GET | `/performance` | Get all performance |
| GET | `/attendance` | Get all attendance (yesterday) |

### **Admin Endpoints** (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/approve/annual` | Upperboard approve annual |
| POST | `/approve/unpaid` | Upperboard approve unpaid |
| GET | `/departments` | Get all departments |
| GET | `/roles` | Get all roles |
| GET | `/departments/stats` | Get department stats |
| POST | `/departments` | Add new department |
| POST | `/roles` | Add new role |
| POST | `/holidays` | Add holiday |
| POST | `/replace-employee` | Replace employee |

---

## 📂 Using API in React Components

### Example: Employee Login

```typescript
import { employeeAPI } from '../utils/apiClient';

const handleLogin = async () => {
  try {
    const response = await employeeAPI.login(12345, 'password123');
    console.log('User data:', response.data);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Example: Submit Annual Leave

```typescript
import { leaveAPI } from '../utils/apiClient';

const submitLeave = async () => {
  try {
    const response = await leaveAPI.submitAnnual({
      employee_id: 1,
      replacement_emp: 2,
      start_date: '2024-12-15',
      end_date: '2024-12-20'
    });
    console.log('Leave submitted:', response.message);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Example: HR Approve Leave

```typescript
import { hrAPI } from '../utils/apiClient';

const approveLeave = async () => {
  try {
    const response = await hrAPI.approveAnnualAccidental(101, 5);
    console.log('Approved:', response.message);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🔧 Database Stored Procedures & Functions Used

### Employee Functions:
- `EmployeeLoginValidation` - Validate employee login
- `MyPerformance` - Get employee performance
- `MyAttendance` - Get employee attendance
- `Last_month_payroll` - Get payroll data
- `Deductions_Attendance` - Get deductions

### Leave Procedures:
- `Submit_annual` - Submit annual leave
- `Submit_accidental` - Submit accidental leave
- `Submit_medical` - Submit medical leave
- `Submit_unpaid` - Submit unpaid leave
- `Submit_compensation` - Submit compensation leave
- `Is_On_Leave` - Check if employee is on leave

### HR Procedures:
- `HRLoginValidation` - Validate HR login
- `HR_approval_an_acc` - Approve annual/accidental
- `HR_approval_Unpaid` - Approve unpaid leave
- `HR_approval_comp` - Approve compensation
- `Add_Payroll` - Add payroll
- `Deduction_hours` - Calculate hour deductions
- `Deduction_days` - Calculate day deductions
- `Deduction_unpaid` - Calculate unpaid deductions
- `Update_Attendance` - Update attendance
- `Dean_andHR_Evaluation` - Add evaluation

### Admin Procedures:
- `Upperboard_approve_annual` - Approve annual leave
- `Upperboard_approve_unpaids` - Approve unpaid leave
- `Replace_employee` - Replace employee
- `Add_Holiday` - Add holiday

---

## 🐛 Troubleshooting

### Database Connection Failed
- Verify SQL Server is running
- Check credentials in `.env`
- Ensure database `University_HR_ManagementSystem` exists
- Check firewall settings for port 1433

### API Errors
- Ensure backend server is running (`npm run server`)
- Check CORS is enabled (already configured)
- Verify endpoint paths match documentation

### SQL Errors
- Check stored procedures are created correctly
- Verify data types match between API and database
- Review SQL Server error logs

---

## 📊 Database Views Available

- `allEmployeeProfiles` - All employee profiles
- `NoEmployeeDept` - Employee count per department
- `allPerformance` - All performance records (Winter semester)
- `allRejectedMedicals` - All rejected medical leaves
- `allEmployeeAttendance` - Yesterday's attendance

You can query these views directly through the API or create new endpoints as needed!
