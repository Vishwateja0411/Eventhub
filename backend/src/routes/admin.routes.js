const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
} = require('../controllers/admin.controller');

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
