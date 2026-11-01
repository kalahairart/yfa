import React from 'react';
import { Property, ThemeSettings } from '../../types/property';
import { Building2, ArrowRight, Bed, Bath, Maximize2, MapPin } from 'lucide-react';

interface RecentPropertiesProps {
  properties: Property[];
  settings: ThemeSettings;
  onViewProperty: (property: Property) => void;
  onViewAll: () => void;
}

export const RecentProperties: React.FC<RecentPropertiesProps> = ({
  properties,
  settings,
  onViewProperty,
  onViewAll,
}) => {
  const formatPrice = (val: number, period?: string) => {
    let formatted = '';
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      if (idr >= 1000000000) {
        formatted = `Rp ${(idr / 1000000000).toFixed(1)} Miliar`;
      } else {
        formatted = `Rp ${idr.toLocaleString('id-ID')}`;
      }
    } else {
      if (val >= 1000000) {
        formatted = `$${(val / 1000000).toFixed(2)}M`;
      } else {
        formatted = `$${val.toLocaleString()}`;
      }
    }
    if (period === 'month') return `${formatted} / bln`;
    if (period === 'year') return `${formatted} / thn`;
    return formatted;
  };

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'For Sale':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50';
      case 'For Rent':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/50';
      case 'Sold':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200';
      case 'Reserved':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/50';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>{settings.language === 'id' ? 'Listing Properti Terbaru' : 'Recent Property Listings'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {settings.language === 'id' ? 'Properti premium yang baru diverifikasi' : 'Newly verified premium properties'}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>{settings.language === 'id' ? 'Lihat Semua' : 'View All'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {properties.slice(0, 3).map((prop) => (
          <div
            key={prop.id}
            onClick={() => onViewProperty(prop)}
            className="group rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 bg-white dark:bg-slate-800/40 cursor-pointer flex flex-col"
          >
            {/* Image banner with overlay badges */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={prop.image}
                alt={prop.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(prop.status)}`}>
                  {prop.status}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                  {prop.type}
                </span>
              </div>
              <div className="absolute bottom-2.5 left-2.5">
                <span className="text-xs font-black text-white bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md tabular-nums">
                  {formatPrice(prop.price, prop.period)}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {prop.title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{prop.address}, {prop.city}</span>
                </div>
              </div>

              {/* Specs footer */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prop.bedrooms} Bed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prop.bathrooms} Bath</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Maximize2 className="w-3 h-3 text-slate-400" />
                  <span>{prop.areaSqFt.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
