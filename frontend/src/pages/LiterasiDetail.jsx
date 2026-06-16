import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const LiterasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/literasi/${id}`);
        const result = await res.json();
        
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setData(null); // Not found
        }
      } catch (err) {
        console.error("Gagal mendapatkan detail", err);
      } finally {
         setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const renderVideoPlayer = () => {
    if (!data?.video_url) return null;

    let videoSource = data.video_url;

    if (data.tipe_video === 'youtube') {
      // Auto-format YouTube links (watch?v= atau youtu.be) menjadi format embed yang diizinkan iFrame
      try {
        if (videoSource.includes('watch?v=')) {
          const urlParams = new URL(videoSource);
          const videoId = urlParams.searchParams.get('v');
          if (videoId) videoSource = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoSource.includes('youtu.be/')) {
          const videoId = videoSource.split('youtu.be/')[1].split('?')[0];
          if (videoId) videoSource = `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (e) {
        console.error("Invalid YouTube URL", e);
      }
    } else if (data.tipe_video === 'internal') {
      // Tambahkan alamat host backend untuk file internal lokal
      videoSource = `http://localhost:5000${data.video_url}`;
    }

    if (data.tipe_video === 'youtube') {
      return (
        <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-900 ring-4 ring-indigo-50/50">
          <iframe 
            src={videoSource} 
            title={data.judul}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      );
    } else {
      return (
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-900 ring-4 ring-indigo-50/50 flex justify-center items-center">
          <video 
            src={videoSource} 
            controls 
            className="w-full h-auto max-h-[600px] object-contain"
            controlsList="nodownload"
          >
            Browser Anda tidak mendukung elemen video.
          </video>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center items-center">
        <div className="animate-pulse flex flex-col space-y-6 w-full max-w-4xl">
          <div className="h-4 w-32 bg-indigo-200 rounded-full"></div>
          <div className="h-12 w-3/4 bg-slate-200 rounded-lg"></div>
          <div className="h-[400px] w-full bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
         <h2 className="text-3xl font-bold text-slate-800 mb-4">Materi Tidak Ditemukan</h2>
         <p className="text-slate-500 mb-8">Maaf, literasi yang Anda cari mungkin sudah dihapus atau ditarik.</p>
         <Link to="/literasi" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
           Kembali ke Pusat Edukasi
         </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* Decorative Header Background */}
      <div className="w-full h-64 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 absolute top-0 z-0 rounded-b-[3rem]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-fade-in-up">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/literasi" className="inline-flex items-center text-indigo-100 hover:text-white font-semibold transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
            <span className="mr-2">&larr;</span> Kembali ke Pusat Edukasi
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-indigo-100/50 border border-slate-100">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <span className="bg-violet-100 text-violet-700 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest inline-block w-max">
              {data.kategori}
            </span>
            <span className="text-sm font-semibold text-slate-400 flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Dipublikasikan: {new Date(data.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-10">
            {data.judul}
          </h1>

          {/* Video Player Section */}
          <div className="mb-12">
            {renderVideoPlayer()}
          </div>

          {/* Text Content */}
          <div className="prose prose-lg prose-indigo max-w-none">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Deskripsi Materi</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {data.konten}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiterasiDetail;
