const express = require('express');
const router = express.Router();

const ticketController = require('../controllers/ticket.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Ticket display & verification
router.get('/verify/:ticketCode', authenticate, authorize('ORGANIZER', 'ADMIN'), ticketController.verifyTicket);
router.get('/:ticketCode', authenticate, ticketController.getTicketByCode);

module.exports = router;
