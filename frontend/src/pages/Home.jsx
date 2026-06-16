import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/30 overflow-hidden relative">
      
      {/* Decorative Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -ml-20 -mt-20"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-rose-200/30 rounded-full blur-3xl -mr-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 flex-grow z-10">
        
        {/* Left Content Area */}
        <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in-up">
          
          <div className="inline-flex items-center space-x-2 bg-indigo-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200/50 shadow-sm">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">Gerakan Anti Stunting 2026</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] drop-shadow-sm">
            Masa Depan <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
              Bebas Stunting
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
            Platform literasi interaktif Banda Aceh. Pahami nutrisi, pelajari risikonya, dan jadilah pahlawan pencegah stunting sejak dari 1000 Hari Pertama Kehidupan.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
            <Link to="/literasi" className="w-full sm:w-auto bg-white text-indigo-700 border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50 font-black py-4 px-8 rounded-2xl transition-all shadow-sm flex items-center justify-center group no-underline text-center">
              <svg className="w-5 h-5 mr-3 text-indigo-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Edukasi
            </Link>
            <Link to="/quiz" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-2 border-transparent hover:from-indigo-700 hover:to-indigo-900 font-black py-4 px-8 rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center group no-underline text-center transform hover:-translate-y-1">
              <svg className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              Coba Kuis
            </Link>
          </div>

        </div>

        {/* Right Image Area */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-fade-in-down">
           {/* Static Floating Card */}
           <div className="absolute top-10 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-indigo-50 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prevalensi</p>
                <p className="text-xl font-black text-slate-800">24.4%</p>
              </div>
           </div>

           <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-900/20 border-[8px] border-white z-10 w-full aspect-[4/3] bg-indigo-100">
             <img src="/hero-banner.png" alt="Generasi Bebas Stunting" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
           </div>

           {/* Floating Pattern behind image */}
           <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-600 rounded-[3rem] opacity-10 -rotate-6 z-0"></div>
        </div>

      </div>

    </div>
  );
};

export default Home;
