const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Authentication
router.post('/login', employeeController.login);

// Employee Profile & Info
router.get('/:id/profile', employeeController.getProfile);
router.get('/:id/performance', employeeController.getPerformance);
router.get('/:id/attendance', employeeController.getAttendance);
router.get('/:id/payroll', employeeController.getLastPayroll);
router.get('/:id/deductions', employeeController.getDeductions);

module.exports = router;
