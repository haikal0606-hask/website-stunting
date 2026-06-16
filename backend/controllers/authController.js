const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Fungsi bantuan untuk men-generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rahasia_super_aman_untuk_json_web_token_kamu', {
    expiresIn: '30d',
  });
};

// @desc    Register user baru (Siswa SMA Banda Aceh / Umum)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { nama, email, password, asal_sekolah, wilayah } = req.body;

    if (!nama || !email || !password || !asal_sekolah || !wilayah) {
      res.status(400);
      throw new Error('Tolong lengkapi semua data form (nama, email, password, asal sekolah, wilayah)');
    }

    // Cek apakah email user sudah terdaftar
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('Email sudah terdaftar. Gunakan email lain atau silakan login.');
    }

    // Encrypt password (hashing menggunakan bcryptjs)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat data user di DB
    const user = await User.create({
      user_id: uuidv4(), // Generate ID String PK secara UUID
      nama,
      email,
      password_hash: hashedPassword,
      asal_sekolah,
      wilayah,
      role: 'User'
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: {
          user_id: user.user_id,
          nama: user.nama,
          email: user.email,
          asal_sekolah: user.asal_sekolah,
          wilayah: user.wilayah,
          role: user.role,
          token: generateToken(user.user_id),
        }
      });
    } else {
      res.status(400);
      throw new Error('Data user tidak valid, gagal membuat akun.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Autentikasi (Login) User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      res.status(400);
      throw new Error('Tolong sertakan email dan password');
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    // Jika user ditemukan && hasil verifikasi (compare) password dari bcrypt benar
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: {
          user_id: user.user_id,
          nama: user.nama,
          email: user.email,
          asal_sekolah: user.asal_sekolah,
          wilayah: user.wilayah,
          role: user.role,
          token: generateToken(user.user_id),
        }
      });
    } else {
      res.status(401);
      throw new Error('Kredensial tidak valid: Email atau Password salah');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
