import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/articles');
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          setArticles(data.data);
        } else {
          // Fallback dummy data jika DB kosong
          setArticles([
            {
              article_id: 'A-001',
              judul: '1000 Hari Pertama Kehidupan (HPK) Penentu Masa Depan Anak',
              createdAt: new Date().toISOString()
            },
            {
              article_id: 'A-002',
              judul: 'Pentingnya Tablet Tambah Darah bagi Remaja Putri',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              article_id: 'A-003',
              judul: 'Sanitasi dan Lingkungan Bebas Jentik Ciptakan Keluarga Sehat',
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Gagal mengambil artikel:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-indigo-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-down">

        {/* Header Navigation */}
        <div className="flex justify-between items-center relative z-10 w-full mb-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm text-indigo-600 font-bold hover:bg-gray-50 transition-colors text-sm no-underline">
            <span className="text-lg leading-none">&larr;</span> Kembali
          </Link>
          <div className="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-xs tracking-wider uppercase shadow-sm">
            Edukasi
          </div>
        </div>

        {/* Header Section */}
        <div className="text-left space-y-4 relative w-full md:w-3/4 pb-4">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight relative z-10 drop-shadow-sm">
            Pusat Literasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Stunting</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 leading-relaxed relative z-10 pt-2 font-medium">
            Pahami lebih dalam mengenai cara pencegahan, asupan gizi, dan fakta seputar stunting demi menyiapkan generasi penerus yang cemerlang.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
          {articles.map((article, index) => (
            <Link
              to={`/articles/${article.article_id}`}
              key={article.article_id}
              className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col h-full border border-gray-100 group no-underline outline-none"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Top row: Icon */}
              <div className="flex justify-between items-start mb-6 w-full">
                <div className="w-14 h-14 bg-indigo-50/50 rounded-2xl flex items-center justify-center border border-indigo-50 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-indigo-100 bg-indigo-500 px-3 py-1 rounded-full">Artikel</span>
              </div>

              <h2 className="text-[17px] md:text-xl font-bold text-slate-800 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
                {article.judul}
              </h2>

              {article.excerpt && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-grow">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                  Baca <span className="group-hover:translate-x-1 transition-transform inline-block duration-300">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}

          {articles.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">Belum ada artikel yang tersedia.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Articles;
