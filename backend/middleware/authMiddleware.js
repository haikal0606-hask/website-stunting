const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Memeriksa apakah tipe Authorisasi di Header merupakan format 'Bearer' token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil isi token dari Header
      // Format header => "Bearer asdfghjklqwerty..."
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi validitas token (termasuk pengecekan kadaluwarsa)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_super_aman_untuk_json_web_token_kamu');

      // Ambil data User dari database berdasarkan token payload (`id`), dan kecualikan password hash
      req.user = await User.findOne({ user_id: decoded.id }).select('-password_hash');

      if (!req.user) {
        res.status(401);
        throw new Error('User terkait dengan token ini sudah tidak ditemukan.');
      }

      // Lanjut ke endpoint selanjutnya setelah berhasil di-verifikasi
      next();
    } catch (error) {
      console.error('Error saat verifikasi JWT:', error);
      res.status(401);
      throw new Error('Tidak terotorisasi, token gagal diverifikasi atau sudah expired');
    }
  }

  // Jika tidak ditemukan token JWT sama sekali di header
  if (!token) {
    res.status(401);
    throw new Error('Tidak terotorisasi, tidak ada token identitas yang disertakan.');
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Akses diblokir: Hanya untuk Administrator');
  }
};

module.exports = { protect, admin };
