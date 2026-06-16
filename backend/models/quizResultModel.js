const mongoose = require('mongoose');

const quizResultSchema = mongoose.Schema(
  {
    result_id: {
      type: String,
      required: [true, 'Masukkan result ID (PK)'],
      unique: true,
    },
    user_id: {
      type: String, // String foreign key
      required: [true, 'Masukkan user ID'],
      ref: 'User', // Relasi (FK) ke model User
    },
    skor: {
      type: Number,
      required: [true, 'Masukkan skor'],
    },
    waktu_pengerjaan: {
      type: Number,
      default: 0,
    },
    DateTime: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // Opsional jika DateTime sudah dihandle secara manual, ini akan men-generate createdAt
  }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
