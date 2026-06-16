const Quiz = require('../models/quizModel');
const QuizResult = require('../models/quizResultModel');
const School = require('../models/schoolModel');
const { v4: uuidv4 } = require('uuid');

// @desc    Ambil 10 butir soal kuis secara acak
// @route   GET /api/quizzes
// @access  Public atau Private (Bisa diproteksi menggunakan token jika perlu)
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.aggregate([
      { $sort: { createdAt: 1 } },
      { $limit: 10 },
      // Proyeksikan (Sembunyikan) field kunci_jawaban agar tidak dilihat oleh frontend!
      { $project: { kunci_jawaban: 0, createdAt: 0, updatedAt: 0, __v: 0 } }
    ]);

    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ambil statistik rata-rata skor per asal sekolah (Public Leaderboard)
// @route   GET /api/quizzes/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await School.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'nama_sekolah',
          foreignField: 'asal_sekolah',
          as: 'students'
        }
      },
      {
        $lookup: {
          from: 'quizresults',
          localField: 'students.user_id',
          foreignField: 'user_id',
          as: 'results'
        }
      },
      {
        $project: {
          _id: 0,
          sekolah: '$nama_sekolah',
          avgSkor: {
            $cond: {
              if: { $gt: [{ $size: '$results' }, 0] },
              then: { $round: [{ $avg: '$results.skor' }, 0] },
              else: 0
            }
          },
          avgWaktu: {
            $cond: {
              if: { $gt: [{ $size: '$results' }, 0] },
              then: { $round: [{ $avg: '$results.waktu_pengerjaan' }, 0] },
              else: 0
            }
          },
          totalSiswa: {
            // Hitung jumlah unik ID user yang ada di array results
            $size: {
              $setUnion: ['$results.user_id', []] 
            }
          }
        }
      },
      {
        // Urutkan berdasarkan skor rata-rata tertinggi, lalu waktu rata-rata tercepat, lalu nama sekolah
        $sort: { avgSkor: -1, avgWaktu: 1, sekolah: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluasi jawaban kuis yang diberikan user dan hitung skor
// @route   POST /api/quizzes/submit
// @access  Private (Hanya user yang telah Login dengan JWT)
const submitQuiz = async (req, res, next) => {
  try {
    // Frontend mengirimkan array jawaban dan waktu pengerjaan
    // Contoh format: { "answers": [{ "quiz_id": "Q-001", "jawaban": "A" }], "time_taken": 120 }
    const { answers, time_taken } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      res.status(400);
      throw new Error('Data jawaban tidak valid atau kosong');
    }

    let correctAnswers = 0;
    const totalQuestions = answers.length; // Mengacu pada jumlah kuis yang disubmit

    // Evaluasi jawaban per nomor
    for (let i = 0; i < answers.length; i++) {
        const item = answers[i];
        
        // Temukan data soal asli berserta Kunci Jawaban yang ada di database
        const quiz = await Quiz.findOne({ quiz_id: item.quiz_id });
        
        if (quiz) {
            // Bandingkan secara case-insensitive
            if (item.jawaban.trim().toUpperCase() === quiz.kunci_jawaban.trim().toUpperCase()) {
                correctAnswers += 1;
            }
        }
    }

    // Kalkulasi perolehan Skor. Misal: (8 / 10) * 100 = 80
    const finalScore = (correctAnswers / totalQuestions) * 100;

    // Ambil identitas user dari JWT MiddleWare (req.user telah didecode di protect middleware)
    const user_id = req.user.user_id;

    // Simpan informasi pengerjaan ke tabel / history QuizResult
    const quizResult = await QuizResult.create({
      result_id: uuidv4(), // Generate ID baru
      user_id: user_id,    // Relasi dari payload user yang login
      skor: Math.round(finalScore), // Membulatkan nilai ke integer (desimal dihapus)
      waktu_pengerjaan: time_taken || 0
    });

    // Berikan respons evaluasi komplit
    res.status(201).json({
      success: true,
      message: 'Kuis berhasil diselesaikan dan dievaluasi otomatis.',
      data: {
        total_soal_dijawab: totalQuestions,
        benar: correctAnswers,
        salah: totalQuestions - correctAnswers,
        skor_akhir: Math.round(finalScore),
        result_id: quizResult.result_id
      }
    });

  } catch (error) {
    next(error);
  }
};

// --- ADMIN CRUD ROUTES FOR BANK SOAL ---

// @desc    Ambil SEMUA pertanyaan kuis lengkap beserta kunci jawaban untuk admin dashboard
// @route   GET /api/quizzes/admin
// @access  Private/Admin
const getAdminQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ambil SEMUA riwayat pengerjaan kuis dari seluruh user untuk admin
// @route   GET /api/quizzes/results/all
// @access  Private/Admin
const getAllQuizResults = async (req, res, next) => {
  try {
    const results = await QuizResult.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          result_id: 1,
          skor: 1,
          createdAt: 1,
          'userDetails.nama': 1,
          'userDetails.asal_sekolah': 1,
          'userDetails.email': 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tambahkan pertanyaan kuis baru
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res, next) => {
  try {
    const { pertanyaan, opsi, kunci_jawaban } = req.body;

    if (!pertanyaan || !opsi || !kunci_jawaban) {
      res.status(400);
      throw new Error('Mohon isi spesifikasi pertanyaan, opsi ganda, dan kunci jawaban');
    }

    const quiz = await Quiz.create({
      quiz_id: `Q-${uuidv4().substring(0, 8).toUpperCase()}`,
      pertanyaan,
      opsi,
      kunci_jawaban
    });

    res.status(201).json({
      success: true,
      message: 'Soal Kuis sukses ditambahkan',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update/Edit pertanyaan kuis
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ quiz_id: req.params.id });

    if (!quiz) {
      res.status(404);
      throw new Error('Soal kuis tidak ditemukan');
    }

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { quiz_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Soal kuis berhasil diubah',
      data: updatedQuiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hapus kuis/pertanyaan dari bank soal
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ quiz_id: req.params.id });

    if (!quiz) {
      res.status(404);
      throw new Error('Soal kuis tidak ditemukan');
    }

    await Quiz.findOneAndDelete({ quiz_id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Soal kuis telah dihapus dari basis data'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hapus SELURUH riwayat pengerjaan kuis (Reset)
// @route   DELETE /api/quizzes/results/reset
// @access  Private/Admin
const resetQuizResults = async (req, res, next) => {
  try {
    await QuizResult.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'Seluruh riwayat nilai kuis berhasil direset/dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizzes,
  getLeaderboard,
  getAdminQuizzes,
  getAllQuizResults,
  submitQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  resetQuizResults
};
