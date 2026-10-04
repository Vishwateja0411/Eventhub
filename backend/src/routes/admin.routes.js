const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  getAllPayments,
} = require('../controllers/admin.controller');

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/payments', getAllPayments);

module.exports = router;
