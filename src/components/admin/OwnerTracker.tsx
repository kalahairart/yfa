import React, { useState } from 'react';
import { VillaOwner, CertificateType } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  FileText, 
  Lock, 
  X, 
  Trash2, 
  Building2 
} from 'lucide-react';

interface OwnerTrackerProps {
  owners: VillaOwner[];
  settings: ThemeSettings;
  onAddOwner: (newOwner: VillaOwner) => void;
  onDeleteOwner: (id: string) => void;
}

export const OwnerTracker: React.FC<OwnerTrackerProps> = ({
  owners,
  settings,
  onAddOwner,
  onDeleteOwner,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+62 ');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [villaTitle, setVillaTitle] = useState('The Bamboo Sanctuary Eco-Luxury Ubud');
  const [certificateType, setCertificateType] = useState<CertificateType>('SHM (Hak Milik)');
  const [commissionRate, setCommissionRate] = useState('5% Jual / 10% Sewa');
  const [notes, setNotes] = useState('Sertifikat asli di notaris. IMB/Pondok Wisata lengkap.');
  const [bankAccount, setBankAccount] = useState('BCA 1234567890 a/n Pemilik');

  const filtered = owners.filter(
    (o) =>
      o.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      o.villa_title?.toLowerCase().includes(search.toLowerCase()) ||
      o.certificate_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !ownerPhone.trim()) return;

    const newOwner: VillaOwner = {
      id: `OWN-${Date.now().toString().slice(-4)}`,
      villa_id: 'VLA-001',
      villa_title: villaTitle,
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim(),
      owner_email: ownerEmail.trim(),
      certificate_type: certificateType,
      commission_rate: commissionRate.trim(),
      notes: notes.trim(),
      bank_account: bankAccount.trim(),
    };

    onAddOwner(newOwner);
    setOwnerName('');
    setOwnerPhone('+62 ');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Confidential Warning */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Owner & Landlord Tracker
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Lock className="w-3 h-3" />
              <span>Internal Agen Sahaja</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Catatan rahasia data pemilik asli villa, nomor kontak pribadi, tipe sertifikat/legalitas, dan kesepakatan komisi bagi hasil.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data Pemilik</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama pemilik, sertifikat tanah, atau villa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          {filtered.length} Pemilik Terdaftar
        </div>
      </div>

      {/* Owner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((owner) => {
          const cleanPhone = owner.owner_phone.replace(/[^0-9]/g, '');

          return (
            <div
              key={owner.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Villa: {owner.villa_title}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {owner.owner_name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                    {owner.certificate_type}
                  </span>
                </div>

                {/* Details list */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Kesepakatan Komisi Agen:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{owner.commission_rate}</span>
                  </div>

                  {owner.lease_expiry_year && (
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Tahun Akhir Leasehold:</span>
                      <span className="font-bold text-amber-600 font-mono">{owner.lease_expiry_year} (Sisa ~{owner.lease_expiry_year - 2026} Tahun)</span>
                    </div>
                  )}

                  {owner.bank_account && (
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Rekening Pembayaran:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{owner.bank_account}</span>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Catatan Notaris & Sertifikat:</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                      {owner.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${owner.owner_phone}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Telepon</span>
                  </a>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Halo Bapak/Ibu ${owner.owner_name}, ini Agen Candra Rusman terkait update villa Anda.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-bold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Hapus data pemilik "${owner.owner_name}"?`)) {
                      onDeleteOwner(owner.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Hapus Data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Owner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Pencatatan Pemilik Villa (Confidential)</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOwner} className="space-y-3 mt-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Pemilik / PT Asli *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. I Wayan Sudarta / PT Bali Villas"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+62 812-..."
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Pemilik
                  </label>
                  <input
                    type="email"
                    placeholder="owner@domain.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Villa yang Dimiliki
                </label>
                <input
                  type="text"
                  value={villaTitle}
                  onChange={(e) => setVillaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tipe Sertifikat
                  </label>
                  <select
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value as CertificateType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="SHM (Hak Milik)">SHM (Hak Milik)</option>
                    <option value="HGB (Hak Guna Bangunan)">HGB (Hak Guna Bangunan)</option>
                    <option value="Hak Pakai">Hak Pakai</option>
                    <option value="Leasehold 25-30 Tahun">Leasehold 25-30 Tahun</option>
                    <option value="Leasehold > 30 Tahun">Leasehold &gt; 30 Tahun</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kesepakatan Komisi
                  </label>
                  <input
                    type="text"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Rekening Bank Pembayaran
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCA 1234567890 a/n Pemilik"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Rahasia Legalitas & Notaris
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  Simpan Data Pemilik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
