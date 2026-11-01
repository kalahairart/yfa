import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Settings, 
  Maximize2, 
  Minimize2, 
  User, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  Globe
} from 'lucide-react';
import { ThemeSettings } from '../../types/property';

import { AdminUser } from '../../types/auth';

interface NavbarProps {
  settings: ThemeSettings;
  onUpdateSettings: (newSettings: Partial<ThemeSettings>) => void;
  onToggleSidebar: () => void;
  onOpenSettingsDrawer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProperty?: (id: string) => void;
  currentUser?: AdminUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  onToggleSidebar,
  onOpenSettingsDrawer,
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'New VIP Viewing Scheduled',
      time: '12 min ago',
      desc: 'Victoria Sterling confirmed penthouse inspection at 4:00 PM.',
      unread: true,
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400'
    },
    {
      id: 2,
      title: 'Invoice Paid (Escrow)',
      time: '48 min ago',
      desc: 'Deposit for Uluwatu Seaside Horizon Villa confirmed.',
      unread: true,
      icon: CheckCircle2,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400'
    },
    {
      id: 3,
      title: 'New Client Message',
      time: '2 hours ago',
      desc: 'Darmawan Santoso replied regarding title deed certificate.',
      unread: false,
      icon: MessageSquare,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400'
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={settings.language === 'id' ? 'Cari properti, agen, invoice...' : 'Search properties, agents, invoices...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Change Language"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="uppercase">{settings.language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  onUpdateSettings({ language: 'en' });
                  setShowLangMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between ${
                  settings.language === 'en'
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>English (EN)</span>
                {settings.language === 'en' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  onUpdateSettings({ language: 'id' });
                  setShowLangMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between ${
                  settings.language === 'id'
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Indonesia (ID)</span>
                {settings.language === 'id' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Dark / Light Toggle */}
        <button
          onClick={() => onUpdateSettings({ mode: settings.mode === 'dark' ? 'light' : 'dark' })}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={settings.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {settings.mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Fullscreen toggle"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
              setShowLangMenu(false);
            }}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {settings.language === 'id' ? 'Notifikasi Real-time' : 'Notifications'}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer hover:underline">
                  {settings.language === 'id' ? 'Tandai terbaca' : 'Mark all read'}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-80 overflow-y-auto">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                          <span className="text-[11px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {settings.language === 'id' ? 'Tutup Notifikasi' : 'Close Notifications'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Drawer Button */}
        <button
          onClick={onOpenSettingsDrawer}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Customizer / Theme Settings"
          aria-label="Open settings customizer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <img
              src={currentUser?.avatar || "/src/assets/images/avatar_agent_male_1792833743569.jpg"}
              alt={currentUser?.name || "Candra Rusman"}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div className="hidden md:block">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {currentUser?.name || "Candra Rusman"}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Principal Broker'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser?.name || "Candra Rusman"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || "candra.rusman@lahomes.realestate"}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  Sesi Admin Aktif
                </span>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenSettingsDrawer();
                }}
                className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferensi Tampilan</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  alert('Hak akses: Full CRUD Properti Villa, Leads CRM, dan Data Rahasia Owner.');
                }}
                className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Hak Akses & Izin</span>
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onLogout) {
                    onLogout();
                  }
                }}
                className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout) Sesi Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
