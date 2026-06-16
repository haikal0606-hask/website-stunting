import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Literasi = () => {
  const [literasiList, setLiterasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/literasi');
        const data = await res.json();
        if (data.success) {
          setLiterasiList(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data Literasi", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const materiPokok = literasiList.filter(l => l.tipe_kelompok === 'Materi Pokok');
  const bahanTayang = literasiList.filter(l => l.tipe_kelompok === 'Bahan Tayang');

  // Jika masih kosong belum ditambah oleh admin, berikan dummy array agar desain tidak pecah kosong total
  const placeholderMateriPokok = materiPokok.length > 0 ? materiPokok : [];
  const placeholderBahanTayang = bahanTayang.length > 0 ? bahanTayang : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-300 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight relative z-10">
            Pusat Literasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600">Stunting</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed relative z-10">
            Temukan berbagai panduan, referensi, dan materi edukasi terpercaya untuk mencegah, mengenali, dan menanggulangi stunting.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center p-20">
             <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
           </div>
        ) : (
          <>
            {/* Bagian 1: 2025 PEKAN EDUKASI GENTING (Materi Pokok) */}
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-violet-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase">
                  2025 PEKAN EDUKASI GENTING
                </h2>
              </div>
              
              {placeholderMateriPokok.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {placeholderMateriPokok.map((item) => (
                    <MainCard 
                      key={item.literasi_id}
                      id={item.literasi_id} 
                      category={item.kategori} 
                      title={item.judul} 
                      date={new Date(item.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 bg-white rounded-2xl border-dashed border-2 border-slate-200">
                  Belum ada Materi Pokok. Silakan tambah lewat Admin Dashboard.
                </div>
              )}
            </div>

            {/* Bagian 2: BAHAN TAYANG */}
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-violet-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase">
                  Bahan Tayang
                </h2>
              </div>

              {placeholderBahanTayang.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {placeholderBahanTayang.map((item) => (
                    <TayangCard 
                      key={item.literasi_id}
                      id={item.literasi_id} 
                      category={item.kategori} 
                      title={item.judul} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 bg-white rounded-2xl border-dashed border-2 border-slate-200">
                   Belum ada Bahan Tayang terunggah. Input via Admin Dashboard.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Reusable Icon
const BookIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MainCard = ({ id, category, title, date }) => {
  return (
    <Link to={`/literasi/${id}`} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(139,92,246,0.1)] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col h-full border border-gray-100 group relative overflow-hidden block">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 border border-violet-100 group-hover:bg-violet-500 transition-colors duration-300">
        <BookIcon className="w-7 h-7 text-violet-600 group-hover:text-white transition-colors duration-300" />
      </div>
      
      <div className="mb-3">
        <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
          {category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 leading-snug mb-6 flex-grow group-hover:text-violet-600 transition-colors duration-300">
        {title}
      </h3>
      
      <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50">
        <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </span>
        <span className="text-sm font-bold text-violet-600 group-hover:text-violet-700 flex items-center gap-1.5">
          Baca / Tonton <span className="group-hover:translate-x-1 transition-transform inline-block duration-300">&rarr;</span>
        </span>
      </div>
    </Link>
  );
};

const TayangCard = ({ id, category, title }) => {
  return (
    <Link to={`/literasi/${id}`} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgb(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full border border-gray-100 group relative overflow-hidden block">
      
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

      <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4 relative z-10 border border-violet-100 group-hover:bg-violet-500 transition-colors duration-300">
        <BookIcon className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors duration-300" />
      </div>
      
      <div className="mb-2 relative z-10">
        <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest leading-none block">
          {category}
        </span>
      </div>
      
      <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-5 flex-grow relative z-10 group-hover:text-violet-600 transition-colors duration-300">
        {title}
      </h3>
      
      <div className="mt-auto flex justify-end relative z-10">
        <span className="text-xs font-bold text-violet-600 bg-violet-50/50 group-hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
          Akses <span className="group-hover:translate-x-1 transition-transform inline-block duration-300">&rarr;</span>
        </span>
      </div>
    </Link>
  );
};

export default Literasi;
