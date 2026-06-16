const mongoose = require('mongoose');

const quizSchema = mongoose.Schema(
  {
    quiz_id: {
      type: String,
      required: [true, 'Masukkan quiz ID (PK)'],
      unique: true,
    },
    pertanyaan: {
      type: String,
      required: [true, 'Masukkan pertanyaan'],
    },
    opsi: {
      type: [String], // Array of strings (Contoh: ['A. Opsi1', 'B. Opsi2', ...])
      required: [true, 'Masukkan opsi pilihan jawaban'],
      validate: {
        validator: function(val) {
          return val.length === 4; // Memastikan array memiliki tepat 4 pilihan (A, B, C, D)
        },
        message: 'Opsi harus berisi tepat 4 pilihan jawaban'
      }
    },
    kunci_jawaban: {
      type: String,
      required: [true, 'Masukkan kunci jawaban'],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
