import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  KeyRound,
  Database,
  RefreshCw,
  UserPlus,
  LogIn,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { LoginCredentials, AdminUser } from '../../types/auth';
import { ThemeSettings } from '../../types/property';
import { 
  getSupabaseConfig, 
  testSupabaseConnection, 
  signInWithSupabase, 
  signUpWithSupabase,
  saveCustomSupabaseConfig,
  SupabaseHealthReport
} from '../../utils/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: LoginCredentials, userObj?: AdminUser) => boolean;
  settings: ThemeSettings;
  onOpenDeveloperCenter?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  settings,
  onOpenDeveloperCenter,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'config'>('signin');
  const [email, setEmail] = useState('candra.rusman@lahomes.realestate');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('Admin Lahomes');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Supabase live check state
  const [health, setHealth] = useState<SupabaseHealthReport | null>(null);
  const [isCheckingConn, setIsCheckingConn] = useState(false);

  // Quick custom credentials tester inside modal
  const [manualUrl, setManualUrl] = useState('');
  const [manualKey, setManualKey] = useState('');

  const checkConnection = async () => {
    setIsCheckingConn(true);
    try {
      const report = await testSupabaseConnection();
      setHealth(report);
      if (report.isConfigured && !manualUrl) {
        setManualUrl(report.url);
      }
    } catch {
      // ignore
    } finally {
      setIsCheckingConn(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkConnection();
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSupabaseLive = Boolean(health?.isConfigured && health?.authConnected);

  const handleFillDemo = () => {
    setEmail('candra.rusman@lahomes.realestate');
    setPassword('admin123');
    setErrorMessage(null);
    setSuccessMessage('Kredensial demo admin telah diisi.');
  };

  const handleSaveManualConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl || !manualKey) {
      setErrorMessage('Harap isi URL dan Anon Key Supabase.');
      return;
    }
    saveCustomSupabaseConfig(manualUrl, manualKey);
    setSuccessMessage('Kredensial Supabase disimpan ke browser!');
    await checkConnection();
    setTab('signin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        setErrorMessage('Silakan masukkan email dan password.');
        setIsLoading(false);
        return;
      }

      const config = getSupabaseConfig();

      if (tab === 'signup') {
        // Register new admin via Supabase Auth
        if (!config.isConfigured) {
          setErrorMessage('Supabase belum terhubung. Konfigurasikan URL dan Anon Key terlebih dahulu.');
          setIsLoading(false);
          return;
        }

        const data = await signUpWithSupabase(email.trim(), password.trim(), fullName.trim());
        const user = data.user;
        
        if (user) {
          setSuccessMessage('Pendaftaran akun admin berhasil! Anda dapat langsung masuk.');
          const adminUser: AdminUser = {
            id: user.id,
            name: fullName || user.email?.split('@')[0] || 'Admin',
            email: user.email || email,
            role: 'principal_broker',
            avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
            token: user.id,
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          onLogin({ email, password, rememberMe }, adminUser);
          onClose();
        }
        setIsLoading(false);
        return;
      }

      // Tab Sign In
      if (config.isConfigured) {
        // Real Supabase Authentication!
        try {
          const authData = await signInWithSupabase(email.trim(), password.trim());
          const sbUser = authData.user;

          const adminUser: AdminUser = {
            id: sbUser?.id || `usr-${Date.now().toString().slice(-4)}`,
            name: sbUser?.user_metadata?.full_name || sbUser?.email?.split('@')[0] || 'Agen Supabase',
            email: sbUser?.email || email,
            role: (sbUser?.user_metadata?.role as any) || 'principal_broker',
            avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
            token: authData.session?.access_token || `sb-${Date.now()}`,
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          onLogin({ email, password, rememberMe }, adminUser);
          onClose();
        } catch (authErr: any) {
          // Reject invalid credentials with Supabase real error
          console.error('Supabase Auth error:', authErr);
          if (authErr?.message?.includes('Invalid login credentials')) {
            setErrorMessage('Gagal Masuk: Email atau password salah, atau akun ini belum terdaftar di Supabase Auth.');
          } else if (authErr?.message?.includes('Email not confirmed')) {
            setErrorMessage('Email belum dikonfirmasi. Periksa inbox email Anda atau nonaktifkan "Confirm email" di Supabase Dashboard > Authentication > Providers.');
          } else {
            setErrorMessage(`Gagal masuk Supabase: ${authErr?.message || 'Terjadi kesalahan autentikasi'}`);
          }
          setIsLoading(false);
          return;
        }
      } else {
        // Offline Demo Mode (Env vars not set yet in Vercel)
        if (password.length < 4) {
          setErrorMessage('Password minimal 4 karakter.');
          setIsLoading(false);
          return;
        }

        const authenticatedUser: AdminUser = {
          id: `usr-demo-${Date.now().toString().slice(-4)}`,
          name: email.split('@')[0] || 'Demo Admin',
          email: email.trim(),
          role: 'principal_broker',
          avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
          token: `demo-token-${Date.now()}`,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        onLogin({ email, password, rememberMe }, authenticatedUser);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem saat memproses login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200 text-xs max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mx-auto">
            <Building2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Portal Agen & Admin Lahomes
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Villa Management & Real Estate Database
            </p>
          </div>

          {/* Database Connection Status Pill */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {health?.isConfigured ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Terhubung ke Supabase Live ({health.latencyMs ?? 0}ms)</span>
                <button 
                  onClick={checkConnection}
                  disabled={isCheckingConn}
                  title="Cek Ulang Koneksi"
                  className="hover:rotate-180 transition-transform duration-300"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingConn ? 'animate-spin' : ''}`} />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Mode Demo Offline (Supabase Belum Terhubung)</span>
                <button 
                  onClick={checkConnection}
                  disabled={isCheckingConn}
                  title="Cek Ulang Koneksi"
                  className="hover:rotate-180 transition-transform duration-300"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingConn ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Explain why any email logged in if offline */}
        {!health?.isConfigured && (
          <div className="my-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-900 dark:text-amber-100">
                  Mengapa login sembarang akun bisa masuk?
                </strong>
                Aplikasi saat ini masih berjalan dalam <strong>Mode Demo</strong> karena environment variable Supabase belum terdeteksi dari Vercel. 
                Dalam mode demo, form login menerima kredensial apapun agar antarmuka dapat diuji tanpa backend.
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTab('config')}
                    className="font-bold underline text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                  >
                    Atur URL & Key Supabase di sini
                  </button>
                  {onOpenDeveloperCenter && (
                    <>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenDeveloperCenter();
                        }}
                        className="font-bold underline text-blue-600 dark:text-blue-400"
                      >
                        Buka Panduan Vercel & SQL
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 my-3">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              tab === 'signin' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </button>

          {health?.isConfigured && (
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                tab === 'signup' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Admin Baru</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => { setTab('config'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              tab === 'config' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tes Koneksi</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1 & 2: SIGN IN / SIGN UP FORM */}
        {(tab === 'signin' || tab === 'signup') && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Admin
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Candra Rusman"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email {tab === 'signup' ? 'Pendaftaran' : 'Akun Agen / Admin'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="nama@lahomes.realestate"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password {health?.isConfigured && '(Supabase Auth)'}
                </label>
                {!health?.isConfigured && tab === 'signin' && (
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Gunakan Akun Demo
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ingat sesi masuk</span>
              </label>

              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {health?.isConfigured ? 'Supabase Auth Verified' : 'Demo Encryption'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all text-sm mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun ke Supabase...</span>
                </div>
              ) : tab === 'signup' ? (
                <>
                  <span>Daftarkan Akun ke Database Supabase</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Agen</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: TEST & CONFIGURE SUPABASE CONNECTION */}
        {tab === 'config' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span>Hasil Diagnostik Koneksi</span>
                </h4>
                <button
                  type="button"
                  onClick={checkConnection}
                  disabled={isCheckingConn}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingConn ? 'animate-spin' : ''}`} />
                  <span>Cek Ulang</span>
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Status Konfigurasi:</span>
                  <span className={`font-bold ${health?.isConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {health?.isConfigured ? `Terkonfigurasi (${health.source})` : 'Belum Terdeteksi'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Supabase URL:</span>
                  <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">
                    {health?.url || '—'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Layanan Auth:</span>
                  <span className={`font-bold ${health?.authConnected ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {health?.authConnected ? 'Aktif & Merespon' : 'Tidak Terhubung'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Tabel PostgreSQL (villas):</span>
                  <span className={`font-bold ${health?.tableVillasFound ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {health?.tableVillasFound ? `Tersedia (${health.villaCount ?? 0} data)` : 'Belum Ada / Perlu Skema SQL'}
                  </span>
                </div>

                {health?.latencyMs && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Kecepatan Respons (Ping):</span>
                    <span className="font-bold text-emerald-600">{health.latencyMs} ms</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Test Key Input */}
            <form onSubmit={handleSaveManualConfig} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Uji Langsung URL Supabase (Tanpa Redeploy)
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Supabase Anon Key (public)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Simpan & Uji Koneksi Sekarang
                </button>
                {health?.source === 'localStorage' && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('lahomes_sb_url');
                      localStorage.removeItem('lahomes_sb_anon_key');
                      checkConnection();
                    }}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-slate-800 text-xs"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Security Footer Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Sistem proteksi admin: Hanya akun agen terdaftar yang memiliki hak kelola villa.</span>
        </div>
      </div>
    </div>
  );
};
