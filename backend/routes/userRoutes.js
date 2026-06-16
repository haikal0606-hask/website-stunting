const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Define API routes for users
router.route('/').get(protect, admin, getUsers);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
