import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login gagal, periksa kredensial Anda');
      }

      if (data.success && data.data.token) {
        // Simpan token & user
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          user_id: data.data.user_id,
          nama: data.data.nama,
          role: data.data.role
        }));
        // Redirect ke home (memaksa reload agar Navbar membaca token secara real-time)
        window.location.href = '/'; 
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-100/40 p-8 sm:p-10 border border-slate-100 animate-fade-in-up relative overflow-hidden">
        
        {/* Dekorasi Pojok */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

        <div className="relative z-10">
           <div className="text-center mb-8">
             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
             </div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
             <p className="text-slate-500 mt-2 font-medium">Masuk untuk melanjutkan ke akun Anda.</p>
           </div>

           {errorMsg && (
             <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center animate-pulse">
               <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {errorMsg}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-5">
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
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
               <input 
                 type="password" 
                 name="password"
                 value={formData.password}
                 onChange={handleInputChange}
                 required
                 className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                 placeholder="••••••••"
               />
             </div>

             <div className="pt-2">
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all border-b-2 border-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
               >
                 {loading ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Memproses...
                   </span>
                 ) : 'Masuk Akun'}
               </button>
             </div>
           </form>

           <div className="mt-8 text-center border-t border-slate-100 pt-6">
             <p className="text-slate-500 text-sm font-medium">
               Belum memiliki akun?{' '}
               <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                 Daftar Sekarang
               </Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
