import React, { useState } from 'react';
import { Agent, ThemeSettings } from '../../types/property';
import { 
  Users, 
  Plus, 
  Search, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Building,
  CheckCircle2,
  X
} from 'lucide-react';

interface AgentDirectoryProps {
  agents: Agent[];
  settings: ThemeSettings;
  onAddAgent: (newAgent: Agent) => void;
}

export const AgentDirectory: React.FC<AgentDirectoryProps> = ({
  agents,
  settings,
  onAddAgent,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Property Consultant');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+62 812-');
  const [location, setLocation] = useState('Bali & Coastal Hub');

  const formatSales = (val: number) => {
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      return `Rp ${(idr / 1000000000).toFixed(1)} M`;
    }
    return `$${(val / 1000000).toFixed(1)}M`;
  };

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newAgent: Agent = {
      id: `agt-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
      propertiesCount: 4,
      dealsClosed: 8,
      rating: 4.9,
      totalSalesValue: 3500000,
      status: 'Active',
      location: location.trim(),
    };

    onAddAgent(newAgent);
    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {settings.language === 'id' ? 'Direktori Agen & Broker Properti' : 'Broker & Agent Directory'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {settings.language === 'id' 
              ? 'Kelola lisensi, kinerja komisi, dan portofolio agen' 
              : 'Manage licensed real estate brokers, performance tiers, and listings'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{settings.language === 'id' ? 'Tambah Agen Baru' : 'Add New Broker'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={settings.language === 'id' ? 'Cari nama agen, wilayah kerja, atau spesialisasi...' : 'Search agent name, territory, or specialty...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          {filteredAgents.length} {settings.language === 'id' ? 'agen terdaftar' : 'registered agents'}
        </div>
      </div>

      {/* Agents Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Avatar & status badge */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                    agent.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </div>

                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{agent.rating}</span>
                </div>
              </div>

              {/* Name & Role */}
              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {agent.role}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{agent.location}</span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {settings.language === 'id' ? 'Listing' : 'Listings'}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                    {agent.propertiesCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {settings.language === 'id' ? 'Volume' : 'Sales'}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                    {formatSales(agent.totalSalesValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <a
                href={`tel:${agent.phone}`}
                className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{settings.language === 'id' ? 'Telepon' : 'Call'}</span>
              </a>

              <a
                href={`mailto:${agent.email}`}
                className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>{settings.language === 'id' ? 'Pendaftaran Agen Properti' : 'Register New Broker'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Nama Lengkap Agen' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Posisi / Spesialisasi' : 'Role / Specialty'}
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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
                  placeholder="agent@lahomes.realestate"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Nomor Telepon / WhatsApp' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {settings.language === 'id' ? 'Wilayah Operasional' : 'Regional Territory'}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  {settings.language === 'id' ? 'Daftarkan Agen' : 'Save Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
