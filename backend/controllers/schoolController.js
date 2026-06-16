const School = require('../models/schoolModel');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all schools
// @route   GET /api/schools
// @access  Public
const getSchools = async (req, res, next) => {
  try {
    const schools = await School.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a school
// @route   POST /api/schools
// @access  Private/Admin
const createSchool = async (req, res, next) => {
  try {
    const { nama_sekolah } = req.body;

    if (!nama_sekolah) {
      res.status(400);
      throw new Error('Mohon lengkapi nama sekolah');
    }

    const school = await School.create({
      school_id: uuidv4(),
      nama_sekolah
    });

    res.status(201).json({
      success: true,
      message: 'Data sekolah berhasil ditambahkan',
      data: school
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a school
// @route   PUT /api/schools/:id
// @access  Private/Admin
const updateSchool = async (req, res, next) => {
  try {
    const school = await School.findOne({ school_id: req.params.id });

    if (!school) {
      res.status(404);
      throw new Error('Data sekolah tidak ditemukan');
    }

    const { nama_sekolah } = req.body;

    school.nama_sekolah = nama_sekolah || school.nama_sekolah;

    const updatedSchool = await school.save();

    res.status(200).json({
      success: true,
      message: 'Data sekolah berhasil diperbarui',
      data: updatedSchool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a school
// @route   DELETE /api/schools/:id
// @access  Private/Admin
const deleteSchool = async (req, res, next) => {
  try {
    const school = await School.findOne({ school_id: req.params.id });

    if (!school) {
      res.status(404);
      throw new Error('Data sekolah tidak ditemukan');
    }

    await School.findOneAndDelete({ school_id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Data sekolah berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool
};
