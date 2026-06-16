const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'Masukkan user ID (PK)'],
      unique: true,
    },
    nama: {
      type: String,
      required: [true, 'Masukkan nama'],
    },
    email: {
      type: String,
      required: [true, 'Masukkan email'],
      unique: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Masukkan password hash'],
    },
    asal_sekolah: {
      type: String,
      required: [true, 'Masukkan asal sekolah'],
    },
    wilayah: {
      type: String,
      required: [true, 'Masukkan wilayah Kab/Kota'],
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    }
  },
  {
    timestamps: true, // Akan otomatis membuat field createdAt dan updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
