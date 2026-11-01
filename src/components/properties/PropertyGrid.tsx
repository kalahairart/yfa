import React, { useState } from 'react';
import { Property, ThemeSettings, PropertyType } from '../../types/property';
import { 
  Search, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Heart, 
  Phone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  settings: ThemeSettings;
  onViewProperty: (prop: Property) => void;
  onAddNew: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  settings,
  onViewProperty,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['prop-101']);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const formatPrice = (val: number, period?: string) => {
    let formatted = '';
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      if (idr >= 1000000000) {
        formatted = `Rp ${(idr / 1000000000).toFixed(1)} M`;
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
    return formatted;
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  const propertyTypes = ['All', 'Villa', 'Penthouse', 'House', 'Apartment'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {settings.language === 'id' ? 'Galeri Grid Properti' : 'Property Grid Showcase'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {settings.language === 'id' 
              ? 'Tampilan kartu visual resolusi tinggi dengan fasilitas lengkap' 
              : 'Visual high-resolution card view with key architectural specs'}
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{settings.language === 'id' ? 'Tambah Listing Baru' : 'Add New Property'}</span>
        </button>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {propertyTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === t
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {t === 'All' && (settings.language === 'id' ? 'Semua Kategori' : 'All')}
              {t !== 'All' && t}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={settings.language === 'id' ? 'Cari lokasi / nama properti...' : 'Search location or title...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => {
          const isSaved = bookmarkedIds.includes(prop.id);

          return (
            <div
              key={prop.id}
              onClick={() => onViewProperty(prop)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={prop.image}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md ${
                    prop.status === 'For Sale'
                      ? 'bg-emerald-600/90 text-white'
                      : prop.status === 'For Rent'
                      ? 'bg-blue-600/90 text-white'
                      : 'bg-slate-900/90 text-white'
                  }`}>
                    {prop.status}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md">
                    {prop.type}
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => toggleBookmark(prop.id, e)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                    isSaved
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  aria-label="Bookmark property"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>

                {/* Price Pill */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-sm font-extrabold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg tabular-nums">
                    {formatPrice(prop.price, prop.period)}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{prop.address}, {prop.city}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {prop.description}
                  </p>
                </div>

                {/* Specs and Agent Footer */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-slate-400" />
                      <span>{prop.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-slate-400" />
                      <span>{prop.bathrooms} Bath</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.areaSqFt.toLocaleString()} sqft</span>
                    </div>
                  </div>

                  {/* Broker & Details button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={prop.agentAvatar}
                        alt={prop.agentName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                        {prop.agentName}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{settings.language === 'id' ? 'Detail' : 'Explore'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
