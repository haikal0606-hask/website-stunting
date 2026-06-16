const express = require('express');
const router = express.Router();
const { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getArticles);
router.get('/:id', getArticleById);

router.post('/', protect, admin, createArticle);
router.put('/:id', protect, admin, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

module.exports = router;
