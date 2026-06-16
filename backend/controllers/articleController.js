const Article = require('../models/articleModel');
const { v4: uuidv4 } = require('uuid');

// Helper: ambil teks plain dari BlockNote JSON untuk excerpt
const extractExcerpt = (content, maxLength = 160) => {
  if (!Array.isArray(content)) return '';
  const texts = [];
  for (const block of content) {
    if (block.content && Array.isArray(block.content)) {
      for (const inline of block.content) {
        if (inline.type === 'text' && inline.text) {
          texts.push(inline.text);
        }
      }
    }
    if (texts.join(' ').length >= maxLength) break;
  }
  const full = texts.join(' ');
  return full.length > maxLength ? full.substring(0, maxLength) + '...' : full;
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({}).select('-content').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findOne({ article_id: req.params.id });
    if (!article) {
      res.status(404);
      throw new Error('Artikel tidak ditemukan');
    }
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res, next) => {
  try {
    const { judul, content } = req.body;

    if (!judul) {
      res.status(400);
      throw new Error('Mohon lengkapi judul artikel');
    }

    const excerpt = extractExcerpt(content || []);

    const article = await Article.create({
      article_id: uuidv4(),
      judul,
      content: content || [],
      excerpt
    });

    res.status(201).json({
      success: true,
      message: 'Artikel berhasil dibuat',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({ article_id: req.params.id });

    if (!article) {
      res.status(404);
      throw new Error('Artikel tidak ditemukan');
    }

    const { judul, content } = req.body;
    const updateData = {
      judul: judul || article.judul,
      content: content !== undefined ? content : article.content,
      excerpt: content !== undefined ? extractExcerpt(content) : article.excerpt
    };

    const updatedArticle = await Article.findOneAndUpdate(
      { article_id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Artikel berhasil diperbarui',
      data: updatedArticle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({ article_id: req.params.id });

    if (!article) {
      res.status(404);
      throw new Error('Artikel tidak ditemukan');
    }

    await Article.findOneAndDelete({ article_id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
