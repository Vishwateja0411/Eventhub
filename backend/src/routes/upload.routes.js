const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/upload.controller');
const authenticate = require('../middleware/authenticate');
const { uploadSingle } = require('../middleware/upload');

// Protected upload routes
router.post('/image', authenticate, uploadSingle, uploadController.uploadImage);
router.delete('/image', authenticate, uploadController.removeImage);

module.exports = router;
