const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createPaymentOrder,
  verifyPayment,
  getUserPayments,
} = require('../controllers/payment.controller');

// All payment routes require authentication
router.use(authenticate);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/my-payments', getUserPayments);

module.exports = router;
