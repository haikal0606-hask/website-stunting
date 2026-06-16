const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const literasiController = require('../controllers/literasiController');
const { protect, admin } = require('../middleware/authMiddleware');

// Storage and upload configurations without limits as per user's request
const uploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, 'video-' + Date.now() + path.extname(file.originalname))
  }
});

// Multer upload (no max file size specified)
const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb){
        if(file.mimetype.startsWith('video/')){
            cb(null, true);
        } else {
            cb(new Error('Hanya file video yang diperbolehkan!'));
        }
    }
});

// Literasi endpoints
router.route('/')
  .get(literasiController.getAllLiterasi)
  .post(protect, admin, upload.single('video_file'), literasiController.createLiterasi);

router.route('/:id')
  .get(literasiController.getLiterasiById)
  .put(protect, admin, upload.single('video_file'), literasiController.updateLiterasi)
  .delete(protect, admin, literasiController.deleteLiterasi);

module.exports = router;
