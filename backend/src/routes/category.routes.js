const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), categoryController.createCategory);

module.exports = router;
