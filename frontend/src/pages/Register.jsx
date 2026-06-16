import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    asal_sekolah: '',
    wilayah: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal, silakan periksa data Anda.');
      }

      if (data.success && data.data.token) {
        // Simpan token & user
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          user_id: data.data.user_id,
          nama: data.data.nama,
          role: data.data.role
        }));
        // Redirect ke home
        window.location.href = '/';
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-indigo-100/40 p-8 sm:p-12 border border-slate-100 animate-fade-in-up relative overflow-hidden">
        
        {/* Dekorasi */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-rose-50 rounded-full blur-2xl z-0"></div>

        <div className="relative z-10">
           <div className="text-center mb-8">
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">Buat Akun Baru</h2>
             <p className="text-slate-500 mt-2 font-medium">Bergabunglah dalam pergerakan literasi pencegahan stunting.</p>
           </div>

           {errorMsg && (
             <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center">
               <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {errorMsg}
             </div>
           )}

           <form onSubmit={handleRegister} className="space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                 <input 
                   type="text" 
                   name="nama"
                   value={formData.nama}
                   onChange={handleInputChange}
                   required
                   className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                   placeholder="John Doe"
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
                 <input 
                   type="email" 
                   name="email"
                   value={formData.email}
                   onChange={handleInputChange}
                   required
                   className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                   placeholder="nama@email.com"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
               <input 
                 type="password" 
                 name="password"
                 value={formData.password}
                 onChange={handleInputChange}
                 required
                 className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                 placeholder="Buat sandi yang aman"
               />
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Asal Sekolah / Instansi</label>
                 <input 
                   type="text" 
                   name="asal_sekolah"
                   value={formData.asal_sekolah}
                   onChange={handleInputChange}
                   required
                   className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                   placeholder="Mis: SMAN 1 Banda Aceh"
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Area / Wilayah</label>
                 <input 
                   type="text" 
                   name="wilayah"
                   value={formData.wilayah}
                   onChange={handleInputChange}
                   required
                   className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                   placeholder="Mis: Banda Aceh"
                 />
               </div>
             </div>

             <div className="pt-4">
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all border-b-2 border-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
               >
                 {loading ? 'Memproses Pendaftaran...' : 'Daftar Akun'}
               </button>
             </div>
           </form>

           <div className="mt-8 text-center border-t border-slate-100 pt-6">
             <p className="text-slate-500 text-sm font-medium">
               Sudah memiliki akun?{' '}
               <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                 Masuk di Sini
               </Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
