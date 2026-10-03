const router = require('express').Router();
router.get('/me', (req, res) => res.json({ message: 'user routes stub' }));
module.exports = router;
