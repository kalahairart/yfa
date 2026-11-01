import React, { useState, useEffect } from 'react';
import { 
  Villa, 
  VillaOwner, 
  VillaInquiry, 
  PublicSearchFilter 
} from './types/villa';
import { 
  INITIAL_VILLAS, 
  INITIAL_OWNERS, 
  INITIAL_INQUIRIES 
} from './data/villaData';
import { ThemeSettings } from './types/property';
import { AdminUser, LoginCredentials } from './types/auth';
import { INITIAL_CHAT_THREADS } from './data/mockData';

// Public Components
import { PublicNavbar } from './components/public/PublicNavbar';
import { HeroSection } from './components/public/HeroSection';
import { PublicVillaCard } from './components/public/PublicVillaCard';
import { PublicVillaDetail } from './components/public/PublicVillaDetail';
import { PublicFooter } from './components/public/PublicFooter';
import { translations } from './utils/translations';

// Admin / Agent Dashboard Components (Lahomes)
import { Navbar as AdminNavbar } from './components/layout/Navbar';
import { Sidebar as AdminSidebar, ActiveTab } from './components/layout/Sidebar';
import { SettingsDrawer } from './components/layout/SettingsDrawer';
import { LahomesOverview } from './components/admin/LahomesOverview';
import { VillaManagement } from './components/admin/VillaManagement';
import { LeadsManagement } from './components/admin/LeadsManagement';
import { OwnerTracker } from './components/admin/OwnerTracker';
import { DeveloperCenter } from './components/admin/DeveloperCenter';
import { PropertyChat } from './components/messages/PropertyChat';
import { LoginModal } from './components/auth/LoginModal';
import { 
  getSupabaseConfig, 
  getSupabaseClient, 
  signOutFromSupabase, 
  fetchVillasFromSupabase 
} from './utils/supabase';

import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  Globe, 
  Filter, 
  Key, 
  Phone,
  Lock,
  LogOut,
  UserCheck
} from 'lucide-react';

const DEFAULT_SETTINGS: ThemeSettings = {
  mode: 'light',
  sidebarColor: 'dark',
  sidebarCondensed: false,
  currency: 'USD',
  language: 'id',
};

const DEFAULT_FILTER: PublicSearchFilter = {
  location: 'all',
  transaction_type: 'all',
  bedrooms: 'all',
  category: 'all',
  maxPrice: 3000000,
};

// Initial default admin user for immediate demo access
const DEFAULT_DEMO_ADMIN: AdminUser = {
  id: 'usr-candra-01',
  name: 'Candra Rusman',
  email: 'candra.rusman@lahomes.realestate',
  role: 'principal_broker',
  avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
  token: 'sb-token-candra-2026',
  loginTime: 'Hari ini',
};

export default function App() {
  // Authentication State (persisted in localStorage or Supabase session)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('lahomes_auth_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Top-level Mode: 'public' (Guest / Buyer) vs 'admin' (Lahomes Agent Dashboard)
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');

  // Shared Data States
  const [villas, setVillas] = useState<Villa[]>(INITIAL_VILLAS);
  const [owners, setOwners] = useState<VillaOwner[]>(INITIAL_OWNERS);
  const [inquiries, setInquiries] = useState<VillaInquiry[]>(INITIAL_INQUIRIES);

  // Check Supabase session & fetch remote villas on mount
  useEffect(() => {
    const initAuthAndData = async () => {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data } = await client.auth.getSession();
          if (data?.session?.user) {
            const u = data.session.user;
            const adminUser: AdminUser = {
              id: u.id,
              name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Agen Supabase',
              email: u.email || '',
              role: (u.user_metadata?.role as any) || 'principal_broker',
              avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
              token: data.session.access_token,
              loginTime: 'Sesi Aktif',
            };
            setCurrentUser(adminUser);
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
        }

        try {
          const remoteVillas = await fetchVillasFromSupabase();
          if (remoteVillas && remoteVillas.length > 0) {
            setVillas(remoteVillas);
          }
        } catch (err) {
          console.error('Error fetching villas from Supabase:', err);
        }
      }
    };
    initAuthAndData();
  }, []);

  // Navigation & Selection States
  const [activeAdminTab, setActiveAdminTab] = useState<ActiveTab>('dashboard');
  const [selectedPublicVilla, setSelectedPublicVilla] = useState<Villa | null>(null);
  const [publicFilter, setPublicFilter] = useState<PublicSearchFilter>(DEFAULT_FILTER);
  
  // UI & Customizer States
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [adminSearch, setAdminSearch] = useState('');

  // Sync dark class on document element
  useEffect(() => {
    if (settings.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.mode]);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Auth Handlers
  const handleLogin = (credentials: LoginCredentials, userObj?: AdminUser): boolean => {
    const authenticatedUser: AdminUser = userObj || {
      id: `usr-demo-${Date.now().toString().slice(-4)}`,
      name: credentials.email ? credentials.email.split('@')[0] : 'Candra Rusman',
      email: credentials.email || 'candra.rusman@lahomes.realestate',
      role: 'principal_broker',
      avatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
      token: `sb-token-${Date.now()}`,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentUser(authenticatedUser);
    try {
      localStorage.setItem('lahomes_auth_admin', JSON.stringify(authenticatedUser));
    } catch {}

    setViewMode('admin');
    showToast(`Login berhasil! Selamat datang, ${authenticatedUser.name}.`);
    return true;
  };

  const handleLogout = async () => {
    await signOutFromSupabase();
    setCurrentUser(null);
    try {
      localStorage.removeItem('lahomes_auth_admin');
    } catch {}
    setViewMode('public');
    showToast('Anda telah berhasil logout dari sesi admin.');
  };

  const requireAuth = (actionName: string): boolean => {
    if (!currentUser) {
      showToast(`Akses Ditolak: Anda harus login untuk ${actionName}!`);
      setIsLoginModalOpen(true);
      return false;
    }
    return true;
  };

  // Villa Actions (Protected)
  const handleAddVilla = (newVilla: Villa) => {
    if (!requireAuth('menambahkan villa baru')) return;
    setVillas([newVilla, ...villas]);
    showToast(`Villa "${newVilla.title}" berhasil dipublikasikan ke listing!`);
  };

  const handleUpdateVilla = (updated: Villa) => {
    if (!requireAuth('memperbarui data villa')) return;
    setVillas(villas.map((v) => (v.id === updated.id ? updated : v)));
    showToast(`Perubahan data villa "${updated.title}" berhasil disimpan.`);
  };

  const handleDeleteVilla = (id: string) => {
    if (!requireAuth('menghapus data villa')) return;
    setVillas(villas.filter((v) => v.id !== id));
    showToast('Listing villa berhasil dihapus dari portofolio.');
  };

  // Inquiry / Lead Actions
  const handleSubmitInquiry = (newInquiry: VillaInquiry) => {
    setInquiries([newInquiry, ...inquiries]);
    showToast(`Pesan minat dari ${newInquiry.client_name} tercatat ke CRM Leads!`);
  };

  const handleUpdateLeadStatus = (id: string, newStatus: VillaInquiry['status']) => {
    if (!requireAuth('mengubah tahapan pipeline lead')) return;
    setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));
    showToast('Status tahapan lead berhasil diperbarui.');
  };

  const handleAddLeadManual = (lead: VillaInquiry) => {
    if (!requireAuth('mencatat lead manual')) return;
    setInquiries([lead, ...inquiries]);
    showToast(`Lead baru "${lead.client_name}" berhasil dicatat.`);
  };

  const handleDeleteLead = (id: string) => {
    if (!requireAuth('menghapus catatan lead')) return;
    setInquiries(inquiries.filter((inq) => inq.id !== id));
    showToast('Catatan lead dihapus.');
  };

  // Owner Actions (Protected)
  const handleAddOwner = (newOwner: VillaOwner) => {
    if (!requireAuth('menambahkan data rahasia pemilik')) return;
    setOwners([newOwner, ...owners]);
    showToast(`Data rahasia pemilik "${newOwner.owner_name}" berhasil disimpan.`);
  };

  const handleDeleteOwner = (id: string) => {
    if (!requireAuth('menghapus data pemilik')) return;
    setOwners(owners.filter((o) => o.id !== id));
    showToast('Data pemilik dihapus.');
  };

  // Public Filter Matching
  const filteredPublicVillas = villas.filter((v) => {
    const matchesLoc = publicFilter.location === 'all' || v.city === publicFilter.location;
    const matchesType =
      publicFilter.transaction_type === 'all' ||
      v.transaction_type === publicFilter.transaction_type ||
      v.transaction_type === 'both';
    const matchesBeds =
      publicFilter.bedrooms === 'all' || v.bedrooms >= Number(publicFilter.bedrooms);
    return matchesLoc && matchesType && matchesBeds;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0c1222] text-slate-800 dark:text-slate-100 antialiased flex flex-col font-sans transition-colors">
      {/* Global Notification Toast */}
      {notificationToast && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{notificationToast}</span>
          <button onClick={() => setNotificationToast(null)} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}

      {/* ========================================================== */}
      {/* VIEW MODE 1: PUBLIC FACING WEBSITE (GUEST / BUYER) */}
      {/* ========================================================== */}
      {viewMode === 'public' ? (
        <div className="flex-1 flex flex-col">
          <PublicNavbar
            settings={settings}
            onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
            onSwitchToAdmin={() => {
              if (!currentUser) {
                setIsLoginModalOpen(true);
              } else {
                setViewMode('admin');
              }
            }}
            onNavigateHome={() => setSelectedPublicVilla(null)}
            onFilterTransaction={(type) => setPublicFilter({ ...publicFilter, transaction_type: type })}
            agentPhone="+62 812-3456-7890"
            isAuthenticated={!!currentUser}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            {selectedPublicVilla ? (
              <PublicVillaDetail
                villa={selectedPublicVilla}
                settings={settings}
                onBack={() => setSelectedPublicVilla(null)}
                onSubmitInquiry={handleSubmitInquiry}
              />
            ) : (
              <>
                {/* Hero Section */}
                <HeroSection
                  filter={publicFilter}
                  onFilterChange={(newF) => setPublicFilter({ ...publicFilter, ...newF })}
                  onSearch={() => {
                    document.getElementById('villas-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  totalVillasCount={filteredPublicVillas.length}
                  settings={settings}
                />

                {/* Villas Listing Grid */}
                <section id="villas-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {translations[settings.language || 'id'].collectionTitle}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {translations[settings.language || 'id'].collectionSubtitle.replace('{count}', String(filteredPublicVillas.length))}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPublicFilter(DEFAULT_FILTER)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        {translations[settings.language || 'id'].resetFilter}
                      </button>
                    </div>
                  </div>

                  {filteredPublicVillas.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                      <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                        {translations[settings.language || 'id'].noVillasFound}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {translations[settings.language || 'id'].noVillasDesc}
                      </p>
                      <button
                        onClick={() => setPublicFilter(DEFAULT_FILTER)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                      >
                        {translations[settings.language || 'id'].showAllVillas}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredPublicVillas.map((villa) => (
                        <PublicVillaCard
                          key={villa.id}
                          villa={villa}
                          settings={settings}
                          onSelect={(v) => {
                            setSelectedPublicVilla(v);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </main>

          <PublicFooter
            onSwitchToAdmin={() => {
              if (!currentUser) {
                setIsLoginModalOpen(true);
              } else {
                setViewMode('admin');
              }
            }}
            agentPhone="+62 812-3456-7890"
            language={settings.language}
          />
        </div>
      ) : (
        /* ========================================================== */
        /* VIEW MODE 2: ADMIN / AGENT DASHBOARD (LAHOMES TEMPLATE) */
        /* ========================================================== */
        !currentUser ? (
          /* Locked State if unauthenticated */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Akses Dibatasi: Khusus Agen & Admin
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Sistem manajemen properti, data rahasia pemilik, dan CRM leads memerlukan otentikasi login admin terlebih dahulu.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Buka Form Login Admin</span>
                </button>

                <button
                  onClick={() => setViewMode('public')}
                  className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Kembali ke Website Publik
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex min-h-0">
            <AdminSidebar
              activeTab={activeAdminTab}
              onSelectTab={setActiveAdminTab}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              settings={settings}
              onOpenSettings={() => setIsSettingsDrawerOpen(true)}
              onSwitchToPublic={() => setViewMode('public')}
              unreadLeadsCount={inquiries.filter((i) => i.status === 'new').length}
              onLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col min-w-0">
              <AdminNavbar
                settings={settings}
                onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
                onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                onOpenSettingsDrawer={() => setIsSettingsDrawerOpen(true)}
                searchQuery={adminSearch}
                onSearchChange={setAdminSearch}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenDeveloperCenter={() => setActiveAdminTab('developer')}
              />

              {/* Dashboard Viewport Content */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                {/* Breadcrumb strip */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Lahomes Admin</span>
                    <span>/</span>
                    <span className="capitalize text-emerald-600 dark:text-emerald-400 font-bold">
                      {activeAdminTab === 'dashboard' && 'Overview Analytics'}
                      {activeAdminTab === 'villas' && 'Manajemen Listing Villa'}
                      {activeAdminTab === 'leads' && 'Leads CRM Pipeline'}
                      {activeAdminTab === 'owners' && 'Owner & Landlord Tracker'}
                      {activeAdminTab === 'developer' && 'Supabase & Next.js Specs'}
                      {activeAdminTab === 'chat' && 'Live Inquiries Chat'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Login sebagai: <strong className="text-slate-700 dark:text-slate-200">{currentUser.name}</strong>
                    </span>
                    <button
                      onClick={() => setViewMode('public')}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Lihat Website Publik</span>
                    </button>
                  </div>
                </div>

                {/* Active Admin Tab Router */}
                {activeAdminTab === 'dashboard' && (
                  <LahomesOverview
                    villas={villas}
                    inquiries={inquiries}
                    settings={settings}
                    onNavigateToTab={setActiveAdminTab}
                    onSelectVilla={(v) => {
                      setSelectedPublicVilla(v);
                      setViewMode('public');
                    }}
                  />
                )}

                {activeAdminTab === 'villas' && (
                  <VillaManagement
                    villas={villas}
                    settings={settings}
                    onAddVilla={handleAddVilla}
                    onUpdateVilla={handleUpdateVilla}
                    onDeleteVilla={handleDeleteVilla}
                    onViewPublicDetail={(v) => {
                      setSelectedPublicVilla(v);
                      setViewMode('public');
                    }}
                  />
                )}

                {activeAdminTab === 'leads' && (
                  <LeadsManagement
                    inquiries={inquiries}
                    settings={settings}
                    onUpdateStatus={handleUpdateLeadStatus}
                    onAddLead={handleAddLeadManual}
                    onDeleteLead={handleDeleteLead}
                  />
                )}

                {activeAdminTab === 'owners' && (
                  <OwnerTracker
                    owners={owners}
                    settings={settings}
                    onAddOwner={handleAddOwner}
                    onDeleteOwner={handleDeleteOwner}
                  />
                )}

                {activeAdminTab === 'developer' && (
                  <DeveloperCenter />
                )}

                {activeAdminTab === 'chat' && (
                  <PropertyChat
                    threads={INITIAL_CHAT_THREADS}
                    settings={settings}
                  />
                )}
              </main>

              {/* Admin Footer */}
              <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#111827] px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Lahomes Villa Portal</span>
                    <span>© {new Date().getFullYear()} {currentUser.name}.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveAdminTab('developer')} className="hover:text-emerald-600">
                      Supabase SQL & Next.js Docs
                    </button>
                    <span>·</span>
                    <button onClick={handleLogout} className="text-rose-600 hover:underline font-semibold">
                      Logout
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        )
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        settings={settings}
        onOpenDeveloperCenter={() => {
          setViewMode('admin');
          setActiveAdminTab('developer');
        }}
      />

      {/* Theme Settings Customizer Drawer */}
      <SettingsDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setIsSettingsDrawerOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
        onResetSettings={() => setSettings(DEFAULT_SETTINGS)}
      />
    </div>
  );
}
