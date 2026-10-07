import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiLock, FiMail, FiKey, FiEye, FiEyeOff } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import TinyRealmsLogo from '../../components/TinyRealmsLogo';
import { isAuthorizedAdminEmail } from '../../services/authService';

export default function AdminLogin() {
  const { loginWithEmailPassword, isAuthenticated, authLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Destination after login (default /admin/dashboard)
  const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const from =
    rawFrom &&
    rawFrom !== '/admin' &&
    rawFrom !== '/admin/' &&
    rawFrom !== '/owner' &&
    rawFrom !== '/owner/' &&
    rawFrom !== '/admin/login'
      ? rawFrom
      : '/admin/dashboard';

  // If already authenticated with authorized account, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // Handle Firebase Email/Password Sign-In exclusively
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Akses ditolak: Email ini tidak memiliki hak akses administrator.');
      return;
    }

    if (!password) {
      setError('Silakan masukkan kata sandi akun Firebase Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithEmailPassword(cleanEmail, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else if (res.error) {
        setError(res.error);
      }
    } catch {
      setError('Terjadi kendala saat menghubungkan ke Firebase Authentication. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#696866] text-[#F5EBDD] flex flex-col justify-between selection:bg-[#4A2D1A] selection:text-[#F5EBDD]">
      {/* Top Header */}
      <header className="px-6 py-5 border-b border-[#5A351E] flex items-center justify-between bg-[#24170F]/50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>KEMBALI KE GALERI</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-[#4A2D1A] border border-[#5A351E] rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Header Brand & Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#24170F] text-[#F5EBDD] flex items-center justify-center p-2.5 mb-3 shadow-sm border border-[#5A351E]">
                <TinyRealmsLogo size={36} color="#C69B5A" />
              </div>
              <h1 className="text-2xl font-black text-[#F5EBDD] tracking-tight">
                Studio Admin
              </h1>
              <p className="mt-1 text-xs text-[#CDBCA8]">
                Masuk dengan email dan kata sandi Firebase Authentication
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-medium flex items-start gap-2.5">
                <FiAlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed whitespace-pre-line">{error}</span>
              </div>
            )}

            {/* Pure Firebase Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#CDBCA8] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#CDBCA8]">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="masukan email"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#CDBCA8] mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#CDBCA8]">
                    <FiKey className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-9 pr-10 py-2.5 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/40 focus:outline-none focus:border-[#C69B5A] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#CDBCA8] hover:text-[#F5EBDD] cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#C69B5A] hover:bg-[#B38848] active:bg-[#9F7638] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#24170F]/30 border-t-[#24170F] rounded-full animate-spin" />
                    <span>Memverifikasi Firebase...</span>
                  </div>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-[#5A351E] bg-[#24170F]/50 flex items-center justify-center text-xs font-mono text-[#CDBCA8]">
        <span>© {new Date().getFullYear()} Tiny Realms Studio. All rights reserved.</span>
      </footer>
    </div>
  );
}
