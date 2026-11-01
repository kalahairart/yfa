import React, { useState } from 'react';
import { Villa, VillaInquiry } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Sparkles, 
  Share2, 
  Check, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { translations } from '../../utils/translations';

interface PublicVillaDetailProps {
  villa: Villa;
  settings: ThemeSettings;
  onBack: () => void;
  onSubmitInquiry: (newInquiry: VillaInquiry) => void;
}

export const PublicVillaDetail: React.FC<PublicVillaDetailProps> = ({
  villa,
  settings,
  onBack,
  onSubmitInquiry,
}) => {
  const [activeImage, setActiveImage] = useState<string>(villa.images[0]);
  const [copiedLink, setCopiedLink] = useState(false);
  const lang = settings.language || 'id';
  const t = translations[lang];
  
  // Inquiry form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<VillaInquiry['inquiry_type']>('rent_daily');
  const [preferredDate, setPreferredDate] = useState('2026-11-15');
  const [message, setMessage] = useState(
    lang === 'id' 
      ? `Halo Agen Candra, saya ingin menanyakan ketersediaan "${villa.title}" dan informasi jadwal survei langsung.`
      : `Hello Agent Candra, I would like to inquire about the availability of "${villa.title}" and schedule a private viewing.`
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const formatCurrency = (usdVal?: number) => {
    if (!usdVal) return '-';
    if (settings.currency === 'IDR') {
      const idr = usdVal * 16000;
      if (idr >= 1000000000) {
        return `Rp ${(idr / 1000000000).toFixed(2)} Miliar`;
      }
      return `Rp ${idr.toLocaleString('id-ID')}`;
    }
    if (usdVal >= 1000000) {
      return `$${(usdVal / 1000000).toFixed(2)}M`;
    }
    return `$${usdVal.toLocaleString()}`;
  };

  const cleanPhone = (villa.agent_phone || '+6281234567890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    lang === 'id'
      ? `Halo Agen Candra, saya tertarik dengan ${villa.title} (ID: ${villa.id}) di ${villa.city}. Apakah masih tersedia?`
      : `Hello Agent Candra, I am interested in ${villa.title} (ID: ${villa.id}) in ${villa.city}. Is it still available?`
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    const newInquiry: VillaInquiry = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      villa_id: villa.id,
      villa_title: villa.title,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      client_email: clientEmail.trim() || '-',
      message: message.trim(),
      status: 'new',
      preferred_date: preferredDate,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      inquiry_type: inquiryType,
    };

    onSubmitInquiry(newInquiry);
    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={t.backToList}
          >
            <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{t.allVillas}</span>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{villa.city}</span>
              <span>/</span>
              <span className="font-mono text-slate-500">{villa.id}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {villa.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? t.copiedLink : t.shareLink}</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.waBtn} Agen</span>
          </a>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
              <img
                src={activeImage}
                alt={villa.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold uppercase bg-emerald-600 text-white shadow-md">
                  Status: {villa.status === 'available' ? t.available : villa.status === 'rented' ? t.rented : villa.status === 'sold' ? t.sold : t.maintenance}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-slate-950/80 text-white backdrop-blur-md">
                  {villa.transaction_type === 'both' ? t.allTransactions : villa.transaction_type === 'rent' ? t.forRent : t.forSale}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {villa.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-28 h-18 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img
                      ? 'border-emerald-500 scale-102 ring-2 ring-emerald-500/30'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Box Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {villa.price_rent_daily && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">{lang === 'id' ? 'Sewa Harian' : 'Daily Rent'}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(villa.price_rent_daily)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{t.daily}</span>
              </div>
            )}
            {villa.price_rent_monthly && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">{lang === 'id' ? 'Sewa Bulanan' : 'Monthly Rent'}</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  {formatCurrency(villa.price_rent_monthly)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{t.monthly}</span>
              </div>
            )}
            {villa.price_rent_yearly && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">{lang === 'id' ? 'Sewa Tahunan' : 'Yearly Rent'}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(villa.price_rent_yearly)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{t.yearly}</span>
              </div>
            )}
            {villa.price_sale && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300 block">{t.salePriceLabel}</span>
                <span className="text-base font-black text-emerald-900 dark:text-emerald-200 font-mono tabular-nums">
                  {formatCurrency(villa.price_sale)}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5">{t.verifiedCert}</span>
              </div>
            )}
          </div>

          {/* Specifications Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.specsTitle}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.bedroomsLabel}</span>
                <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">{villa.bedrooms} {lang === 'id' ? 'Kamar Tidur' : 'Bedrooms'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.baths}</span>
                <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">{villa.bathrooms} {lang === 'id' ? 'Kamar Mandi' : 'Bathrooms'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.building}</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{villa.building_size} m²</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.land}</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{villa.land_size} m² ({Math.round(villa.land_size / 100)} are)</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">{lang === 'id' ? 'Deskripsi Properti:' : 'Property Description:'}</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {villa.description}
              </p>
            </div>
          </div>

          {/* Amenities Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.amenitiesTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {villa.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Agent Card & Inquiry Booking Form (1 Col) */}
        <div className="space-y-6">
          {/* Agent Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {t.agentInCharge}
            </span>

            <div className="flex items-center gap-3.5">
              <img
                src="/src/assets/images/avatar_agent_male_1792833743569.jpg"
                alt={villa.agent_name || 'Candra Rusman'}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {villa.agent_name || 'Candra Rusman'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.principalBroker}
                </p>
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {villa.agent_phone || '+62 812-3456-7890'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${villa.agent_phone || '+6281234567890'}`}
                className="py-2.5 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.callBtn}</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.waBtn}</span>
              </a>
            </div>
          </div>

          {/* Form Booking & Kirim Pesan Minat */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.inquiryFormTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.inquiryFormSubtitle}
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.inquirySuccessTitle}</span>
                </div>
                <p>
                  {t.inquirySuccessDesc.replace('{name}', clientName)}
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="mt-2 text-xs font-bold underline text-emerald-700 dark:text-emerald-400"
                >
                  {t.sendAnotherMessage}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.fullNamePlaceholder}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.waNumber} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.waPlaceholder}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.emailOptional}
                  </label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {t.inquiryTypeLabel}
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                    >
                      <option value="rent_daily">{t.dailyRentOption}</option>
                      <option value="rent_monthly">{t.monthlyRentOption}</option>
                      <option value="rent_yearly">{t.yearlyRentOption}</option>
                      <option value="buy">{t.purchaseOption}</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {t.surveyDateLabel}
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.messageLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all text-center"
                >
                  {t.submitInquiryBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
