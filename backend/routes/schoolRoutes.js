const express = require('express');
const router = express.Router();
const {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool
} = require('../controllers/schoolController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSchools)
  .post(protect, admin, createSchool);

router.route('/:id')
  .put(protect, admin, updateSchool)
  .delete(protect, admin, deleteSchool);

module.exports = router;
