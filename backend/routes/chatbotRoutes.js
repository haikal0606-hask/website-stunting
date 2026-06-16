const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbotController');

// Endpoint yang menerima pertanyaan
router.post('/', getChatbotResponse);

module.exports = router;
