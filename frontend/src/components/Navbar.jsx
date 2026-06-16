import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '/StuntingCare.png'

const Navbar = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup mobile menu saat route berubah
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/literasi', label: 'Pusat Edukasi' },
    { to: '/articles', label: 'Artikel Blog' },
    { to: '/quiz', label: 'Mulai Kuis' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgb(79,70,229,0.08)] border-b border-slate-100'
            : 'bg-white/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[70px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                  <img src={Logo} alt="" srcset="" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-[1.1rem] text-slate-800 tracking-tight">
                  Stunting<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Care</span>
                </span>
              </div>
            </Link>

            {/* Center Nav Links - Desktop */}
            <div className="hidden md:flex items-center bg-slate-50/80 rounded-2xl p-1.5 border border-slate-100">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive(link.to)
                      ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {token ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Admin Badge */}
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin"
                      className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 transition-all no-underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                      Admin
                    </Link>
                  )}

                  {/* User Profile Pill */}
                  <Link to="/profile" className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-sm px-3 py-1.5 rounded-xl transition-all no-underline group">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
                      {(user?.nama || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-xs font-bold text-slate-700 max-w-[90px] truncate">{user?.nama || 'Pengguna'}</span>
                      <span className="text-[10px] text-indigo-500 font-semibold">{user?.role || 'User'}</span>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-rose-100 hover:border-rose-500 transition-all duration-200 shadow-sm hover:shadow-rose-200 hover:shadow-md"
                    title="Keluar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-indigo-600 font-bold text-sm px-3 sm:px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all no-underline"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 no-underline"
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                  }
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors no-underline ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {token && (
              <Link to="/profile" className="flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors no-underline">
                Profil Saya
              </Link>
            )}
            {user?.role === 'Admin' && (
              <Link to="/admin" className="flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm text-emerald-600 hover:bg-emerald-50 transition-colors no-underline">
                Dasbor Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16 sm:h-[70px]"></div>
    </>
  );
};

export default Navbar;
