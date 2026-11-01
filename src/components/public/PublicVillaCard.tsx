import React from 'react';
import { Villa } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { MapPin, Bed, Bath, Maximize2, MessageSquare, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { translations } from '../../utils/translations';

interface PublicVillaCardProps {
  villa: Villa;
  settings: ThemeSettings;
  onSelect: (villa: Villa) => void;
}

export const PublicVillaCard: React.FC<PublicVillaCardProps> = ({
  villa,
  settings,
  onSelect,
}) => {
  const lang = settings.language || 'id';
  const t = translations[lang];

  const formatCurrency = (usdVal?: number) => {
    if (!usdVal) return '-';
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

  const cleanPhone = (villa.agent_phone || '+6281234567890').replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    lang === 'id'
      ? `Halo Agen Candra, saya tertarik dengan "${villa.title}" (ID: ${villa.id}) di ${villa.city}. Apakah villa ini masih tersedia untuk jadwal survei/sewa?`
      : `Hello Agent Candra, I am interested in "${villa.title}" (ID: ${villa.id}) in ${villa.city}. Is it available for private viewing or booking?`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

  const getStatusBadge = () => {
    switch (villa.status) {
      case 'available':
        return { text: t.available, bg: 'bg-emerald-600/90 text-white' };
      case 'rented':
        return { text: t.rented, bg: 'bg-amber-600/90 text-white' };
      case 'sold':
        return { text: t.sold, bg: 'bg-slate-900/90 text-white' };
      case 'under_maintenance':
        return { text: t.maintenance, bg: 'bg-rose-600/90 text-white' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      onClick={() => onSelect(villa)}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Visual Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={villa.images[0]}
          alt={villa.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm ${statusBadge.bg}`}>
            {statusBadge.text}
          </span>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md">
            {villa.transaction_type === 'both' ? t.allTransactions : villa.transaction_type === 'rent' ? t.forRent : t.forSale}
          </span>
        </div>

        {/* Featured Pill */}
        {villa.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500 text-white shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>VIP</span>
            </span>
          </div>
        )}

        {/* Location Tag Bottom */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{villa.city}, Bali</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {villa.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {villa.description}
          </p>
        </div>

        {/* Specs Row */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>{villa.bedrooms} {t.beds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span>{villa.bathrooms} {t.baths}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{villa.building_size} m²</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-1">
          {villa.price_rent_daily && (
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-slate-400">{lang === 'id' ? 'Sewa Harian:' : 'Daily Rent:'}</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(villa.price_rent_daily)} <span className="text-[10px] font-normal text-slate-400">{t.daily}</span>
              </span>
            </div>
          )}
          {villa.price_rent_monthly && (
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-slate-400">{lang === 'id' ? 'Sewa Bulanan:' : 'Monthly Rent:'}</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {formatCurrency(villa.price_rent_monthly)} <span className="text-[10px] font-normal text-slate-400">{t.monthly}</span>
              </span>
            </div>
          )}
          {villa.price_sale && (
            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{t.salePriceLabel}:</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(villa.price_sale)}
              </span>
            </div>
          )}
        </div>

        {/* Actions Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {/* Detail Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(villa);
            }}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{lang === 'id' ? 'Lihat Detail' : 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* WhatsApp Direct */}
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            title={t.whatsappAgent}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
