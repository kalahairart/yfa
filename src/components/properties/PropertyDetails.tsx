import React, { useState } from 'react';
import { Property, ThemeSettings } from '../../types/property';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  Printer, 
  Phone, 
  Mail, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  settings: ThemeSettings;
  onBack: () => void;
  onInquire?: (data: any) => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  settings,
  onBack,
}) => {
  const [activeImage, setActiveImage] = useState<string>(property.image);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryDate, setInquiryDate] = useState('2026-10-28');
  const [inquiryMessage, setInquiryMessage] = useState(
    'I would like to schedule a private inspection and receive the property deed documentation.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formatPrice = (val: number, period?: string) => {
    let formatted = '';
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      if (idr >= 1000000000) {
        formatted = `Rp ${(idr / 1000000000).toFixed(2)} Miliar`;
      } else {
        formatted = `Rp ${idr.toLocaleString('id-ID')}`;
      }
    } else {
      formatted = `$${val.toLocaleString()}`;
    }
    if (period === 'month') return `${formatted} / month`;
    if (period === 'year') return `${formatted} / year`;
    return formatted;
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{settings.language === 'id' ? 'Properti' : 'Properties'}</span>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{property.type}</span>
              <span>/</span>
              <span className="truncate max-w-[200px] text-slate-600 dark:text-slate-300">{property.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {property.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (settings.language === 'id' ? 'Tersalin!' : 'Copied!') : (settings.language === 'id' ? 'Bagikan' : 'Share')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{settings.language === 'id' ? 'Cetak Brosur' : 'Print PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gallery & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Photo Showcase */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs p-4 space-y-4">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={activeImage}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-emerald-600 text-white shadow-md">
                  {property.status}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md">
                  {property.type}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {property.gallery && property.gallery.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {property.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img
                        ? 'border-emerald-500 scale-102 ring-2 ring-emerald-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery view ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">{settings.language === 'id' ? 'Kamar Tidur' : 'Bedrooms'}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{property.bedrooms} Beds</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">{settings.language === 'id' ? 'Kamar Mandi' : 'Bathrooms'}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{property.bathrooms} Baths</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">{settings.language === 'id' ? 'Luas Bangunan' : 'Floor Area'}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">{property.areaSqFt.toLocaleString()} sqft</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">{settings.language === 'id' ? 'Garasi / Parkir' : 'Parking'}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{property.parkingSpaces} Lots</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {settings.language === 'id' ? 'Deskripsi & Ulasan Properti' : 'Property Overview & Story'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {property.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{settings.language === 'id' ? 'Tahun Pembangunan:' : 'Year Built:'} <strong>{property.yearBuilt}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{settings.language === 'id' ? 'Legalitas Sertifikat:' : 'Ownership Title:'} <strong>SHM (Freehold) Verified</strong></span>
              </div>
            </div>
          </div>

          {/* Amenities & Features */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {settings.language === 'id' ? 'Fasilitas & Keunggulan Unggulan' : 'Features & Verified Amenities'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map simulation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{settings.language === 'id' ? 'Lokasi & Lingkungan Sekitar' : 'Location & Neighborhood'}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{property.address}, {property.city}</span>
            </div>
            
            <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-center p-6">
              {/* Styled map graphic backdrop */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {property.address}
                </div>
                <div className="text-[11px] text-slate-500">
                  {property.city}, {property.country} · 15 min to International Airport & Private Beach Club
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Broker & Inspection Booking (1 Col) */}
        <div className="space-y-6">
          {/* Price Box */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg shadow-emerald-600/20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
              {settings.language === 'id' ? 'Harga Pembelian Resmi' : 'Official Listing Price'}
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-1 tabular-nums">
              {formatPrice(property.price, property.period)}
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/40 text-xs text-emerald-100 flex items-center justify-between">
              <span>{settings.language === 'id' ? 'Termasuk PPN & Balik Nama' : 'Includes Escrow & Notary Fee'}</span>
              <span className="font-bold">Verified</span>
            </div>
          </div>

          {/* Assigned Broker Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {settings.language === 'id' ? 'Agen Resmi Listing' : 'Listing Real Estate Broker'}
            </span>

            <div className="flex items-center gap-3">
              <img
                src={property.agentAvatar}
                alt={property.agentName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {property.agentName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Senior Real Estate Broker
                </p>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {property.agentPhone}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${property.agentPhone}`}
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{settings.language === 'id' ? 'Hubungi' : 'Call'}</span>
              </a>

              <a
                href={`https://wa.me/${property.agentPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Schedule Inspection Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {settings.language === 'id' ? 'Jadwalkan Kunjungan Survei' : 'Schedule Private Inspection'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {settings.language === 'id' 
                  ? 'Pilih tanggal kunjungan langsung atau tur virtual 3D' 
                  : 'Book an in-person viewing or 3D live virtual walkthrough'}
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{settings.language === 'id' ? 'Permintaan Terkirim!' : 'Inspection Request Received!'}</span>
                </div>
                <p>
                  {settings.language === 'id' 
                    ? `Agen ${property.agentName} akan menghubungi Anda via WhatsApp/Telepon dalam 15 menit.` 
                    : `Broker ${property.agentName} will contact you shortly to confirm the scheduled viewing.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {settings.language === 'id' ? 'Nama Lengkap' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robert Williams"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {settings.language === 'id' ? 'Nomor WhatsApp / Telepon' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+62 812-..."
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {settings.language === 'id' ? 'Tanggal Kunjungan' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {settings.language === 'id' ? 'Catatan Tambahan' : 'Notes & Inquiries'}
                  </label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all text-center"
                >
                  {settings.language === 'id' ? 'Kirim Permintaan Survei' : 'Submit Viewing Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
