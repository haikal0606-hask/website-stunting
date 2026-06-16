// @desc    Memproses input dari Chatbot (SehatBot)
// @route   POST /api/chatbot
// @access  Public (Bisa diprotect API/JWT jika di masa depan butuh log chat tiap siswa)
const getChatbotResponse = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400);
      throw new Error('Pesan tidak boleh kosong');
    }

    // Normalisasi huruf menjadi kecil untuk pencarian kata kunci
    const userInput = message.toLowerCase();
    let botResponse = '';

    // Mock-up Sistem Rule-Based Natural Language Processing Sederhana
    if (userInput.includes('stunting')) {
      botResponse = 'Stunting adalah kondisi gagal tumbuh pada balita akibat dari kekurangan gizi kronis, sehingga tinggi badan anak lebih pendek untuk seusianya. Langkah penanganan paling esensial ada pada 1000 Hari Pertama Kehidupan (HPK).';
    } else if (userInput.includes('gizi') || userInput.includes('makan') || userInput.includes('nutrisi')) {
      botResponse = 'Pemenuhan gizi yang prima sangat menentukan! Pastikan asupan balita maupun ibu hamil kaya akan protein hewani (telur, ikan, ayam, daging sapi), serta keseimbangan mikronutrien harian.';
    } else if (userInput.includes('anemia') || userInput.includes('darah') || userInput.includes('ttd')) {
      botResponse = 'Anemia pada usia remaja putri dan ibu hamil (kekurangan zat besi) adalah penyumbang besar stunting. Anemia menghambat pasokan oksigen dan makanan ke janin. Maka dari itu, konsumsi rutin Tablet Tambah Darah (TTD) itu krusial!';
    } else if (userInput.includes('halo') || userInput.includes('hai') || userInput.includes('pagi') || userInput.includes('siang')) {
      botResponse = 'Halo! Kenalkan, aku SehatBot 🤖. Sebagai asisten kesehatan pergerakan anti-stunting Banda Aceh, mari diskusikan masalah "stunting", "gizi", ataupun "anemia" kepada saya!';
    } else if (userInput.includes('remaja') || userInput.includes('sma')) {
      botResponse = 'Anak SMA/Remaja punya peran penting! Dari usia remaja putri, menjaga kesehatan reproduksi dan menghindari diet ekstrem (agar tidak anemia) adalah langkah awal memutus rantai stunting di masa depan.';
    } else {
      // Default / Fallback handling
      botResponse = 'Maaf, kecerdasan SehatBot saat ini hanya difokuskan pada kata kunci edukatif seperti "stunting", "gizi", "remaja", "anemia", atau "Tablet Tambah Darah". Silakan ubah pertanyaan Anda dengan memuat kata-kata tersebut ya! 🙏';
    }

    // Simulasi delay jaringan opsional agar terasa seperti orang mengetik (di sisi backend tidak disarankan sebenarnya, tapi bisa disimulasikan sekilas)
    // Untuk saat ini kita langsung kirim
    res.status(200).json({
      success: true,
      data: {
        sender: 'SehatBot',
        reply: botResponse,
        received_message: message,
        timestamp: new Date()
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatbotResponse
};
