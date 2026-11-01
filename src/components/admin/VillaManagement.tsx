import React, { useState } from 'react';
import { Villa, VillaStatus, TransactionType } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Filter 
} from 'lucide-react';
import { EditVillaModal } from './EditVillaModal';

interface VillaManagementProps {
  villas: Villa[];
  settings: ThemeSettings;
  onUpdateVilla: (updated: Villa) => void;
  onAddVilla: (newVilla: Villa) => void;
  onDeleteVilla: (id: string) => void;
  onViewPublicDetail: (villa: Villa) => void;
}

export const VillaManagement: React.FC<VillaManagementProps> = ({
  villas,
  settings,
  onUpdateVilla,
  onAddVilla,
  onDeleteVilla,
  onViewPublicDetail,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);

  const formatPrice = (usdVal?: number) => {
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

  const filteredVillas = villas.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || v.status === selectedStatus;
    const matchesType = selectedType === 'all' || v.transaction_type === selectedType || v.transaction_type === 'both';
    const matchesCity = selectedCity === 'all' || v.city === selectedCity;
    return matchesSearch && matchesStatus && matchesType && matchesCity;
  });

  const handleStatusChange = (villa: Villa, newStatus: VillaStatus) => {
    onUpdateVilla({ ...villa, status: newStatus });
  };

  const handleSaveModal = (saved: Villa) => {
    if (editingVilla) {
      onUpdateVilla(saved);
    } else {
      onAddVilla(saved);
    }
    setEditingVilla(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Manajemen Listing Villa (CRUD Portofolio)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tambah, sunting spesifikasi, kelola foto, dan ubah status sewa/jual villa secara langsung.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVilla(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Villa Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari judul villa, alamat, atau kawasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="available">Tersedia (Available)</option>
            <option value="rented">Sedang Disewa (Rented)</option>
            <option value="sold">Terjual (Sold)</option>
            <option value="under_maintenance">Maintenance</option>
          </select>

          {/* Tipe Transaksi */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Transaksi</option>
            <option value="rent">Disewa Saja</option>
            <option value="sale">Dijual Saja</option>
            <option value="both">Sewa & Jual</option>
          </select>

          {/* Lokasi */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Kawasan</option>
            <option value="Ubud">Ubud</option>
            <option value="Canggu">Canggu</option>
            <option value="Uluwatu">Uluwatu</option>
            <option value="Seminyak">Seminyak</option>
            <option value="Sanur">Sanur</option>
          </select>
        </div>
      </div>

      {/* Villa Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Villa Listing</th>
                <th className="py-3.5 px-3">Tipe Transaksi</th>
                <th className="py-3.5 px-3">Kamar & Luas</th>
                <th className="py-3.5 px-3">Harga Sewa / Jual</th>
                <th className="py-3.5 px-3">Status Operasional</th>
                <th className="py-3.5 px-4 text-right">Aksi Agen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredVillas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">Tidak ada data villa yang sesuai kriteria pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredVillas.map((villa) => (
                  <tr key={villa.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={villa.images[0]}
                          alt={villa.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 dark:text-white block truncate">
                            {villa.title}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{villa.city} · {villa.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tipe Transaksi */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {villa.transaction_type === 'both' ? 'Sewa & Jual' : villa.transaction_type === 'rent' ? 'Disewa' : 'Dijual'}
                      </span>
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{villa.bedrooms} KT</span>
                        <span>·</span>
                        <span>{villa.bathrooms} KM</span>
                        <span>·</span>
                        <span className="font-mono">{villa.building_size} m²</span>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-xs">
                        {villa.price_rent_daily && (
                          <div className="text-slate-800 dark:text-slate-200">
                            {formatPrice(villa.price_rent_daily)} <span className="text-[10px] text-slate-400 font-sans">/hr</span>
                          </div>
                        )}
                        {villa.price_rent_monthly && (
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatPrice(villa.price_rent_monthly)} <span className="text-[10px] text-slate-400 font-sans">/bln</span>
                          </div>
                        )}
                        {villa.price_sale && (
                          <div className="text-slate-900 dark:text-white font-extrabold text-[11px]">
                            Jual: {formatPrice(villa.price_sale)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Switcher (Direct interactive dropdown on row) */}
                    <td className="py-3 px-3">
                      <select
                        value={villa.status}
                        onChange={(e) => handleStatusChange(villa, e.target.value as VillaStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-colors ${
                          villa.status === 'available'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300/50'
                            : villa.status === 'rented'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300/50'
                            : villa.status === 'sold'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/50'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300/50'
                        }`}
                      >
                        <option value="available">Tersedia (Available)</option>
                        <option value="rented">Sedang Disewa (Rented)</option>
                        <option value="sold">Terjual (Sold)</option>
                        <option value="under_maintenance">Maintenance</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewPublicDetail(villa)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Buka Tampilan Halaman Publik"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingVilla(villa);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Sunting Spesifikasi & Foto Villa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus villa "${villa.title}" dari database portofolio?`)) {
                              onDeleteVilla(villa.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Hapus Listing"
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
      </div>

      {/* Edit / Create Modal */}
      <EditVillaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVilla(null);
        }}
        onSave={handleSaveModal}
        villaToEdit={editingVilla}
        settings={settings}
      />
    </div>
  );
};
