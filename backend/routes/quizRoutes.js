const express = require('express');
const router = express.Router();
const { getQuizzes, getLeaderboard, getAdminQuizzes, getAllQuizResults, submitQuiz, createQuiz, updateQuiz, deleteQuiz, resetQuizResults } = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');

// Endpoint publik: Ambil kuis & Leaderboard
router.get('/', getQuizzes);
router.get('/leaderboard', getLeaderboard);

// Endpoint privat: Submit jawaban kuis
router.post('/submit', protect, submitQuiz);

// --- rute CRUD ADMIN Modul Bank Soal ---
router.get('/admin', protect, admin, getAdminQuizzes);
router.get('/results/all', protect, admin, getAllQuizResults);
router.delete('/results/reset', protect, admin, resetQuizResults);
router.post('/', protect, admin, createQuiz);
router.put('/:id', protect, admin, updateQuiz);
router.delete('/:id', protect, admin, deleteQuiz);

module.exports = router;
