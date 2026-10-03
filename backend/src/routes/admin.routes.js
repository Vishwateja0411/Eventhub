const router = require('express').Router();
router.get('/stats', (req, res) => res.json({ message: 'admin routes stub' }));
module.exports = router;
