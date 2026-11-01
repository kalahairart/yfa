import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Key, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  UploadCloud,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  testSupabaseConnection, 
  saveCustomSupabaseConfig, 
  clearCustomSupabaseConfig,
  getSupabaseClient,
  SupabaseHealthReport 
} from '../../utils/supabase';
import { INITIAL_VILLAS } from '../../data/villaData';

interface SupabaseConnectionTesterProps {
  onGoToSqlTab?: () => void;
  onGoToVercelTab?: () => void;
}

export const SupabaseConnectionTester: React.FC<SupabaseConnectionTesterProps> = ({
  onGoToSqlTab,
  onGoToVercelTab,
}) => {
  const [report, setReport] = useState<SupabaseHealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Manual tester inputs
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const res = await testSupabaseConnection();
      setReport(res);
      if (res.isConfigured && !customUrl) {
        const cfg = getSupabaseConfig();
        setCustomUrl(cfg.url);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const handleSaveTester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customKey) return;
    saveCustomSupabaseConfig(customUrl, customKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    await runTest();
  };

  const handleResetTester = async () => {
    clearCustomSupabaseConfig();
    setCustomUrl('');
    setCustomKey('');
    await runTest();
  };

  const handleSeedData = async () => {
    const client = getSupabaseClient();
    if (!client) return;

    setIsSeeding(true);
    setSeedResult(null);

    try {
      let insertedCount = 0;
      for (const villa of INITIAL_VILLAS) {
        // Insert villa
        const { data: vData, error: vErr } = await client
          .from('villas')
          .upsert({
            title: villa.title,
            slug: villa.slug,
            description: villa.description,
            address: villa.address,
            city: villa.city,
            price_rent_daily: villa.price_rent_daily || null,
            price_rent_monthly: villa.price_rent_monthly || null,
            price_rent_yearly: villa.price_rent_yearly || null,
            price_sale: villa.price_sale || null,
            status: villa.status,
            transaction_type: villa.transaction_type,
            bedrooms: villa.bedrooms,
            bathrooms: villa.bathrooms,
            building_size: villa.building_size,
            land_size: villa.land_size,
            features: villa.features,
            is_featured: villa.is_featured,
          }, { onConflict: 'slug' })
          .select('id')
          .single();

        if (vErr) {
          console.error('Seed villa error:', vErr);
          continue;
        }

        // Insert primary & secondary images
        if (vData && villa.images && villa.images.length > 0) {
          const imgRows = villa.images.map((imgUrl, idx) => ({
            villa_id: vData.id,
            image_url: imgUrl,
            is_primary: idx === 0,
            display_order: idx,
          }));

          await client.from('villa_images').insert(imgRows);
        }

        insertedCount++;
      }

      setSeedResult(`Sukses! ${insertedCount} unit villa berhasil disimpan ke tabel "villas" Supabase.`);
      await runTest();
    } catch (err: any) {
      setSeedResult(`Gagal memasukkan data: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Status Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        report?.status === 'connected'
          ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30'
          : report?.status === 'schema_needed'
          ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30'
          : 'bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent border-rose-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              report?.status === 'connected'
                ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                : report?.status === 'schema_needed'
                ? 'bg-amber-600 text-white shadow-amber-600/25'
                : 'bg-rose-600 text-white shadow-rose-600/25'
            }`}>
              <Database className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {report?.status === 'connected'
                    ? 'Database PostgreSQL & Auth Supabase Terhubung!'
                    : report?.status === 'schema_needed'
                    ? 'Koneksi Supabase Aktif — Tabel Belum Dibuat'
                    : 'Aplikasi Belum Terhubung ke Supabase (Mode Demo)'}
                </h3>
                
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  report?.status === 'connected'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : report?.status === 'schema_needed'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                }`}>
                  {report?.status === 'connected' 
                    ? `Live · ${report.latencyMs ?? 0} ms`
                    : report?.status === 'schema_needed'
                    ? 'Perlu Skema SQL'
                    : 'Demo Offline'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {report?.status === 'connected'
                  ? `Sistem berhasil berkomunikasi dengan endpoint ${report.url}. Autentikasi real Supabase aktif dan tabel database telah terverifikasi.`
                  : report?.status === 'schema_needed'
                  ? 'Server Supabase terhubung dengan sukses, namun tabel database (seperti "villas") belum ditemukan di PostgreSQL Anda. Anda perlu menjalankan skrip SQL.'
                  : 'Aplikasi saat ini masih menggunakan mock state lokal. Itu sebabnya login sembarang email & password bisa masuk langsung.'}
              </p>
            </div>
          </div>

          <button
            onClick={runTest}
            disabled={isLoading}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menguji Koneksi...' : 'Uji Koneksi Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* 2. Diagnostic Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Environment Variables */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              <span>1. Vercel / Env Vars</span>
            </span>
            {report?.isConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {report?.isConfigured ? 'Variabel Terdeteksi' : 'Belum Dikonfigurasi'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {report?.source === 'env' 
                ? 'Dari Vercel Environment Variables' 
                : report?.source === 'localStorage' 
                ? 'Dari Browser Local Storage Tester' 
                : 'VITE_SUPABASE_URL belum ada'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-500 truncate">
            {report?.url || 'https://xyz.supabase.co'}
          </div>
        </div>

        {/* Step 2: REST Handshake & Latency */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>2. Handshake Ping</span>
            </span>
            {report?.latencyMs !== null ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {report && report.latencyMs !== null ? `${report.latencyMs} ms Latensi` : 'Tidak Ada Respons'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {report && report.latencyMs !== null ? 'Koneksi REST API lancar' : 'Server tidak dapat dihubungi'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-500">
            Anon Key: {report?.maskedKey ? 'Tersedia' : 'Kosong'}
          </div>
        </div>

        {/* Step 3: PostgreSQL Database Tables */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>3. Tabel Database</span>
            </span>
            {report?.tableVillasFound ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {report?.tableVillasFound 
                ? `${report.villaCount ?? 0} Villa di Database` 
                : 'Tabel "villas" Belum Ada'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {report?.tableVillasFound ? 'Skema PostgreSQL sudah aktif' : 'Jalankan skrip SQL skema'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {onGoToSqlTab && !report?.tableVillasFound && (
              <button 
                onClick={onGoToSqlTab}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Buka Skema SQL</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Step 4: Supabase Auth Service */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>4. Supabase Auth</span>
            </span>
            {report?.authConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {report?.authConnected ? 'Auth Service Siap' : 'Belum Terhubung'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {report?.currentUserEmail 
                ? `Login sbg: ${report.currentUserEmail}` 
                : 'Siap untuk login akun agen'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
            Endpoint: /auth/v1
          </div>
        </div>
      </div>

      {/* 3. Penjelasan Pertanyaan Pengguna: Mengapa Sembarang Email & Password Bisa Masuk? */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 text-slate-800 dark:text-slate-200 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Mengapa sebelumnya login sembarang email dan password langsung bisa masuk?
            </h4>
            <div className="text-xs text-amber-800/90 dark:text-amber-200/80 mt-1 space-y-2 leading-relaxed">
              <p>
                <strong>Penyebab:</strong> Ketika kode awal dibuat, sistem menyertakan <em>Local Frontend Mock Authentication</em> sebagai fallback pratinjau. 
                Jika aplikasi belum mendeteksi kredensial Supabase (karena belum dipasang di Vercel atau belum di-Redeploy), sistem berjalan dalam <strong>Mode Demo</strong> agar pengguna tetap bisa melihat tata letak seluruh menu dashboard tanpa macet di halaman login.
              </p>
              <p>
                <strong>Kini telah diperbarui:</strong> Form login sekarang memanggil <code>supabase.auth.signInWithPassword</code> secara langsung! 
                Jika Anda memasukkan email/password yang tidak ada di daftar user Supabase, Supabase akan menolaknya dengan pesan error resmi <em>"Invalid login credentials"</em>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Live Connection Tester (Test URL & Key Right Here) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Uji Langsung URL & Anon Key Supabase di Browser</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Anda dapat menguji koneksi langsung di sini untuk memastikan URL dan API Key Anda benar sebelum atau sesudah menambahkan di Vercel.
            </p>
          </div>

          {report?.source === 'localStorage' && (
            <button
              onClick={handleResetTester}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Hapus Key Lokal
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Kredensial disimpan! Pengujian koneksi ulang sedang dijalankan...</span>
          </div>
        )}

        <form onSubmit={handleSaveTester} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                Project URL Supabase
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzabcdefghijklm.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ditemukan di Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
              </span>
            </div>

            <div>
              <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                Supabase Anon / Public Key (JWT)
              </label>
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ditemukan di Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Simpan & Tes Koneksi Supabase Sekarang</span>
            </button>

            {onGoToVercelTab && (
              <button
                type="button"
                onClick={onGoToVercelTab}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Lihat Cara Pasang di Vercel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 5. Seed Data Section (When connected) */}
      {report?.isConfigured && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Seed Data Villa ke Database Supabase</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Masukkan 8 data villa awal (Uluwatu Cliff, Canggu Tropical, Ubud Sanctuary, dsb.) langsung ke tabel <code>villas</code> di Supabase.
              </p>
            </div>

            <button
              onClick={handleSeedData}
              disabled={isSeeding || !report.tableVillasFound}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 transition-colors"
            >
              <UploadCloud className={`w-4 h-4 ${isSeeding ? 'animate-bounce' : ''}`} />
              <span>{isSeeding ? 'Memasukkan Data ke PostgreSQL...' : 'Kirim 8 Data Villa ke Supabase'}</span>
            </button>
          </div>

          {!report.tableVillasFound && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              Perhatian: Anda harus menjalankan skrip SQL terlebih dahulu sebelum dapat memasukkan data villa.
            </div>
          )}

          {seedResult && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{seedResult}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
