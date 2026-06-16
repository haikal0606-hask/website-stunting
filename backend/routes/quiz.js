const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== '') {
      query.category = category;
    }

    const quizzes = await Quiz.find(query);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz answers
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    let score = 0;
    const results = [];

    for (let answer of answers) {
      const question = await Quiz.findById(answer.questionId);
      if (question) {
        const selectedOption = question.options.find(opt => 
          opt._id.toString() === answer.optionId
        );
        const isCorrect = selectedOption ? selectedOption.isCorrect : false;
        
        if (isCorrect) score++;
        
        results.push({
          questionId: answer.questionId,
          question: question.question,
          selectedOption: selectedOption ? selectedOption.text : 'Tidak dijawab',
          correctOption: question.options.find(opt => opt.isCorrect).text,
          explanation: question.explanation,
          isCorrect
        });
      }
    }

    const percentage = (score / answers.length) * 100;
    
    res.json({
      score,
      total: answers.length,
      percentage: percentage.toFixed(2),
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sample quizzes
router.post('/sample', async (req, res) => {
  try {
    const sampleQuizzes = [
      {
        question: "Apa yang dimaksud dengan stunting?",
        options: [
          { text: "Kondisi tubuh yang terlalu gemuk", isCorrect: false },
          { text: "Gagal tumbuh pada anak akibat kekurangan gizi kronis", isCorrect: true },
          { text: "Penyakit menular pada anak", isCorrect: false },
          { text: "Kondisi alergi terhadap makanan tertentu", isCorrect: false }
        ],
        category: "health",
        explanation: "Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis dan infeksi berulang."
      },
      {
        question: "Kapan periode emas pencegahan stunting?",
        options: [
          { text: "1000 Hari Pertama Kehidupan", isCorrect: true },
          { text: "Saat remaja", isCorrect: false },
          { text: "Saat dewasa", isCorrect: false },
          { text: "Saat usia sekolah", isCorrect: false }
        ],
        category: "health",
        explanation: "1000 Hari Pertama Kehidupan (dari janin hingga anak usia 2 tahun) adalah periode emas pencegahan stunting."
      },
      {
        question: "Apa saja zat gizi yang penting untuk remaja?",
        options: [
          { text: "Protein, zat besi, kalsium", isCorrect: true },
          { text: "Hanya karbohidrat", isCorrect: false },
          { text: "Hanya lemak", isCorrect: false },
          { text: "Hanya vitamin", isCorrect: false }
        ],
        category: "nutrition",
        explanation: "Remaja membutuhkan berbagai zat gizi termasuk protein untuk pertumbuhan, zat besi untuk mencegah anemia, dan kalsium untuk tulang."
      },
      {
        question: "Berapa lama aktivitas fisik yang disarankan untuk remaja per hari?",
        options: [
          { text: "30 menit", isCorrect: false },
          { text: "60 menit", isCorrect: true },
          { text: "15 menit", isCorrect: false },
          { text: "120 menit", isCorrect: false }
        ],
        category: "lifestyle",
        explanation: "Remaja disarankan beraktivitas fisik minimal 60 menit setiap hari untuk pertumbuhan optimal."
      }
    ];

    await Quiz.deleteMany({});
    const quizzes = await Quiz.insertMany(sampleQuizzes);
    
    res.json({ 
      message: 'Sample quizzes created successfully',
      quizzes 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;