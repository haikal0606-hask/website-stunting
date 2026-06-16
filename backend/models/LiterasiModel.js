const mongoose = require('mongoose');

const literasiSchema = new mongoose.Schema({
  literasi_id: {
    type: String,
    required: true,
    unique: true
  },
  tipe_kelompok: {
    type: String,
    enum: ['Materi Pokok', 'Bahan Tayang'],
    required: true
  },
  kategori: {
    type: String,
    required: true
  },
  judul: {
    type: String,
    required: true
  },
  konten: {
    type: String,
    required: true
  },
  tipe_video: {
    type: String, // 'youtube' or 'internal'
    required: true
  },
  video_url: {
    type: String, // Berisi URL youtube atau path file lokal
    required: false,
  },
  pdf_url: {
    type: String, // Opsional
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Literasi', literasiSchema);
