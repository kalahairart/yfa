import React, { useState, useEffect } from 'react';
import { Villa, VillaStatus, TransactionType } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { X, Building2, Upload, Sparkles, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface EditVillaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (villaData: Villa) => void;
  villaToEdit?: Villa | null;
  settings: ThemeSettings;
}

export const EditVillaModal: React.FC<EditVillaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  villaToEdit,
  settings,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('Ubud');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<VillaStatus>('available');
  const [transactionType, setTransactionType] = useState<TransactionType>('both');
  const [priceDaily, setPriceDaily] = useState('450');
  const [priceMonthly, setPriceMonthly] = useState('6500');
  const [priceYearly, setPriceYearly] = useState('58000');
  const [priceSale, setPriceSale] = useState('890000');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('4');
  const [buildingSize, setBuildingSize] = useState('420');
  const [landSize, setLandSize] = useState('850');
  const [isFeatured, setIsFeatured] = useState(true);

  const imagePresets = [
    { label: 'Eco Bamboo Ubud', url: '/src/assets/images/villa_tropical_bamboo_1792908924954.jpg' },
    { label: 'Mediterranean Canggu', url: '/src/assets/images/villa_mediterranean_bali_1792908924438.jpg' },
    { label: 'Cliffside Uluwatu', url: '/src/assets/images/property_luxury_villa_1792833743009.jpg' },
    { label: 'Timber Minimalist Seminyak', url: '/src/assets/images/property_modern_suburban_1792833742979.jpg' },
    { label: 'Penthouse Sanur', url: '/src/assets/images/property_penthouse_skyline_1792833742837.jpg' },
  ];
  const [selectedImage, setSelectedImage] = useState(imagePresets[0].url);

  const availableFeatures = [
    'Private Swimming Pool',
    'High-Speed Starlink WiFi',
    'Open-Air Designer Kitchen',
    'Sunken Lounge Deck',
    'Jungle & River Valley View',
    'Panoramic Ocean View',
    'Walking Distance to Beach',
    '24/7 Gated Security',
    'Private Parking Garage',
    'Solar Powered Backup',
    'Staff Quarters & Butler',
    'Full Furnished Teak Wood'
  ];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Private Swimming Pool',
    'High-Speed Starlink WiFi',
    '24/7 Gated Security'
  ]);

  useEffect(() => {
    if (villaToEdit) {
      setTitle(villaToEdit.title);
      setSlug(villaToEdit.slug);
      setCity(villaToEdit.city);
      setAddress(villaToEdit.address);
      setDescription(villaToEdit.description);
      setStatus(villaToEdit.status);
      setTransactionType(villaToEdit.transaction_type);
      setPriceDaily(villaToEdit.price_rent_daily?.toString() || '');
      setPriceMonthly(villaToEdit.price_rent_monthly?.toString() || '');
      setPriceYearly(villaToEdit.price_rent_yearly?.toString() || '');
      setPriceSale(villaToEdit.price_sale?.toString() || '');
      setBedrooms(villaToEdit.bedrooms.toString());
      setBathrooms(villaToEdit.bathrooms.toString());
      setBuildingSize(villaToEdit.building_size.toString());
      setLandSize(villaToEdit.land_size.toString());
      setIsFeatured(villaToEdit.is_featured);
      setSelectedImage(villaToEdit.images[0] || imagePresets[0].url);
      setSelectedFeatures(villaToEdit.features || []);
    } else {
      setTitle('');
      setSlug('');
      setAddress('');
      setDescription('Villa mewah arsitektural di kawasan prima Bali dengan fasilitas lengkap.');
      setStatus('available');
      setTransactionType('both');
    }
  }, [villaToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleFeature = (name: string) => {
    if (selectedFeatures.includes(name)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== name));
    } else {
      setSelectedFeatures([...selectedFeatures, name]);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!villaToEdit) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    const savedVilla: Villa = {
      id: villaToEdit ? villaToEdit.id : `VLA-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      status,
      transaction_type: transactionType,
      price_rent_daily: priceDaily ? Number(priceDaily) : undefined,
      price_rent_monthly: priceMonthly ? Number(priceMonthly) : undefined,
      price_rent_yearly: priceYearly ? Number(priceYearly) : undefined,
      price_sale: priceSale ? Number(priceSale) : undefined,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 3,
      building_size: Number(buildingSize) || 350,
      land_size: Number(landSize) || 500,
      features: selectedFeatures,
      is_featured: isFeatured,
      images: [selectedImage, ...imagePresets.map((p) => p.url).filter((u) => u !== selectedImage)],
      created_at: villaToEdit ? villaToEdit.created_at : new Date().toISOString().split('T')[0],
      agent_id: 'AGT-01',
      agent_name: 'Candra Rusman (Principal Villa Broker)',
      agent_phone: '+6281234567890',
    };

    onSave(savedVilla);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <span>{villaToEdit ? 'Edit Data Villa' : 'Tambah Villa Baru ke Portofolio'}</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Kelola spesifikasi, harga sewa/jual, dan integrasi foto Supabase Storage
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bagian 1: Informasi Utama */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              1. Informasi Pokok Villa
            </h4>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Judul Villa Listing *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Sanctuary Bamboo & Waterfall Villa"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Wilayah / Kota di Bali
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  <option value="Ubud">Ubud</option>
                  <option value="Canggu">Canggu</option>
                  <option value="Uluwatu">Uluwatu</option>
                  <option value="Seminyak">Seminyak</option>
                  <option value="Sanur">Sanur</option>
                  <option value="Tabanan">Tabanan</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tipe Transaksi
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <option value="both">Sewa & Jual (Both)</option>
                  <option value="rent">Hanya Disewa (Rent Only)</option>
                  <option value="sale">Hanya Dijual (Sale Only)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Status Operasional
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VillaStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-emerald-600"
                >
                  <option value="available">Tersedia (Available)</option>
                  <option value="rented">Sedang Disewa (Rented)</option>
                  <option value="sold">Terjual (Sold)</option>
                  <option value="under_maintenance">Renovasi (Maintenance)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Alamat Lengkap *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jl. Raya Sayan, Banjar Baung, Sayan, Ubud"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Bagian 2: Skema Harga Sewa & Jual */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              2. Skema Harga (Rent & Sale Pricing)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sewa Harian ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 450"
                  value={priceDaily}
                  onChange={(e) => setPriceDaily(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sewa Bulanan ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 6500"
                  value={priceMonthly}
                  onChange={(e) => setPriceMonthly(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-emerald-600 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sewa Tahunan ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 58000"
                  value={priceYearly}
                  onChange={(e) => setPriceYearly(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Harga Jual ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 890000"
                  value={priceSale}
                  onChange={(e) => setPriceSale(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white font-extrabold"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Dimensi & Fitur */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              3. Dimensi Bangunan & Tanah
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kamar Tidur
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kamar Mandi
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Luas Bangunan (m²)
                </label>
                <input
                  type="number"
                  value={buildingSize}
                  onChange={(e) => setBuildingSize(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Luas Tanah (m²)
                </label>
                <input
                  type="number"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Deskripsi Lengkap Villa
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl leading-relaxed"
              />
            </div>
          </div>

          {/* Bagian 4: Foto Galeri Supabase Storage */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center justify-between">
              <span>4. Foto Villa (Supabase Storage Bucket: `villa-photos`)</span>
              <span className="text-emerald-500 font-bold lowercase">public bucket</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {imagePresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImage(preset.url)}
                  className={`relative rounded-2xl overflow-hidden aspect-[16/10] border-2 transition-all ${
                    selectedImage === preset.url
                      ? 'border-emerald-500 scale-102 ring-2 ring-emerald-500/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 inset-x-1 bg-black/70 text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bagian 5: Checklist Fasilitas */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              5. Fasilitas & Keunggulan
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableFeatures.map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="truncate">{feat}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
            >
              {villaToEdit ? 'Simpan Perubahan Villa' : 'Publikasikan Villa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
