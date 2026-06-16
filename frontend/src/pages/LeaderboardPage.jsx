import React from 'react';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 relative selection:bg-indigo-100 font-sans pb-20">
      {/* Decorative background header */}
      <div className="w-full h-64 bg-indigo-600 absolute top-0 rounded-b-[3rem] z-0 shadow-lg border-b-8 border-indigo-700"></div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 animate-fade-in-up">
        
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-md tracking-tight">Papan Peringkat Sekolah</h1>
          <p className="text-indigo-100 font-medium text-lg max-w-2xl mx-auto">Pantau tingkat literasi gizi rata-rata dari berbagai sekolah berdasarkan hasil evaluasi kuis.</p>
        </div>

        {/* Grafik Leaderboard untuk Publik */}
        <Leaderboard />

      </div>
    </div>
  );
};

export default LeaderboardPage;
