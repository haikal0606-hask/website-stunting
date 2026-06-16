import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import ArticleEditor from '../components/ArticleEditor';
import Leaderboard from '../components/Leaderboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('artikel'); // 'artikel', 'kuis', 'literasi'
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [articles, setArticles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [literasiList, setLiterasiList] = useState([]);
  const [schools, setSchools] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' atau 'edit'
  
  // Forms State
  const [articleForm, setArticleForm] = useState({ id: '', judul: '' });
  const [articleContent, setArticleContent] = useState([]); // BlockNote JSON content
  const handleArticleContentChange = useCallback((blocks) => {
    setArticleContent(blocks);
  }, []);
  const [quizForm, setQuizForm] = useState({ id: '', pertanyaan: '', opsiA: '', opsiB: '', opsiC: '', opsiD: '', kunci_jawaban: '' });
  const [schoolForm, setSchoolForm] = useState({ id: '', nama_sekolah: '' });
  
  // Form Literasi dengan penanganan File
  const [literasiForm, setLiterasiForm] = useState({
    id: '', tipe_kelompok: 'Materi Pokok', kategori: '', judul: '', konten: '', tipe_video: 'youtube', video_url: ''
  });
  const [videoFile, setVideoFile] = useState(null); // Menampung file fisik

  const token = localStorage.getItem('token');

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'artikel') {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/articles');
        const data = await res.json();
        if (data.success) setArticles(data.data);
      } else if (activeTab === 'kuis') {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/quizzes/admin', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setQuizzes(data.data);
      } else if (activeTab === 'literasi') {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/literasi');
        const data = await res.json();
        if (data.success) setLiterasiList(data.data);
      } else if (activeTab === 'sekolah') {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/schools');
        const data = await res.json();
        if (data.success) setSchools(data.data);
      } else if (activeTab === 'riwayat-kuis') {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/quizzes/results/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setQuizResults(data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menarik data dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeTab]);

  // Handle Artikel
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const isEdit = modalType === 'edit';
    const url = isEdit 
      ? `/api/articles/${articleForm.id}` 
      : '/api/articles';

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          judul: articleForm.judul,
          content: articleContent
        })
      });
      const data = await res.json();
      if (data.success) {
         fetchData();
         setShowModal(false);
         setArticleContent([]);
      } else {
        alert(data.message || 'Gagal menyimpan artikel');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if(!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Kuis
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    const isEdit = modalType === 'edit';
    const url = isEdit 
      ? `/api/quizzes/${quizForm.id}` 
      : '/api/quizzes';
      
    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pertanyaan: quizForm.pertanyaan,
          opsi: [quizForm.opsiA, quizForm.opsiB, quizForm.opsiC, quizForm.opsiD],
          kunci_jawaban: quizForm.kunci_jawaban
        })
      });
      const data = await res.json();
      if (data.success) {
         fetchData();
         setShowModal(false);
      } else {
        alert(data.message || 'Gagal menyimpan pertanyaan');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if(!window.confirm("Yakin ingin menghapus kuis/soal ini?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Sekolah
  const handleSaveSchool = async (e) => {
    e.preventDefault();
    const isEdit = modalType === 'edit';
    const url = isEdit 
      ? `/api/schools/${schoolForm.id}` 
      : '/api/schools';
      
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nama_sekolah: schoolForm.nama_sekolah })
      });
      const data = await res.json();
      if (data.success) {
         fetchData();
         setShowModal(false);
      } else {
        alert(data.message || 'Gagal menyimpan data sekolah');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchool = async (id) => {
    if(!window.confirm("Yakin ingin menghapus data sekolah ini?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/schools/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Literasi (dengan multipart/form-data)
  const handleSaveLiterasi = async (e) => {
    e.preventDefault();
    const isEdit = modalType === 'edit';
    const url = isEdit 
      ? `/api/literasi/${literasiForm.id}` 
      : '/api/literasi';
      
    const formData = new FormData();
    formData.append('tipe_kelompok', literasiForm.tipe_kelompok);
    formData.append('kategori', literasiForm.kategori);
    formData.append('judul', literasiForm.judul);
    formData.append('konten', literasiForm.konten);
    formData.append('tipe_video', literasiForm.tipe_video);
    
    // Jika youtube, lampirkan URL youtube. Jika Upload Internal, tapi tidak ada file baru (edit), pertahankan yg lama
    if (literasiForm.tipe_video === 'youtube') {
       formData.append('video_url', literasiForm.video_url);
    } else if (literasiForm.tipe_video === 'internal') {
       if (videoFile) {
          formData.append('video_file', videoFile);
       }
       // Jika edit dan tidak ada video baru, string kosong / tak diisi juga aman karena handle via body di backend
       formData.append('video_url', literasiForm.video_url || ''); 
    }

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // TANPA 'Content-Type' ! Fetch otomatis akan setting form-data boundary
        body: formData
      });
      const data = await res.json();
      if (data.success) {
         fetchData();
         setShowModal(false);
         setVideoFile(null); // clear file
      } else {
        alert(data.message || 'Gagal menyimpan literasi');
      }
    } catch(err) {
      console.error(err);
      alert('Terjadi kesalahan unggah/simpankan ke server');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteLiterasi = async (id) => {
    if(!window.confirm("Beneran mau menghapus materi video/literasi ini?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/literasi/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Reset Riwayat Kuis
  const handleResetResults = async () => {
    if(!window.confirm("PERINGATAN: Anda yakin ingin me-reset (menghapus) seluruh riwayat nilai kuis? Semua data evaluasi siswa akan hilang permanen!")) return;
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quizzes/results/reset`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if(data.success) {
         alert("Seluruh riwayat evaluasi berhasil direset!");
         fetchData(); // Refresh both table and leaderboard
      } else {
         alert(data.message || "Gagal mereset data.");
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat mereset data.');
    } finally {
      setLoading(false);
    }
  };

  // Membuka modal Add/Edit
  const openModal = (type, item = null) => {
    setModalType(type);
    
    if (activeTab === 'artikel') {
      if (item) {
        setArticleForm({ id: item.article_id, judul: item.judul });
        setArticleContent(item.content || []);
      } else {
        setArticleForm({ id: '', judul: '' });
        setArticleContent([]);
      }
      
    } else if (activeTab === 'kuis') {
      if (item) setQuizForm({ id: item.quiz_id, pertanyaan: item.pertanyaan, opsiA: item.opsi[0], opsiB: item.opsi[1], opsiC: item.opsi[2], opsiD: item.opsi[3], kunci_jawaban: item.kunci_jawaban });
      else setQuizForm({ id: '', pertanyaan: '', opsiA: '', opsiB: '', opsiC: '', opsiD: '', kunci_jawaban: '' });
      
    } else if (activeTab === 'literasi') {
      setVideoFile(null);
      if (item) {
        setLiterasiForm({ 
           id: item.literasi_id, 
           tipe_kelompok: item.tipe_kelompok, 
           kategori: item.kategori, 
           judul: item.judul, 
           konten: item.konten, 
           tipe_video: item.tipe_video, 
           video_url: item.video_url 
        });
      } else {
        setLiterasiForm({ id: '', tipe_kelompok: 'Materi Pokok', kategori: '', judul: '', konten: '', tipe_video: 'youtube', video_url: '' });
      }
    } else if (activeTab === 'sekolah') {
      if (item) setSchoolForm({ id: item.school_id, nama_sekolah: item.nama_sekolah });
      else setSchoolForm({ id: '', nama_sekolah: '' });
    }
    
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 sm:p-10">
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Panel CMS Administrator</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola publikasi artikel, literasi video, dan bank soal.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex">
           <button 
             onClick={() => setActiveTab('artikel')}
             className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'artikel' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Artikel Blog
           </button>
           <button 
             onClick={() => setActiveTab('literasi')}
             className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'literasi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Pusat Literasi & Video
           </button>
           <button 
             onClick={() => setActiveTab('kuis')}
             className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'kuis' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Bank Soal
           </button>
           <button 
             onClick={() => setActiveTab('sekolah')}
             className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'sekolah' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Data Sekolah
           </button>
           <button 
             onClick={() => setActiveTab('riwayat-kuis')}
             className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'riwayat-kuis' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Riwayat Kuis
           </button>
        </div>
      </div>

      {loading && !showModal ? (
         <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-fade-in-up">
           
           <div className="p-6 sm:p-8 flex justify-between items-center bg-slate-50 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-700 flex items-center">
                 {activeTab === 'artikel' && 'Daftar Artikel'}
                 {activeTab === 'kuis' && 'Daftar Pertanyaan'}
                 {activeTab === 'literasi' && 'File Video Edukasi'}
                 {activeTab === 'sekolah' && 'Daftar Sekolah'}
                 {activeTab === 'riwayat-kuis' && 'Riwayat Evaluasi Siswa'}
                 <span className="ml-3 bg-indigo-100 text-indigo-700 py-0.5 px-3 rounded-full text-xs font-black">
                   {activeTab === 'artikel' ? articles.length : activeTab === 'kuis' ? quizzes.length : activeTab === 'sekolah' ? schools.length : activeTab === 'riwayat-kuis' ? quizResults.length : literasiList.length} Total
                 </span>
              </h2>
              {activeTab !== 'riwayat-kuis' && (
                <button onClick={() => openModal('add')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2">
                   Entri Baru
                </button>
              )}
           </div>

           <div className="overflow-x-auto">
             


             {activeTab === 'artikel' && (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4">Judul Artikel</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {articles.map((art) => (
                      <tr key={art.article_id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-700">{art.judul}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openModal('edit', art)} className="text-amber-500 font-semibold text-sm">Edit</button>
                          <button onClick={() => handleDeleteArticle(art.article_id)} className="text-rose-500 font-semibold text-sm ml-2">Hapus</button>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && <tr><td colSpan="2" className="text-center py-10 text-slate-500">KOSONG.</td></tr>}
                  </tbody>
                </table>
             )}

             {activeTab === 'kuis' && (
                 // Tabel kuis
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4 w-1/2">Soal</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quizzes.map((q) => (
                      <tr key={q.quiz_id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-700">{q.pertanyaan}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openModal('edit', q)} className="text-amber-500 text-sm">Edit</button>
                          <button onClick={() => handleDeleteQuiz(q.quiz_id)} className="text-rose-500 text-sm ml-2">Hapus</button>
                        </td>
                      </tr>
                    ))}
                    {quizzes.length === 0 && <tr><td colSpan="2" className="text-center py-10">KOSONG.</td></tr>}
                  </tbody>
                </table>
             )}

             {activeTab === 'literasi' && (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4">Kelompok</th>
                      <th className="px-6 py-4">Video Type</th>
                      <th className="px-6 py-4">Judul Info</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {literasiList.map((lit) => (
                      <tr key={lit.literasi_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{lit.tipe_kelompok}</span></td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-md font-bold uppercase ${lit.tipe_video === 'youtube' ? 'bg-red-50 text-red-600' : 'bg-slate-200 text-slate-700'}`}>{lit.tipe_video}</span></td>
                        <td className="px-6 py-4 font-medium text-slate-700">{lit.judul}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openModal('edit', lit)} className="text-amber-500 font-semibold text-sm">Edit</button>
                          <button onClick={() => handleDeleteLiterasi(lit.literasi_id)} className="text-rose-500 font-semibold text-sm ml-2">Hapus</button>
                        </td>
                      </tr>
                    ))}
                    {literasiList.length === 0 && <tr><td colSpan="4" className="text-center py-10 text-slate-500">Belum ada video/literasi.</td></tr>}
                  </tbody>
                </table>
             )}

             {activeTab === 'sekolah' && (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4">Nama Sekolah</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schools.map((school) => (
                      <tr key={school.school_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">{school.nama_sekolah}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openModal('edit', school)} className="text-amber-500 font-semibold text-sm">Edit</button>
                          <button onClick={() => handleDeleteSchool(school.school_id)} className="text-rose-500 font-semibold text-sm ml-2">Hapus</button>
                        </td>
                      </tr>
                    ))}
                    {schools.length === 0 && <tr><td colSpan="2" className="text-center py-10 text-slate-500">Data sekolah masih kosong.</td></tr>}
                  </tbody>
                </table>
             )}

             {activeTab === 'riwayat-kuis' && (
                <>
                  <div className="mb-4 flex justify-between items-center px-6 pt-4">
                     <div>
                        <h3 className="font-bold text-slate-700">Manajemen Evaluasi</h3>
                        <p className="text-sm text-slate-500">Nilai akhir: (Jawaban Benar / Total Soal) × 100</p>
                     </div>
                     <button onClick={handleResetResults} className="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-4 py-2 rounded-xl font-bold border border-rose-100 hover:border-rose-500 shadow-sm transition-all flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Reset Semua Nilai
                     </button>
                  </div>
                  <div className="mb-8">
                     <Leaderboard />
                  </div>
                  <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4 rounded-tl-lg">Nama Siswa</th>
                      <th className="px-6 py-4">Asal Sekolah</th>
                      <th className="px-6 py-4">Waktu Penyelesaian</th>
                      <th className="px-6 py-4 text-center">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quizResults.map((result) => (
                      <tr key={result.result_id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-700">{result.userDetails?.nama || 'Unknown'}</div>
                           <div className="text-xs text-slate-400 font-mono mt-1">{result.result_id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                           {result.userDetails?.asal_sekolah ? (
                              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs">{result.userDetails.asal_sekolah}</span>
                           ) : (
                              <span className="text-slate-400 italic">Belum diatur</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                           {new Date(result.createdAt).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`inline-flex items-center justify-center font-black text-lg w-12 h-12 rounded-xl border-2 ${
                             result.skor >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                           }`}>
                             {result.skor}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {quizResults.length === 0 && <tr><td colSpan="4" className="text-center py-10 text-slate-500 font-medium">Belum ada user yang menyelesaikan kuis.</td></tr>}
                  </tbody>
                </table>
                </>
             )}
           </div>
        </div>
      )}

      {/* Modal Interaktif */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className={`bg-white rounded-3xl shadow-2xl w-full ${activeTab === 'artikel' ? 'max-w-5xl' : 'max-w-2xl'} max-h-[95vh] overflow-y-auto relative z-10 animate-fade-in-up`}>
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur z-20">
              <h3 className="text-xl font-black text-slate-800">
                 {modalType === 'add' ? 'Entri Baru' : 'Perubahan Entri'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                 × Tutup
              </button>
            </div>

            <div className="p-6 sm:p-8">
              
              {activeTab === 'literasi' && (
                  <form onSubmit={handleSaveLiterasi} className="space-y-5" encType="multipart/form-data">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Penempatan Menu</label>
                         <select required value={literasiForm.tipe_kelompok} onChange={e => setLiterasiForm({...literasiForm, tipe_kelompok: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-violet-500/20 text-sm">
                            <option value="Materi Pokok">Materi Pokok (Atas, 3 Kartu)</option>
                            <option value="Bahan Tayang">Bahan Tayang (Grid Reguler)</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Label Kategori</label>
                         <input type="text" required placeholder="Contoh: MPASI, Video Edukasi" value={literasiForm.kategori} onChange={e => setLiterasiForm({...literasiForm, kategori: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-violet-500/20 text-sm" />
                       </div>
                     </div>

                     <div>
                       <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Judul Tampilan</label>
                       <input type="text" required value={literasiForm.judul} onChange={e => setLiterasiForm({...literasiForm, judul: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-violet-500/20 text-sm" placeholder="Judul Video/Materi Utama" />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Penjelasan / Deskripsi Lengkap</label>
                       <textarea required rows="4" value={literasiForm.konten} onChange={e => setLiterasiForm({...literasiForm, konten: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-violet-500/20 text-sm" placeholder="Materi tentang ini adalah..."></textarea>
                     </div>

                     <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                        <label className="block text-sm font-bold tracking-wide text-violet-900 mb-3">Tipe Ekstensi Player</label>
                        <div className="flex gap-4 mb-4">
                           <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                              <input type="radio" name="video_type" value="youtube" checked={literasiForm.tipe_video === 'youtube'} onChange={() => setLiterasiForm({...literasiForm, tipe_video: 'youtube'})} className="w-4 h-4 text-violet-600" />
                              Link YouTube
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                              <input type="radio" name="video_type" value="internal" checked={literasiForm.tipe_video === 'internal'} onChange={() => setLiterasiForm({...literasiForm, tipe_video: 'internal'})} className="w-4 h-4 text-violet-600" />
                              Unggah Lokal (Data Internal)
                           </label>
                        </div>

                        {literasiForm.tipe_video === 'youtube' ? (
                          <input type="url" value={literasiForm.video_url} onChange={e => setLiterasiForm({...literasiForm, video_url: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 focus:outline-none text-sm focus:border-violet-500" placeholder="https://www.youtube.com/embed/XXXXX" required />
                        ) : (
                          <div className="space-y-3">
                             {literasiForm.video_url && modalType === 'edit' && (
                               <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded inline-block">Sudah ada file yang terunggah (biarkan kosong jika tidak ingin diubah)</p>
                             )}
                             <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} className="w-full bg-white border border-slate-200 rounded-lg py-2 focus:outline-none text-sm text-slate-500 cursor-pointer p-2 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                          </div>
                        )}
                     </div>


                     <div className="pt-4 flex justify-end">
                       <button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
                          {loading ? 'Mengunggah...' : 'Simpan Konten Baru'}
                       </button>
                     </div>
                  </form>
              )}

              {activeTab === 'artikel' && (
               <form onSubmit={handleSaveArticle} className="space-y-5">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Judul Artikel</label>
                     <input 
                       type="text" 
                       required 
                       placeholder="Masukkan judul artikel..."
                       value={articleForm.judul} 
                       onChange={(e) => setArticleForm({...articleForm, judul: e.target.value})} 
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg font-bold rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400" 
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Konten Artikel</label>
                     <p className="text-xs text-slate-400 mb-3">Gunakan editor di bawah untuk menulis artikel. Ketik '/' untuk menambah blok baru (heading, gambar, list, dll).</p>
                     <ArticleEditor
                       key={articleForm.id || 'new'}
                       initialContent={articleContent.length > 0 ? articleContent : undefined}
                       onChange={handleArticleContentChange}
                     />
                   </div>
                   <div className="pt-4 flex justify-end gap-3">
                     <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors">Batal</button>
                     <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">{loading ? 'Menyimpan...' : 'Publikasikan Artikel'}</button>
                   </div>
               </form>
              )}
              {activeTab === 'kuis' && (
                <form onSubmit={handleSaveQuiz} className="space-y-5">
                 <div>
                   <label className="block text-sm font-bold mb-2">Pertanyaan Kuis</label>
                   <textarea required value={quizForm.pertanyaan} onChange={(e) => setQuizForm({...quizForm, pertanyaan: e.target.value})} rows="3" className="w-full border-slate-200 rounded-xl py-3 px-4 outline-none bg-slate-50"></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Opsi 1" value={quizForm.opsiA} onChange={(e) => setQuizForm({...quizForm, opsiA: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg py-3 px-3 bg-slate-50" />
                    <input type="text" required placeholder="Opsi 2" value={quizForm.opsiB} onChange={(e) => setQuizForm({...quizForm, opsiB: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg py-3 px-3 bg-slate-50" />
                    <input type="text" required placeholder="Opsi 3" value={quizForm.opsiC} onChange={(e) => setQuizForm({...quizForm, opsiC: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg py-3 px-3 bg-slate-50" />
                    <input type="text" required placeholder="Opsi 4" value={quizForm.opsiD} onChange={(e) => setQuizForm({...quizForm, opsiD: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg py-3 px-3 bg-slate-50" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold mb-2">Kunci Jawaban (Ketik Opsi yang Benar)</label>
                   <input type="text" required value={quizForm.kunci_jawaban} onChange={(e) => setQuizForm({...quizForm, kunci_jawaban: e.target.value})} className="w-full border-slate-200 rounded-xl py-3 px-4 outline-none bg-slate-50" />
                 </div>
                 <div className="pt-4 flex justify-end"><button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl">Simpan Soal</button></div>
               </form>
              )}
              {activeTab === 'sekolah' && (
                <form onSubmit={handleSaveSchool} className="space-y-5">
                 <div>
                   <label className="block text-sm font-bold mb-2">Nama Sekolah / Instansi</label>
                   <input type="text" required placeholder="Contoh: SMAN 1 Jakarta" value={schoolForm.nama_sekolah} onChange={(e) => setSchoolForm({...schoolForm, nama_sekolah: e.target.value})} className="w-full border-slate-200 rounded-xl py-3 px-4 outline-none bg-slate-50" />
                 </div>
                 <div className="pt-4 flex justify-end">
                   <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
                     {loading ? 'Menyimpan...' : 'Simpan Data'}
                   </button>
                 </div>
               </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
