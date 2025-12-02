const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

// HR Authentication
router.post('/login', hrController.login);

// Leave Approvals
router.post('/approve/annual-accidental', hrController.approveAnnualAccidental);
router.post('/approve/unpaid', hrController.approveUnpaid);
router.post('/approve/compensation', hrController.approveCompensation);

// Payroll & Deductions
router.post('/payroll/add', hrController.addPayroll);
router.post('/deduction/hours', hrController.deductHours);
router.post('/deduction/days', hrController.deductDays);
router.post('/deduction/unpaid', hrController.deductUnpaid);

// Attendance
router.post('/attendance/update', hrController.updateAttendance);

// Performance Evaluation
router.post('/evaluation', hrController.addEvaluation);

// View All Data
router.get('/employees', hrController.getAllEmployees);
router.get('/performance', hrController.getAllPerformance);
router.get('/attendance', hrController.getAllAttendance);

module.exports = router;
