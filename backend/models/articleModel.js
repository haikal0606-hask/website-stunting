const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
  {
    article_id: {
      type: String,
      required: [true, 'Masukkan article ID (PK)'],
      unique: true,
    },
    judul: {
      type: String,
      required: [true, 'Masukkan judul artikel'],
    },
    excerpt: {
      type: String, // Ringkasan singkat, di-generate otomatis dari content
      default: '',
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // JSON Array dari BlockNote
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Article', articleSchema);
