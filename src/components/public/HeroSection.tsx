import React from 'react';
import { Search, MapPin, Key, Bed, SlidersHorizontal, Sparkles, ShieldCheck } from 'lucide-react';
import { PublicSearchFilter, TransactionType } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { translations } from '../../utils/translations';

interface HeroSectionProps {
  filter: PublicSearchFilter;
  onFilterChange: (newFilter: Partial<PublicSearchFilter>) => void;
  onSearch: () => void;
  totalVillasCount: number;
  settings: ThemeSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filter,
  onFilterChange,
  onSearch,
  totalVillasCount,
  settings,
}) => {
  const lang = settings.language || 'id';
  const t = translations[lang];

  const quickCategories = [
    { label: t.allVillas, category: 'all' },
    { label: 'Eco Bamboo Ubud', category: 'Ubud' },
    { label: 'Beachfront Canggu', category: 'Canggu' },
    { label: 'Cliffside Uluwatu', category: 'Uluwatu' },
    { label: 'Seminyak Luxury', category: 'Seminyak' },
  ];

  return (
    <div className="relative pt-8 pb-14 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.heroBadge}</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
            <span className="text-[11px] font-medium opacity-80">{t.verifiedCert}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.heroTitlePrefix} <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">{t.heroTitleHighlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Floating Search Console */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Lokasi */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.locationLabel}</span>
              </label>
              <select
                value={filter.location}
                onChange={(e) => onFilterChange({ location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="all">{t.allLocations}</option>
                <option value="Ubud">Ubud (Jungle & Cultural)</option>
                <option value="Canggu">Canggu (Coastal & Lifestyle)</option>
                <option value="Uluwatu">Uluwatu (Cliff & Oceanfront)</option>
                <option value="Seminyak">Seminyak (Boutique & Prime)</option>
                <option value="Sanur">Sanur (Beachfront & Sunrise)</option>
              </select>
            </div>

            {/* Status Transaksi */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.transactionTypeLabel}</span>
              </label>
              <select
                value={filter.transaction_type}
                onChange={(e) => onFilterChange({ transaction_type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="all">{t.allTransactions}</option>
                <option value="rent">{t.forRent}</option>
                <option value="sale">{t.forSale}</option>
              </select>
            </div>

            {/* Jumlah Kamar */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.bedroomsLabel}</span>
              </label>
              <select
                value={filter.bedrooms}
                onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="all">{t.anyBedrooms}</option>
                <option value="2">{t.beds2Plus}</option>
                <option value="3">{t.beds3Plus}</option>
                <option value="4">{t.beds4Plus}</option>
                <option value="5">{t.beds5Plus}</option>
              </select>
            </div>

            {/* Action Search Button */}
            <div className="flex items-end">
              <button
                onClick={onSearch}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all duration-200 h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>{t.searchButton} ({totalVillasCount})</span>
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1">{t.popularCategories}:</span>
            {quickCategories.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onFilterChange({ location: item.category })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filter.location === item.category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
