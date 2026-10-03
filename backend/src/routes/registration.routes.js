const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registration.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// User registration endpoints
router.get('/my-registrations', authenticate, registrationController.getUserRegistrations);
router.post('/:eventId', authenticate, registrationController.registerForEvent);
router.delete('/:id', authenticate, registrationController.cancelRegistration);

// Organizer attendee endpoints
router.get('/event/:eventId/attendees', authenticate, authorize('ORGANIZER', 'ADMIN'), registrationController.getEventAttendees);

module.exports = router;
