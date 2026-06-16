import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

// Komponen internal untuk render konten BlockNote (read-only)
const ArticleContentRenderer = ({ content }) => {
  const editor = useCreateBlockNote({
    initialContent: content && content.length > 0 ? content : undefined,
  });

  return (
    <div className="prose max-w-none">
      <BlockNoteView
        editor={editor}
        editable={false}
        theme="light"
      />
    </div>
  );
};

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/articles/${id}`);
        const data = await res.json();

        if (data.success && data.data) {
          setArticle(data.data);
        }
      } catch (err) {
        console.error('Gagal mengambil detail artikel:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-pulse space-y-4 max-w-2xl w-full px-6">
          <div className="h-4 w-32 bg-indigo-200 rounded"></div>
          <div className="h-10 w-full bg-slate-200 rounded"></div>
          <div className="h-64 w-full bg-slate-100 rounded mt-8"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Artikel Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-8">Maaf, artikel yang Anda cari mungkin sudah dihapus atau linknya salah.</p>
        <Link to="/articles" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
          Kembali ke Artikel
        </Link>
      </div>
    );
  }

  const hasContent = article.content && article.content.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Background decorative header */}
      <div className="w-full h-80 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-600 absolute top-0 rounded-b-[4rem] z-0"></div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 animate-fade-in-up">
        {/* Breadcrumbs Navigation */}
        <Link to="/articles" className="inline-flex items-center text-indigo-100 hover:text-white font-semibold transition-colors mb-12">
          <span className="mr-2">&larr;</span> Kembali ke Daftar Artikel
        </Link>

        {/* Article Paper Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">

          {/* Article Header */}
          <div className="px-8 md:px-14 pt-12 pb-8 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-400">
              {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mt-3 drop-shadow-sm">
              {article.judul}
            </h1>
            {article.excerpt && (
              <p className="text-slate-500 text-lg mt-4 leading-relaxed font-medium">{article.excerpt}</p>
            )}
          </div>

          {/* Article Body - BlockNote Renderer */}
          <div className="px-4 md:px-10 py-8">
            {hasContent ? (
              <ArticleContentRenderer content={article.content} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className="text-slate-400 font-medium">Konten artikel belum tersedia.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
