import React from 'react';
import { Villa, VillaInquiry } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { 
  Building2, 
  Key, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Sparkles 
} from 'lucide-react';

interface LahomesOverviewProps {
  villas: Villa[];
  inquiries: VillaInquiry[];
  settings: ThemeSettings;
  onNavigateToTab: (tab: any) => void;
  onSelectVilla: (villa: Villa) => void;
}

export const LahomesOverview: React.FC<LahomesOverviewProps> = ({
  villas,
  inquiries,
  settings,
  onNavigateToTab,
  onSelectVilla,
}) => {
  const totalAvailable = villas.filter((v) => v.status === 'available').length;
  const totalRented = villas.filter((v) => v.status === 'rented').length;
  const totalSold = villas.filter((v) => v.status === 'sold').length;
  const totalLeads = inquiries.length;

  const formatPrice = (usdVal: number) => {
    if (settings.currency === 'IDR') {
      const idr = usdVal * 16000;
      if (idr >= 1000000000) {
        return `Rp ${(idr / 1000000000).toFixed(1)} M`;
      }
      return `Rp ${idr.toLocaleString('id-ID')}`;
    }
    if (usdVal >= 1000000) {
      return `$${(usdVal / 1000000).toFixed(2)}M`;
    }
    return `$${usdVal.toLocaleString()}`;
  };

  // Total portfolio value
  const totalPortfolioValue = villas.reduce((sum, v) => sum + (v.price_sale || (v.price_rent_yearly ? v.price_rent_yearly * 10 : 500000)), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/20 text-emerald-100">
              Agent Control Room
            </span>
            <span className="text-xs text-emerald-200">· Lahomes Real Estate System</span>
          </div>
          <h2 className="text-2xl font-black">
            Selamat Datang, Agen Candra Rusman
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Ringkasan portofolio listing villa, leads calon penyewa/buyer, dan status legalitas sertifikat tanah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('developer')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition-all"
          >
            <Code2 className="w-4 h-4 text-emerald-300" />
            <span>Skema Supabase & Next.js</span>
          </button>

          <button
            onClick={() => onNavigateToTab('villas')}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Kelola Villa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Portofolio</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {villas.length} Villa
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">{totalAvailable} Tersedia</span>
            <span>·</span>
            <span>{totalRented} Disewa</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Nilai Portofolio Listing</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {formatPrice(totalPortfolioValue)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Estimasi total aset yang dikelola
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Leads / Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {totalLeads} Calon Klien
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>2 lead baru dalam 24 jam</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Estimasi Komisi Agen</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono tabular-nums">
              {formatPrice(185000)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Pipeline deal negosiasi aktif
          </div>
        </div>
      </div>

      {/* Middle Grid: Villa Status Breakdown & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Status Ketersediaan Villa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Distribusi status operasional unit
            </p>
          </div>

          <div className="my-6 space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Tersedia (Available)</span>
                <span className="font-mono font-bold text-emerald-600">{totalAvailable} Unit</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(totalAvailable / villas.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Sedang Disewa (Rented)</span>
                <span className="font-mono font-bold text-amber-600">{totalRented} Unit</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(totalRented / villas.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Terjual (Sold)</span>
                <span className="font-mono font-bold text-slate-600">{totalSold} Unit</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: `${(totalSold / villas.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Kategori Transaksi:</span>
            <div className="flex justify-between">
              <span>Sewa & Jual (Both):</span>
              <span className="font-bold">{villas.filter(v => v.transaction_type === 'both').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Hanya Sewa (Rent Only):</span>
              <span className="font-bold">{villas.filter(v => v.transaction_type === 'rent').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Hanya Jual (Sale Only):</span>
              <span className="font-bold">{villas.filter(v => v.transaction_type === 'sale').length}</span>
            </div>
          </div>
        </div>

        {/* Recent Inquiries Leads (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pesan & Calon Klien Terbaru (Leads CRM)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inquiry yang masuk dari website publik
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('leads')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Buka CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{inq.client_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1 italic text-[11px]">
                    "{inq.message}"
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                    Target: {inq.villa_title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${inq.client_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${inq.client_name}, saya Agen Candra Rusman menindaklanjuti pesan Anda mengenai ${inq.villa_title}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Balas WA</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Total {inquiries.length} prospek tercatat di database</span>
            <span className="font-mono text-emerald-500 font-bold">Respon rata-rata &lt; 15 menit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
