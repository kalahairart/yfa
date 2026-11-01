import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Code2,
  MessageSquare,
  Sliders,
  ExternalLink,
  X,
  Sparkles,
  Building,
  Key,
  LogOut
} from 'lucide-react';
import { ThemeSettings } from '../../types/property';

export type ActiveTab = 
  | 'dashboard' 
  | 'villas' 
  | 'leads' 
  | 'owners' 
  | 'developer' 
  | 'chat'
  | 'property-list'
  | 'property-grid'
  | 'property-details';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  settings: ThemeSettings;
  onOpenSettings: () => void;
  onSwitchToPublic: () => void;
  unreadLeadsCount?: number;
  onLogout?: () => void;
}

interface MenuItem {
  id: ActiveTab;
  label: string;
  icon: any;
  badge?: string;
  badgeCount?: number;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  settings,
  onOpenSettings,
  onSwitchToPublic,
  unreadLeadsCount = 2,
  onLogout,
}) => {
  const isDarkSidebar = settings.sidebarColor === 'dark' || settings.mode === 'dark';
  const isEn = settings.language === 'en';

  const menuSections: MenuSection[] = [
    {
      label: isEn ? 'MAIN NAVIGATION' : 'NAVIGASI UTAMA',
      items: [
        {
          id: 'dashboard',
          label: isEn ? 'Overview & Metrics' : 'Overview & Metrik',
          icon: LayoutDashboard,
          badge: isEn ? 'Active' : 'Aktif',
        },
      ],
    },
    {
      label: isEn ? 'VILLA PORTFOLIO' : 'MANAJEMEN PORTOFOLIO VILLA',
      items: [
        {
          id: 'villas',
          label: isEn ? 'Villa Catalog & CRUD' : 'Katalog & CRUD Villa',
          icon: Building2,
        },
        {
          id: 'leads',
          label: isEn ? 'Leads & Inquiries CRM' : 'Leads & Inquiry CRM',
          icon: Users,
          badgeCount: unreadLeadsCount,
        },
        {
          id: 'owners',
          label: isEn ? 'Owner & Landlord Tracker' : 'Owner & Landlord Tracker',
          icon: ShieldCheck,
          badge: isEn ? 'Private' : 'Rahasia',
        },
      ],
    },
    {
      label: isEn ? 'DEVELOPER & SPECS' : 'DEVELOPER & ARSITEKTUR',
      items: [
        {
          id: 'developer',
          label: isEn ? 'Supabase SQL & Next.js' : 'Supabase SQL & Next.js',
          icon: Code2,
          badge: 'Specs',
        },
      ],
    },
    {
      label: isEn ? 'COMMUNICATION' : 'KOMUNIKASI',
      items: [
        {
          id: 'chat',
          label: isEn ? 'Chat & Inquiries' : 'Chat & Tanya Jawab',
          icon: MessageSquare,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className={`h-full flex flex-col ${
      isDarkSidebar 
        ? 'bg-[#141b2d] text-slate-300 border-r border-slate-800' 
        : 'bg-white text-slate-700 border-r border-slate-200'
    } transition-colors select-none`}>
      {/* Brand Header */}
      <div className={`h-16 flex items-center justify-between px-6 border-b ${
        isDarkSidebar ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-lg font-extrabold tracking-tight flex items-center gap-1 ${
              isDarkSidebar ? 'text-white' : 'text-slate-900'
            }`}>
              Lahomes
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
              Villa Admin Portal
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Switch to Public Site Banner */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
        <button
          onClick={onSwitchToPublic}
          className="w-full flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website Publik</span>
          </span>
          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Guest</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className={`px-3 text-[10px] font-bold tracking-wider uppercase mb-2 ${
              isDarkSidebar ? 'text-slate-400 font-semibold' : 'text-slate-500 font-semibold'
            }`}>
              {sec.label}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-semibold'
                      : isDarkSidebar
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : isDarkSidebar ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase rounded ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.badgeCount && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive 
                        ? 'bg-white text-emerald-700' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Promo / Support Card */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className={`p-3.5 rounded-xl ${
          isDarkSidebar ? 'bg-slate-800/80' : 'bg-slate-50'
        } border border-slate-200/50 dark:border-slate-700/50`}>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className={`text-xs font-bold ${isDarkSidebar ? 'text-white' : 'text-slate-900'}`}>
              Lahomes Villa Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
            Full-stack Next.js + Supabase ready template.
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSettings}
              className="flex-1 py-1.5 px-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEn ? 'Theme' : 'Tema'}</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="py-1.5 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                title={isEn ? 'Log Out Admin Session' : 'Logout Sesi Admin'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isEn ? 'Log Out' : 'Keluar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden lg:block shrink-0 ${
        settings.sidebarCondensed ? 'w-20' : 'w-64'
      } h-screen sticky top-0 transition-all z-20`}>
        {sidebarContent}
      </aside>

      {/* Mobile Offcanvas Sidebar Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
