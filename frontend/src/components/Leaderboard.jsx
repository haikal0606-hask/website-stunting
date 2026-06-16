import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/quizzes/leaderboard');
        const data = await res.json();
        if (data.success) {
          setLeaderboardData(data.data);
        }
      } catch (err) {
        console.error("Gagal memuat leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-100 mb-12 flex justify-center items-center h-48">
         <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (leaderboardData.length === 0) return null;

  return (
    <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 mb-12 animate-fade-in-up relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -mr-20 -mt-20 z-0"></div>

      <div className="flex items-center mb-10 relative z-10">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mr-5 shadow-sm border border-indigo-200">
           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Grafik Rata-Rata Pemahaman per Sekolah</h2>
      </div>

      <div className="space-y-6 relative z-10">
        {leaderboardData.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group">
            <div className="w-full sm:w-48 text-left sm:text-right text-sm font-bold text-slate-700 truncate tracking-wide">
              {item.sekolah}
            </div>
            
            <div className="flex-1 h-10 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200 group-hover:shadow-md transition-shadow">
              <div 
                className="h-full bg-indigo-200 border-r-4 border-indigo-400 transition-all duration-1000 ease-out flex items-center" 
                style={{ width: `${Math.max(item.avgSkor, 5)}%` }}
              >
                 <span className="ml-4 text-sm font-black text-indigo-800 drop-shadow-sm">{item.avgSkor}</span>
              </div>
            </div>
            
            <div className="w-auto sm:w-28 text-right text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-700">{item.totalSiswa} Siswa</div>
              {item.avgWaktu > 0 && <div className="text-[10px] text-slate-400 mt-0.5" title="Rata-rata Waktu Pengerjaan">{Math.floor(item.avgWaktu/60)}m {item.avgWaktu%60}s</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
