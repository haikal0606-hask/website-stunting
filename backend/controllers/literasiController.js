const Literasi = require('../models/LiterasiModel');
const fs = require('fs');
const path = require('path');

// GET all
exports.getAllLiterasi = async (req, res) => {
  try {
    const data = await Literasi.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data Literasi', error: error.message });
  }
};

// GET by literasi_id
exports.getLiterasiById = async (req, res) => {
  try {
    const literasi = await Literasi.findOne({ literasi_id: req.params.id });
    if (!literasi) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: literasi });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mencari detail literasi', error: error.message });
  }
};

// POST add new
exports.createLiterasi = async (req, res) => {
  try {
    const { tipe_kelompok, kategori, judul, konten, tipe_video } = req.body;
    let video_url = req.body.video_url;

    // Jika internal, ambil dari multer req.file
    if (tipe_video === 'internal') {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'File video harus diunggah untuk tipe internal.' });
      }
      // Simpan path relatif terhadap host
      video_url = `/uploads/videos/${req.file.filename}`;
    }

    const literasi_id = `LIT-${Date.now()}`;

    const newLiterasi = new Literasi({
      literasi_id,
      tipe_kelompok,
      kategori,
      judul,
      konten,
      tipe_video,
      video_url
    });

    const saved = await newLiterasi.save();
    res.status(201).json({ success: true, data: saved });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan data literasi', error: error.message });
  }
};

// PUT update
exports.updateLiterasi = async (req, res) => {
  try {
    const { tipe_kelompok, kategori, judul, konten, tipe_video } = req.body;
    let video_url = req.body.video_url;
    
    const literasiLama = await Literasi.findOne({ literasi_id: req.params.id });
    if (!literasiLama) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    // Jika user unggah video baru
    if (req.file && tipe_video === 'internal') {
      video_url = `/uploads/videos/${req.file.filename}`;
      
      // Hapus video lama dari disk secara opsional
      if (literasiLama.tipe_video === 'internal' && literasiLama.video_url) {
         const oldFile = path.join(__dirname, '../', literasiLama.video_url);
         if(fs.existsSync(oldFile)) {
             fs.unlinkSync(oldFile);
         }
      }
    } else if (tipe_video === 'internal' && !req.file && literasiLama.tipe_video === 'internal') {
      // Pertahankan url file lama
      video_url = literasiLama.video_url;
    }

    const updated = await Literasi.findOneAndUpdate(
      { literasi_id: req.params.id },
      { tipe_kelompok, kategori, judul, konten, tipe_video, video_url },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui data', error: error.message });
  }
};

// DELETE literasi
exports.deleteLiterasi = async (req, res) => {
  try {
    const deleted = await Literasi.findOneAndDelete({ literasi_id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    
    // Hapus file video dari server jika internal
    if (deleted.tipe_video === 'internal' && deleted.video_url) {
       const filepath = path.join(__dirname, '../', deleted.video_url);
       if(fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
       }
    }

    res.status(200).json({ success: true, message: 'Berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus data', error: error.message });
  }
};
