const express = require('express');
const router = express.Router();

// Temporary routes untuk testing
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - under development' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - under development' });
});

module.exports = router;