const router = require('express').Router();
// Event routes — implemented in B4
router.get('/', (req, res) => res.json({ message: 'event routes stub', events: [] }));
module.exports = router;
