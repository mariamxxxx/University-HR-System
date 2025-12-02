const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Leave Approvals (Dean/Upperboard)
router.post('/approve/annual', adminController.approveAnnualLeave);
router.post('/approve/unpaid', adminController.approveUnpaidLeave);

// Department & Role Management
router.get('/departments', adminController.getAllDepartments);
router.get('/roles', adminController.getAllRoles);
router.post('/departments', adminController.addDepartment);
router.post('/roles', adminController.addRole);
router.get('/departments/stats', adminController.getDepartmentStats);

// Holiday Management
router.post('/holidays', adminController.addHoliday);

// Employee Replacement
router.post('/replace-employee', adminController.replaceEmployee);

module.exports = router;
