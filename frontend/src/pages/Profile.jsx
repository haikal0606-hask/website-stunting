import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // States untuk mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', email: '', asal_sekolah: '' });
  const [schoolsList, setSchoolsList] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Harap masuk (Login) terlebih dahulu.');

        const res = await fetch('http://localhost:5000/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
           throw new Error(data.message || 'Gagal mengambil data riwayat profil.');
        }

        if (data.success && data.data) {
           setProfileData(data.data);
        }
      } catch (err) {
         setErrorMsg(err.message);
      } finally {
         setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Menarik riwayat akademis Anda...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
         <div>
           <div className="inline-block bg-rose-100 text-rose-500 p-4 rounded-full mb-4">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <h2 className="text-2xl font-black text-slate-800 mb-2">Terjadi Kesalahan Kesistem</h2>
           <p className="text-slate-500 font-medium mb-6">{errorMsg}</p>
           <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors">Masuk Ulang</Link>
         </div>
      </div>
    );
  }

  const handleEditClick = async () => {
    setEditForm({ 
      nama: profileData.nama || '', 
      email: profileData.email || '', 
      asal_sekolah: profileData.asal_sekolah || '' 
    });
    setIsEditing(true);

    if (schoolsList.length === 0) {
      try {
        const res = await fetch('http://localhost:5000/api/schools');
        const data = await res.json();
        if (data.success) {
          setSchoolsList(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data sekolah", err);
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.message || 'Gagal memperbarui profil.');
      }

      if (data.success) {
         setProfileData((prev) => ({
            ...prev,
            nama: data.data.nama,
            email: data.data.email,
            asal_sekolah: data.data.asal_sekolah
         }));
         setIsEditing(false);
         
         // Update info di localstorage agar navbar ter-update
         const storedUser = JSON.parse(localStorage.getItem('user'));
         if (storedUser) {
            localStorage.setItem('user', JSON.stringify({ ...storedUser, nama: data.data.nama }));
            window.dispatchEvent(new Event('storage')); // Trigger update ke komponen lain
         }
      }
    } catch (err) {
       alert(err.message);
    } finally {
       setUpdateLoading(false);
    }
  };

  const { nama, email, asal_sekolah, role, quizHistory } = profileData;

  // Menentukan rata-rata nilai riwayat kuis
  const totalScore = quizHistory?.reduce((acc, curr) => acc + curr.skor, 0) || 0;
  const avgScore = quizHistory?.length > 0 ? Math.round(totalScore / quizHistory.length) : 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner Peringatan Asal Sekolah */}
        {!asal_sekolah && !isEditing && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 shadow-sm animate-fade-in-up">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-full shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-amber-800 font-black text-xl mb-2">Informasi Asal Sekolah Belum Lengkap!</h3>
              <p className="text-amber-700 font-medium mb-4">Harap lengkapi data asal sekolah Anda agar dapat mengikuti kuis evaluasi dan membantu kami dalam pendataan pencegahan stunting.</p>
              <button onClick={handleEditClick} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors border-b-2 border-amber-600 active:scale-95">
                Lengkapi Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Banner Profil Identitas */}
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-indigo-100/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden animate-fade-in-up">
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-20 -mt-20 z-0 opacity-60"></div>
           
           <div className="w-32 h-32 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-lg shrink-0 z-10 border-4 border-white">
              {nama?.charAt(0).toUpperCase()}
           </div>
           
           <div className="flex-1 text-center md:text-left z-10 w-full">
              {isEditing ? (
                 <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg bg-white/90 p-5 rounded-2xl backdrop-blur-sm border border-slate-100">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                      <input type="text" required value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Email</label>
                      <input type="email" required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Asal Sekolah</label>
                      <select required value={editForm.asal_sekolah} onChange={e => setEditForm({...editForm, asal_sekolah: e.target.value})} className="w-full border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none">
                         <option value="" disabled>Pilih Sekolah...</option>
                         {schoolsList.map(school => (
                            <option key={school.school_id} value={school.nama_sekolah}>{school.nama_sekolah}</option>
                         ))}
                      </select>
                      {schoolsList.length === 0 && <p className="text-xs text-rose-500 mt-1">Gagal memuat daftar sekolah.</p>}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold text-sm hover:bg-slate-200 transition-colors">Batal</button>
                      <button type="submit" disabled={updateLoading} className="flex-1 py-2 rounded-xl text-white bg-indigo-600 font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md">{updateLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                    </div>
                 </form>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                         <h1 className="text-3xl font-black text-slate-800">{nama}</h1>
                         {role === 'Admin' && (
                            <span className="bg-rose-50 text-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-lg border border-rose-100">Administrator</span>
                         )}
                      </div>
                      <button onClick={handleEditClick} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 text-indigo-600 font-bold py-2 px-5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm shrink-0">
                         Edit Profil
                      </button>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-6 bg-slate-50 p-3 rounded-xl w-fit mx-auto md:mx-0 border border-slate-100">
                     <div className="flex items-center text-slate-600 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        {email}
                     </div>
                     <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                     <div className="flex items-center text-slate-600 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        {asal_sekolah}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
                      <div className="bg-indigo-50 p-4 rounded-2xl text-center border border-indigo-100">
                          <span className="block text-indigo-400 text-xs font-bold uppercase mb-1">Rata-Rata Nilai</span>
                          <span className="text-3xl font-black text-indigo-700">{avgScore}</span>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
                          <span className="block text-emerald-500 text-xs font-bold uppercase mb-1">Kuis Dikerjakan</span>
                          <span className="text-3xl font-black text-emerald-700">{quizHistory?.length || 0}</span>
                      </div>
                  </div>
                </>
              )}
           </div>
        </div>

        {/* Tabel Riwayat Kuis */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-8 sm:p-10 border border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-slate-800 flex items-center">
                 <svg className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Riwayat Pengerjaan Evaluasi
               </h2>
               <Link to="/quiz" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  Kerjakan Kuis Lain
               </Link>
            </div>
            
            {quizHistory && quizHistory.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                           <tr className="bg-slate-50 text-slate-500 text-sm font-bold uppercase tracking-wider border-b border-slate-100">
                               <th className="py-4 px-6 rounded-tl-xl w-8">#</th>
                               <th className="py-4 px-6">ID Riwayat</th>
                               <th className="py-4 px-6">Tanggal & Waktu</th>
                               <th className="py-4 px-6 rounded-tr-xl text-right">Perolehan Skor</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                           {quizHistory.map((history, idx) => (
                              <tr key={history.result_id} className="hover:bg-indigo-50/30 transition-colors group">
                                  <td className="py-4 px-6 text-slate-400 font-medium">{idx + 1}</td>
                                  <td className="py-4 px-6">
                                     <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 group-hover:bg-white transition-colors">{history.result_id}</span>
                                  </td>
                                  <td className="py-4 px-6 font-medium text-slate-600">
                                     {new Date(history.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="py-4 px-6 text-right">
                                     <span className={`inline-flex font-black text-lg px-4 py-1.5 rounded-xl border ${
                                       history.skor >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                     }`}>
                                        {history.skor}
                                     </span>
                                  </td>
                              </tr>
                           ))}
                       </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Riwayat Kosong</h3>
                    <p className="text-slate-500 font-medium">Anda belum pernah menyelesaikan satupun evaluasi kuis sejauh ini.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
