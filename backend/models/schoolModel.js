const mongoose = require('mongoose');

const schoolSchema = mongoose.Schema(
  {
    school_id: {
      type: String,
      required: [true, 'Masukkan school ID (PK)'],
      unique: true,
    },
    nama_sekolah: {
      type: String,
      required: [true, 'Masukkan nama sekolah'],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('School', schoolSchema);
