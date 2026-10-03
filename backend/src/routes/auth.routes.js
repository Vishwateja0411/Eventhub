const router = require('express').Router();
// Auth routes — implemented in B3
router.get('/status', (req, res) => res.json({ message: 'auth routes stub' }));
module.exports = router;
