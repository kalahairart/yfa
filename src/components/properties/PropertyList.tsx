import React, { useState, useMemo } from 'react';
import { Property, ThemeSettings, PropertyType, PropertyStatus } from '../../types/property';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Trash2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2,
  ArrowUpDown,
  Building,
  CheckCircle,
  SlidersHorizontal
} from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  settings: ThemeSettings;
  onViewProperty: (prop: Property) => void;
  onAddNew: () => void;
  onDeleteProperty: (id: string) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  settings,
  onViewProperty,
  onAddNew,
  onDeleteProperty,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'date-desc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    if (period === 'month') return `${formatted}/bln`;
    return formatted;
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.city.toLowerCase().includes(search.toLowerCase()) ||
          p.address.toLowerCase().includes(search.toLowerCase()) ||
          p.agentName.toLowerCase().includes(search.toLowerCase());

        const matchesType = selectedType === 'All' || p.type === selectedType;
        const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      });
  }, [properties, search, selectedType, selectedStatus, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'For Sale':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50';
      case 'For Rent':
        return 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50';
      case 'Sold':
        return 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200';
      case 'Reserved':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50';
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {settings.language === 'id' ? 'Daftar Manajemen Properti' : 'Property Inventory List'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {settings.language === 'id' 
              ? `Menampilkan ${filteredProperties.length} total properti dalam portofolio` 
              : `Managing ${filteredProperties.length} real estate listings in portfolio`}
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{settings.language === 'id' ? 'Tambah Properti Baru' : 'Add New Property'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={settings.language === 'id' ? 'Cari judul properti, kota, atau agen...' : 'Search title, city, address, or broker...'}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">{settings.language === 'id' ? 'Semua Tipe' : 'All Types'}</option>
            <option value="Villa">Villa</option>
            <option value="Penthouse">Penthouse</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">{settings.language === 'id' ? 'Semua Status' : 'All Status'}</option>
            <option value="For Sale">{settings.language === 'id' ? 'Dijual (For Sale)' : 'For Sale'}</option>
            <option value="For Rent">{settings.language === 'id' ? 'Disewa (For Rent)' : 'For Rent'}</option>
            <option value="Sold">{settings.language === 'id' ? 'Terjual (Sold)' : 'Sold'}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="date-desc">{settings.language === 'id' ? 'Terbaru' : 'Newest First'}</option>
            <option value="price-asc">{settings.language === 'id' ? 'Harga: Rendah ke Tinggi' : 'Price: Low to High'}</option>
            <option value="price-desc">{settings.language === 'id' ? 'Harga: Tinggi ke Rendah' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{settings.language === 'id' ? 'Properti' : 'Property'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Tipe' : 'Type'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Kamar & Luas' : 'Specs'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Agen Penanggung' : 'Broker'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Harga' : 'Price'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Status' : 'Status'}</th>
                <th className="py-3.5 px-4 text-right">{settings.language === 'id' ? 'Aksi' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {paginatedProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Building className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">{settings.language === 'id' ? 'Tidak ada properti ditemukan' : 'No properties matched your search'}</p>
                    <p className="text-xs mt-1">{settings.language === 'id' ? 'Coba ubah kata kunci atau reset filter' : 'Try adjusting filters or clear search term'}</p>
                  </td>
                </tr>
              ) : (
                paginatedProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                    {/* Property info & thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-12 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="max-w-xs">
                          <button
                            onClick={() => onViewProperty(prop)}
                            className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 text-left transition-colors truncate block"
                          >
                            {prop.title}
                          </button>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{prop.address}, {prop.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {prop.type}
                      </span>
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{prop.bedrooms} Bed</span>
                        <span>·</span>
                        <span>{prop.bathrooms} Bath</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{prop.areaSqFt.toLocaleString()} sqft</span>
                      </div>
                    </td>

                    {/* Broker */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={prop.agentAvatar}
                          alt={prop.agentName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                          {prop.agentName}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(prop.price, prop.period)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(prop.status)}`}>
                        {prop.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewProperty(prop)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(settings.language === 'id' ? `Hapus properti "${prop.title}"?` : `Delete property "${prop.title}"?`)) {
                              onDeleteProperty(prop.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {settings.language === 'id' 
              ? `Halaman ${currentPage} dari ${totalPages}` 
              : `Showing page ${currentPage} of ${totalPages}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.language === 'id' ? 'Sebelumnya' : 'Previous'}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.language === 'id' ? 'Selanjutnya' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
