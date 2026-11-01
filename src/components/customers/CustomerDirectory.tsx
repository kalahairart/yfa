import React, { useState } from 'react';
import { Customer, ThemeSettings } from '../../types/property';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  DollarSign, 
  X, 
  CheckCircle2, 
  Building 
} from 'lucide-react';

interface CustomerDirectoryProps {
  customers: Customer[];
  settings: ThemeSettings;
  onAddCustomer: (newCustomer: Customer) => void;
  onUpdateStatus: (id: string, newStatus: Customer['status']) => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
  customers,
  settings,
  onAddCustomer,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+62 ');
  const [type, setType] = useState<Customer['type']>('Buyer');
  const [interestProperty, setInterestProperty] = useState('');
  const [budget, setBudget] = useState('1500000');
  const [notes, setNotes] = useState('');

  const formatBudget = (val: number) => {
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      if (idr >= 1000000000) {
        return `Rp ${(idr / 1000000000).toFixed(1)} M`;
      }
      return `Rp ${idr.toLocaleString('id-ID')}`;
    }
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${val.toLocaleString()}`;
  };

  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'Hot':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50';
      case 'Viewing':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50';
      case 'Negotiation':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/50';
      case 'Warm':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50';
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50';
    }
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.interestProperty.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCust: Customer = {
      id: `cst-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      type,
      interestProperty: interestProperty.trim() || 'General Property Portfolio Inquiry',
      budget: Number(budget) || 1000000,
      status: 'Hot',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
    };

    onAddCustomer(newCust);
    setName('');
    setEmail('');
    setInterestProperty('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {settings.language === 'id' ? 'Manajemen Klien & Prospek (CRM)' : 'Client & Prospect CRM'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {settings.language === 'id' 
              ? 'Pantau tahapan negosiasi pembeli, penyewa, dan investor institusi' 
              : 'Track buyer pipeline, viewing progress, and escrow negotiations'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{settings.language === 'id' ? 'Tambah Klien Baru' : 'Add New Client'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={settings.language === 'id' ? 'Cari nama klien, email, atau properti diminati...' : 'Search client name, email, or interested property...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">{settings.language === 'id' ? 'Semua Tahapan' : 'All Pipeline Stages'}</option>
            <option value="Hot">Hot Lead</option>
            <option value="Viewing">Viewing Scheduled</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Warm">Warm Prospect</option>
            <option value="Closed">Closed Deal</option>
          </select>
        </div>
      </div>

      {/* CRM Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{settings.language === 'id' ? 'Nama Klien' : 'Client Details'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Tipe' : 'Type'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Properti Diminati' : 'Target Property'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Anggaran' : 'Budget'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Tahapan Status' : 'Pipeline Stage'}</th>
                <th className="py-3.5 px-4 text-right">{settings.language === 'id' ? 'Kontak Langsung' : 'Contact'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {client.email} · {client.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {client.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 max-w-xs">
                    <span className="text-slate-700 dark:text-slate-300 truncate block">
                      {client.interestProperty}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatBudget(client.budget)}
                  </td>

                  <td className="py-3.5 px-3">
                    <select
                      value={client.status}
                      onChange={(e) => onUpdateStatus(client.id, e.target.value as Customer['status'])}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border focus:outline-none ${getStatusBadge(client.status)}`}
                    >
                      <option value="Hot">Hot</option>
                      <option value="Viewing">Viewing</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Warm">Warm</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${client.phone}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${client.email}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>{settings.language === 'id' ? 'Tambah Prospek Klien' : 'Add New Client Prospect'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Nama Klien' : 'Client Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Gunawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@corporate.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {settings.language === 'id' ? 'Kategori Klien' : 'Client Category'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    <option value="Buyer">Buyer</option>
                    <option value="Investor">Investor</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Seller">Seller</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {settings.language === 'id' ? 'Anggaran (USD)' : 'Budget (USD)'}
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Properti yang Diminati' : 'Target Property / Interest'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Seaside Horizon Villa"
                  value={interestProperty}
                  onChange={(e) => setInterestProperty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
                >
                  {settings.language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  {settings.language === 'id' ? 'Simpan Klien' : 'Save Prospect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
