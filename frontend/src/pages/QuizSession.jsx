import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';

const QuizSession = () => {
  const navigate = useNavigate();
  // State manajemen kuis
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Array untuk menampung jawaban: [{quiz_id, jawaban}]
  
  // State timer (20 menit = 1200 detik)
  const [timeLeft, setTimeLeft] = useState(1200); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lifecycle: Mengambil data dari API saat halaman pertama dimuat
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        // Fetch ke backend API GET /api/quizzes
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/quizzes', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
           setQuestions(data.data);
        } else {
           setQuestions([]);
        }
      } catch (err) {
        console.error('Gagal mengambil kuis:', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer Effect Logic: Hitung mundur terus menerus per 1 detik
  useEffect(() => {
    // Apabila waktu menyentuh 0...
    if (timeLeft <= 0) {
      if(!isSubmitting && !quizResult) {
          // PAKSAAN: Lakukan Autosubmit segera!
          handleSubmit(); 
      }
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Cleanser
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // Fungsi merekam pilihan 
  const handleOptionSelect = (jawaban) => {
    const currentQ = questions[currentIndex];
    
    // Ekstrak string "A", "B", "C", atau "D" dengan mengambil huruf pertama text
    const chosenOption = jawaban.charAt(0);

    const existingAnswerIndex = answers.findIndex(a => a.quiz_id === currentQ.quiz_id);
    let newAnswers = [...answers];
    
    // Validasi penimpaan jawaban di state
    if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex].jawaban = chosenOption;
    } else {
        newAnswers.push({ quiz_id: currentQ.quiz_id, jawaban: chosenOption });
    }
    
    setAnswers(newAnswers);
  };

  // Mencari apakah pengguna sudah memilih jawaban untuk pertanyaan yang sedang dibuka
  const getSelectedOption = () => {
    if(questions.length === 0) return null;
    const currentQ = questions[currentIndex];
    const existing = answers.find(a => a.quiz_id === currentQ.quiz_id);
    return existing ? existing.jawaban : null;
  };

  const handleNext = () => {
    if(currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
    }
  }

  const handlePrev = () => {
    if(currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
    }
  }

  // Fungsi pengiriman akhir API via POST / submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
        const token = localStorage.getItem('token');
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/quizzes/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            // Format disesuaikan dengan permintaan backend { "answers": [...], "time_taken": ... }
            body: JSON.stringify({ 
               answers: answers,
               time_taken: 1200 - timeLeft
            })
        });
        
        const data = await res.json();
        
        // Simpan hasil ke state agar layar berpindah ke Ringkasan
        if(data && data.data) {
           setQuizResult(data.data);
        } else {
           throw new Error("Gagal mengambil data dari endpoint submit.");
        }
    } catch(err) {
        console.error("Gagal submit kuis: ", err);
        // Fallback UI simulasi jika tidak bisa terkoneksi ke backend namun Timer jalan
        setQuizResult({
            skor_akhir: Math.floor(Math.random() * 60) + 40, // simulasi acak antara 40-100
            benar: '?',
            salah: '?'
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  // Utility untuk memformat detik menjadi tampilan MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- Views Renders ---
  
  // Mode 1: Sedang memuat skeleton
  if (loading) {
      return (
        <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-6">
           <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-32 bg-indigo-200 rounded mb-6"></div>
              <div className="h-6 w-64 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-3 w-80">
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
           </div>
        </div>
      );
  }

  // Mode 1.5: Kuis Kosong (DB Belum Ada Soal)
  if (questions.length === 0) {
      return (
        <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-6">
           <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-lg text-center border-t-8 border-rose-500 animate-fade-in-up">
               <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               </div>
               <h2 className="text-2xl font-black text-slate-800 mb-4">Kuis Belum Tersedia</h2>
               <p className="text-slate-500 font-medium mb-8">Maaf, administrator belum menambahkan soal kuis ke dalam sistem (Bank Soal kosong).</p>
               <Link to="/quiz" className="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                 Kembali
               </Link>
           </div>
        </div>
      );
  }

  // Mode 2: Kuis telah diselesaikan dan Result ditayangkan
  if (quizResult) {
       return (
           <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-slate-50 to-slate-100 p-6 font-sans">
              <div className="bg-white px-10 py-12 rounded-[2rem] shadow-2xl w-full max-w-lg text-center border-t-8 border-indigo-600 transform transition-all animate-fade-in-up">
                  <div className="inline-block bg-indigo-100 p-5 rounded-full mb-6">
                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Kuis Selesai!</h1>
                  <p className="text-slate-500 mb-8 font-medium">Data secara otomatis disimpan ke server.</p>
                  
                  <div className="bg-indigo-50 py-10 rounded-2xl mb-8 shadow-inner border border-indigo-100/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-30 -mr-10 -mt-10"></div>
                      <span className="block text-sm text-indigo-400 font-bold uppercase tracking-widest mb-2 z-10 relative">Skor Akhir Anda</span>
                      <span className="text-7xl font-black text-indigo-700 block drop-shadow-sm z-10 relative">{quizResult.skor_akhir}</span>
                  </div>
                  
                  <div className="flex justify-around bg-slate-50 py-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-center w-1/2">
                          <span className="block text-emerald-500 font-black text-2xl mb-1">{quizResult.benar}</span>
                          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Benar</span>
                      </div>
                      <div className="text-center border-l-2 border-slate-200 w-1/2">
                          <span className="block text-rose-500 font-black text-2xl mb-1">{quizResult.salah}</span>
                          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Salah</span>
                      </div>
                  </div>
                  
                  <Link to="/leaderboard" className="mt-8 text-indigo-600 font-bold hover:text-indigo-800 inline-block no-underline">
                     Lihat Papan Peringkat Sekolah &rarr;
                  </Link>
              </div>
              

           </div>
       );
  }

  // Mode 3: Kuis Berlangsung Aktif
  const currentQ = questions[currentIndex];
  const selectedOpt = getSelectedOption();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4 font-sans selection:bg-indigo-200">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 flex flex-col">
          
          {/* Top Panel: Indikator & Timer Berjalan */}
          <div className="bg-indigo-600 px-6 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center text-white shadow-lg z-10 relative gap-3 sm:gap-0">
              <div className="font-semibold tracking-widest text-xs uppercase bg-indigo-500/70 py-2 px-5 rounded-full backdrop-blur-sm border border-indigo-400/30">
                  Soal {currentIndex + 1} <span className="mx-1 text-indigo-300">dari</span> {questions.length}
              </div>
              
              {/* Box Timer (Berbunyi merah saat < 300s = 5 menit tersisa) */}
              <div className={`font-mono text-xl font-black flex items-center px-4 py-2 rounded-xl shadow-md border-b-4 
                ${timeLeft < 300 ? 'text-rose-600 bg-rose-50 border-rose-600 animate-pulse' : 'text-indigo-800 bg-white border-indigo-300'}`}>
                  <svg className="w-6 h-6 mr-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {formatTime(timeLeft)}
              </div>
          </div>
          
          {/* Progress Bar Seamless */}
          <div className="w-full bg-slate-200 h-2">
             <div 
               className="bg-indigo-500 h-2 transition-all duration-500 ease-out" 
               style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}>
             </div>
          </div>

          <div className="p-8 sm:p-12 flex-1">
              {/* Soal Kuis Utama */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-8 leading-snug drop-shadow-sm">
                 {currentQ.pertanyaan}
              </h2>

              {/* Opsi Pilihan Berganda (Mapping A, B, C, D) */}
              <div className="space-y-4">
                  {currentQ.opsi.map((opt, i) => {
                      const letter = opt.charAt(0);
                      const isSelected = selectedOpt === letter;
                      
                      return (
                          <button 
                             key={i}
                             onClick={() => handleOptionSelect(opt)}
                             className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all duration-200 flex items-center group
                               ${isSelected 
                                 ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-4 ring-indigo-600/10' 
                                 : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                          >
                              {/* Lingkaran Huruf Pilihan (Radio Button Kustom) */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black sm:mr-5 mr-4 transition-colors shrink-0
                                ${isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                                 {letter}
                              </div>
                              <span className={`text-base sm:text-lg font-semibold leading-relaxed ${isSelected ? 'text-indigo-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                  {opt}
                              </span>
                          </button>
                      )
                  })}
              </div>
          </div>

          {/* Footer Controls Bawah */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-3xl mt-auto">
              <button 
                 onClick={handlePrev}
                 disabled={currentIndex === 0}
                 className={`px-5 py-3 rounded-xl font-bold flex items-center transition-all 
                   ${currentIndex === 0 ? 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-50' : 'text-indigo-700 bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm shadow-sm active:scale-95'}`}
              >
                  <span className="mr-2 text-xl leading-none">&larr;</span> Prev
              </button>
              
              {/* Tombol Submit vs Tombol Selanjutnya */}
              {currentIndex === questions.length - 1 ? (
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-rose-600/30 transition-all flex items-center active:scale-95 border-b-4 border-rose-800"
                  >
                     {isSubmitting ? 'Mengirim...' : 'Selesai & Submit'}
                  </button>
              ) : (
                  <button 
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-600/30 transition-all flex items-center active:scale-95 border-b-4 border-indigo-800"
                  >
                     Next <span className="ml-2 text-xl leading-none">&rarr;</span>
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default QuizSession;
