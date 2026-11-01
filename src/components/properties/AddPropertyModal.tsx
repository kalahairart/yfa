import React, { useState } from 'react';
import { Property, ThemeSettings, PropertyType, PropertyStatus, Agent } from '../../types/property';
import { X, Building2, Upload, CheckCircle2, Sparkles } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProp: Property) => void;
  agents: Agent[];
  settings: ThemeSettings;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  agents,
  settings,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('Villa');
  const [status, setStatus] = useState<PropertyStatus>('For Sale');
  const [price, setPrice] = useState('1200000');
  const [period, setPeriod] = useState<'total' | 'month' | 'year'>('total');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bali');
  const [country, setCountry] = useState('Indonesia');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('4');
  const [areaSqFt, setAreaSqFt] = useState('4200');
  const [parkingSpaces, setParkingSpaces] = useState('2');
  const [yearBuilt, setYearBuilt] = useState('2025');
  const [description, setDescription] = useState(
    'Stunning modern architectural property with state-of-the-art finishes, lush panoramic views, and premium sustainable design.'
  );
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'agt-1');
  
  // Available image presets
  const imagePresets = [
    { label: 'Luxury Villa', url: '/src/assets/images/property_luxury_villa_1792833743009.jpg' },
    { label: 'Skyline Penthouse', url: '/src/assets/images/property_penthouse_skyline_1792833742837.jpg' },
    { label: 'Modern Residence', url: '/src/assets/images/property_modern_suburban_1792833742979.jpg' },
  ];
  const [selectedImage, setSelectedImage] = useState(imagePresets[0].url);

  // Amenities
  const availableAmenities = [
    'Infinity Pool',
    'Smart Home Tech',
    'Panoramic Ocean View',
    'City Skyline View',
    '24/7 Gated Security',
    'Private Garden',
    'EV Charging Dock',
    'Designer Kitchen',
    'Wine Cellar',
    'Gym & Wellness'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Infinity Pool',
    'Smart Home Tech',
    '24/7 Gated Security'
  ]);

  if (!isOpen) return null;

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    const chosenAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

    const newProperty: Property = {
      id: `prop-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      type,
      status,
      price: Number(price) || 500000,
      period: status === 'For Rent' ? period : 'total',
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 2,
      areaSqFt: Number(areaSqFt) || 2000,
      parkingSpaces: Number(parkingSpaces) || 1,
      featured: true,
      image: selectedImage,
      gallery: [selectedImage, ...imagePresets.map((p) => p.url).filter((u) => u !== selectedImage)],
      agentId: chosenAgent.id,
      agentName: chosenAgent.name,
      agentPhone: chosenAgent.phone,
      agentAvatar: chosenAgent.avatar,
      description: description.trim(),
      amenities: selectedAmenities,
      yearBuilt: Number(yearBuilt) || 2024,
      dateAdded: new Date().toISOString().split('T')[0],
      viewsCount: 1,
    };

    onAddProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <span>{settings.language === 'id' ? 'Form Tambah Properti Baru' : 'Create New Property Listing'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {settings.language === 'id' ? 'Lengkapi spesifikasi, harga, dan media visual' : 'Fill in architectural specifications, pricing, and visual media'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Section: Basic Info */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              1. {settings.language === 'id' ? 'Informasi Dasar Properti' : 'Basic Property Details'}
            </h4>
            
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {settings.language === 'id' ? 'Judul Listing Properti' : 'Property Listing Title'} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Oceanfront Glass Residence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Tipe Kategori' : 'Property Type'}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Status' : 'Listing Status'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="For Sale">For Sale (Dijual)</option>
                  <option value="For Rent">For Rent (Disewa)</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold (Terjual)</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Harga (USD)' : 'Price (USD)'} *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Specifications */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              2. {settings.language === 'id' ? 'Spesifikasi Arsitektural' : 'Architectural Specs'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Kamar Tidur' : 'Bedrooms'}
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Kamar Mandi' : 'Bathrooms'}
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Luas (sqft)' : 'Area (sqft)'}
                </label>
                <input
                  type="number"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Tahun Bangun' : 'Year Built'}
                </label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              3. {settings.language === 'id' ? 'Alamat & Lokasi' : 'Location Details'}
            </h4>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {settings.language === 'id' ? 'Alamat Lengkap' : 'Street Address'} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 18 Cliffside Boulevard, Pecatu"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Kota' : 'City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Negara' : 'Country'}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              4. {settings.language === 'id' ? 'Fasilitas Terverifikasi' : 'Amenities & Highlights'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableAmenities.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2 rounded-xl text-left border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{amenity}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Photo Preset & Broker */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              5. {settings.language === 'id' ? 'Foto Visual & Agen Pengelola' : 'Visual Asset & Broker'}
            </h4>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                {settings.language === 'id' ? 'Pilih Foto Resolusi Tinggi' : 'Select Hero Image'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {imagePresets.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all ${
                      selectedImage === preset.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {settings.language === 'id' ? 'Pilih Agen Penanggung Jawab' : 'Assign Managing Broker'}
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} — {agent.role} ({agent.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.language === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>{settings.language === 'id' ? 'Publikasikan Properti' : 'Publish Property'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
