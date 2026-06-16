const User = require('../models/userModel');
const QuizResult = require('../models/quizResultModel');

// @desc    Get all users (Admin only recommended)
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password_hash');
    
    res.status(200).json({
      success: true,
      message: 'Fetched users successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile & query their Quiz History
// @route   GET /api/v1/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user.user_id }).select('-password_hash');

    if (user) {
      // Ambil Riwayat kuis yang pernah diikuti user ini
      const quizHistory = await QuizResult.find({ user_id: req.user.user_id }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: {
          ...user._doc,
          quizHistory
        }
      });
    } else {
      res.status(404);
      throw new Error('Pengguna tidak ditemukan');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      res.status(404);
      throw new Error('Pengguna tidak ditemukan');
    }

    const { nama, email, asal_sekolah } = req.body;

    // Jika user mengupdate email, periksa apakah email yang baru sudah dipakai orang lain
    if (email && email !== user.email) {
       const emailExists = await User.findOne({ email });
       if (emailExists) {
          res.status(400);
          throw new Error('Email sudah digunakan oleh akun lain');
       }
    }

    user.nama = nama || user.nama;
    user.email = email || user.email;
    user.asal_sekolah = asal_sekolah || user.asal_sekolah;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        user_id: updatedUser.user_id,
        nama: updatedUser.nama,
        email: updatedUser.email,
        asal_sekolah: updatedUser.asal_sekolah,
        wilayah: updatedUser.wilayah,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
};
