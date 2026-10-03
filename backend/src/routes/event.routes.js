const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', eventController.getEvents);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/organizer/my-events', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.getOrganizerEvents);
router.get('/:slugOrId', eventController.getEventBySlug);

// Protected routes (Organizer & Admin only)
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.createEvent);
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.updateEvent);
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.deleteEvent);

module.exports = router;
