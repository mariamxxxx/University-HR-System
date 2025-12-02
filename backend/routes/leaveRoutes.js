const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Submit leave requests
router.post('/annual', leaveController.submitAnnualLeave);
router.post('/accidental', leaveController.submitAccidentalLeave);
router.post('/medical', leaveController.submitMedicalLeave);
router.post('/unpaid', leaveController.submitUnpaidLeave);
router.post('/compensation', leaveController.submitCompensationLeave);

// Get leave status
router.get('/status/:employee_id', leaveController.getLeaveStatus);
router.get('/check-onleave', leaveController.checkOnLeave);

module.exports = router;
