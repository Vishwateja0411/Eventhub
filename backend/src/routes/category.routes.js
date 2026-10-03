const router = require('express').Router();
router.get('/', (req, res) => res.json({ message: 'category routes stub', categories: [] }));
module.exports = router;
