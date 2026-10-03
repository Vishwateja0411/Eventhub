const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendance.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Attendance & Check-in (Organizer & Admin only)
router.post('/check-in', authenticate, authorize('ORGANIZER', 'ADMIN'), attendanceController.checkIn);
router.get('/event/:eventId', authenticate, authorize('ORGANIZER', 'ADMIN'), attendanceController.getEventAttendance);

module.exports = router;
