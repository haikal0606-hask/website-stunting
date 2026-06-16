import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(false);




  const handleOpenModal = async (quiz) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setCheckingProfile(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        if (!data.data.asal_sekolah) {
          alert('Peringatan: Anda belum melengkapi data Asal Sekolah.\nSilakan perbarui profil Anda terlebih dahulu sebelum memulai kuis.');
          navigate('/profile');
          return;
        }
        // Simpan sementara jika dibutuhkan oleh session quiz
        sessionStorage.setItem('quiz_asal_sekolah', data.data.asal_sekolah);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingProfile(false);
    }

    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  const handleConfirmStart = () => {
    setShowModal(false);
    // Mengarahkan ke sesi kuis khusus untuk pertanyaan yang dipilih
    navigate('/quiz/session');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 relative selection:bg-indigo-100 font-sans">
      
      {/* Decorative background header */}
      <div className="w-full h-64 bg-indigo-600 absolute top-0 rounded-b-[3rem] z-0 shadow-lg border-b-8 border-indigo-700"></div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 animate-fade-in-up">
        
        <div className="text-center text-white mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-md tracking-tight">Daftar Evaluasi Kuis</h1>
          <p className="text-indigo-100 font-medium text-lg max-w-2xl mx-auto">Uji kompetensi literasi gizi Anda melalui kuis di bawah ini. Pastikan Anda telah menyelesaikan membaca materi di menu Pusat Edukasi.</p>
        </div>

        <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-indigo-100/30 flex flex-col hover:-translate-y-2 transition-transform duration-300 w-full max-w-lg text-center items-center">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
               </div>
               
               <h2 className="text-3xl font-bold text-slate-800 leading-snug mb-4">Evaluasi Kompetensi Gizi Utama</h2>
               <p className="text-slate-500 text-base leading-relaxed mb-8">Kuis ini berisi sekumpulan pertanyaan acak yang diambil langsung dari Bank Soal yang telah disiapkan. Uji seberapa baik pemahaman Anda mengenai materi edukasi stunting yang telah diberikan.</p>
               
               <div className="flex items-center text-rose-500 text-sm font-bold mb-8 bg-rose-50 px-4 py-2 rounded-xl">
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Alokasi Waktu: 20 Menit
               </div>

               <button 
                  onClick={() => handleOpenModal({ title: 'Evaluasi Kompetensi Gizi Utama' })}
                  disabled={checkingProfile}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all active:scale-95 border-b-4 border-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
               >
                 {checkingProfile ? 'Memeriksa Data...' : 'Mulai Kerjakan Sekarang'}
               </button>
            </div>
        </div>
      </div>

      {/* Pop-up Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop Blur overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fade-in-up">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 text-center mb-2">Konfirmasi Memulai</h3>
            
            <p className="text-slate-500 text-center mb-8 font-medium">
              Apakah Anda telah bersedia mulai menjawab kuis ini? Anda akan diberikan waktu 20 Menit dan dihitung sejak Anda menekan "Ya, Mulai".
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleCloseModal}
                className="flex-1 bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmStart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all border-b-2 border-indigo-800"
              >
                Ya, Mulai Kuis
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Quiz;
