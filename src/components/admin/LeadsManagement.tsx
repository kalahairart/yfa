import React, { useState } from 'react';
import { VillaInquiry } from '../../types/villa';
import { ThemeSettings } from '../../types/property';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X, 
  Trash2 
} from 'lucide-react';

interface LeadsManagementProps {
  inquiries: VillaInquiry[];
  settings: ThemeSettings;
  onUpdateStatus: (id: string, newStatus: VillaInquiry['status']) => void;
  onAddLead: (lead: VillaInquiry) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadsManagement: React.FC<LeadsManagementProps> = ({
  inquiries,
  settings,
  onUpdateStatus,
  onAddLead,
  onDeleteLead,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+62 ');
  const [email, setEmail] = useState('');
  const [villaTitle, setVillaTitle] = useState('The Bamboo Sanctuary Eco-Luxury Ubud');
  const [inquiryType, setInquiryType] = useState<VillaInquiry['inquiry_type']>('rent_monthly');
  const [message, setMessage] = useState('Klien menanyakan ketersediaan dan negosiasi sewa.');

  const getStatusBadge = (status: VillaInquiry['status']) => {
    switch (status) {
      case 'new':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200';
      case 'viewing_scheduled':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200';
      case 'negotiation':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200';
      case 'won':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200';
      case 'closed':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300';
    }
  };

  const getStatusLabel = (status: VillaInquiry['status']) => {
    switch (status) {
      case 'new': return 'Lead Baru';
      case 'contacted': return 'Sudah Dihubungi';
      case 'viewing_scheduled': return 'Jadwal Survei';
      case 'negotiation': return 'Tahap Negosiasi';
      case 'won': return 'Deal Selesai (Won)';
      case 'closed': return 'Ditutup / Batal';
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.client_name.toLowerCase().includes(search.toLowerCase()) ||
      inq.client_phone.includes(search) ||
      inq.villa_title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || inq.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newLead: VillaInquiry = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      villa_id: 'VLA-001',
      villa_title: villaTitle,
      client_name: name.trim(),
      client_phone: phone.trim(),
      client_email: email.trim() || '-',
      message: message.trim(),
      status: 'new',
      preferred_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      inquiry_type: inquiryType,
    };

    onAddLead(newLead);
    setName('');
    setPhone('+62 ');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Leads & Client Inquiries CRM
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pantau dan kelola pipeline calon penyewa dan calon pembeli villa dari tahap inquiry hingga deal closing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Lead Manual</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama calon klien, WhatsApp, atau target villa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Tahapan Pipeline</option>
            <option value="new">Lead Baru</option>
            <option value="contacted">Sudah Dihubungi</option>
            <option value="viewing_scheduled">Jadwal Survei</option>
            <option value="negotiation">Tahap Negosiasi</option>
            <option value="won">Deal Selesai (Won)</option>
            <option value="closed">Ditutup / Batal</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Calon Klien</th>
                <th className="py-3.5 px-3">Villa Peminat</th>
                <th className="py-3.5 px-3">Tipe Minat</th>
                <th className="py-3.5 px-3">Pesan & Kebutuhan</th>
                <th className="py-3.5 px-3">Tahapan Pipeline</th>
                <th className="py-3.5 px-4 text-right">Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filtered.map((inq) => {
                const cleanPhone = inq.client_phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Halo ${inq.client_name}, saya Agen Candra Rusman. Saya ingin menindaklanjuti pesan Anda mengenai "${inq.villa_title}". Kapan Anda ada waktu luang untuk berdiskusi?`
                )}`;

                return (
                  <tr key={inq.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {inq.client_name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{inq.client_phone}</span>
                          <span>·</span>
                          <span className="truncate max-w-[120px]">{inq.client_email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {inq.villa_title}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {inq.inquiry_type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 max-w-sm">
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-[11px]">
                        "{inq.message}"
                      </p>
                      {inq.preferred_date && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>Rencana: {inq.preferred_date}</span>
                        </div>
                      )}
                    </td>

                    {/* Pipeline Switcher */}
                    <td className="py-3.5 px-3">
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${getStatusBadge(inq.status)}`}
                      >
                        <option value="new">Lead Baru</option>
                        <option value="contacted">Sudah Dihubungi</option>
                        <option value="viewing_scheduled">Jadwal Survei</option>
                        <option value="negotiation">Tahap Negosiasi</option>
                        <option value="won">Deal Selesai (Won)</option>
                        <option value="closed">Ditutup / Batal</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm text-[11px] transition-colors"
                          title="Kirim pesan WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus catatan lead "${inq.client_name}"?`)) {
                              onDeleteLead(inq.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Hapus Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Pencatatan Lead / Klien Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 mt-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Calon Klien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+62 812-..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="client@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Villa yang Diminati
                </label>
                <input
                  type="text"
                  value={villaTitle}
                  onChange={(e) => setVillaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tipe Minat
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="rent_daily">Sewa Harian</option>
                  <option value="rent_monthly">Sewa Bulanan</option>
                  <option value="rent_yearly">Sewa Tahunan</option>
                  <option value="buy">Membeli Villa</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Kebutuhan
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
