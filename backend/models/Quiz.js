const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  category: {
    type: String,
    enum: ['nutrition', 'health', 'lifestyle'],
    required: true
  },
  explanation: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);