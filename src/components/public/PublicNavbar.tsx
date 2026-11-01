import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  Shield, 
  Globe, 
  DollarSign, 
  LayoutDashboard, 
  Search,
  KeyRound,
  LogOut,
  UserCheck,
  ChevronDown,
  Check
} from 'lucide-react';
import { ThemeSettings } from '../../types/property';
import { AdminUser } from '../../types/auth';
import { translations } from '../../utils/translations';

interface PublicNavbarProps {
  settings: ThemeSettings;
  onUpdateSettings: (newSettings: Partial<ThemeSettings>) => void;
  onSwitchToAdmin: () => void;
  onNavigateHome: () => void;
  onFilterTransaction: (type: 'all' | 'rent' | 'sale') => void;
  agentPhone: string;
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  settings,
  onUpdateSettings,
  onSwitchToAdmin,
  onNavigateHome,
  onFilterTransaction,
  agentPhone,
  isAuthenticated,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const cleanPhone = agentPhone.replace(/[^0-9]/g, '');
  const lang = settings.language || 'id';
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Lahomes</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Villas
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Luxury Villa Listing & Management
            </p>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              onNavigateHome();
              onFilterTransaction('all');
            }}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {t.allVillas}
          </button>
          <button
            onClick={() => {
              onNavigateHome();
              onFilterTransaction('rent');
            }}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {t.rentVillas}
          </button>
          <button
            onClick={() => {
              onNavigateHome();
              onFilterTransaction('sale');
            }}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {t.saleVillas}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
              title={t.selectLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'id' ? 'ID' : 'EN'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  {t.selectLanguage}
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ language: 'id' });
                    setShowLangDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    lang === 'id'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇮🇩</span>
                    <span>Bahasa Indonesia</span>
                  </span>
                  {lang === 'id' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    onUpdateSettings({ language: 'en' });
                    setShowLangDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    lang === 'en'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇬🇧</span>
                    <span>English</span>
                  </span>
                  {lang === 'en' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Currency Toggle */}
          <button
            onClick={() => onUpdateSettings({ currency: settings.currency === 'USD' ? 'IDR' : 'USD' })}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
            title={t.switchCurrency}
          >
            {settings.currency === 'USD' ? '$ USD' : 'Rp IDR'}
          </button>

          {/* Direct WhatsApp Callout */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(lang === 'id' ? 'Halo Agen Candra, saya ingin menanyakan ketersediaan villa di Bali.' : 'Hello Agent Candra, I would like to inquire about luxury villas in Bali.')}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.whatsappAgent}</span>
          </a>

          {/* Conditional Admin Login / Dashboard Switcher */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSwitchToAdmin}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-sm transition-all"
                title="Buka Dashboard Admin Lahomes"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span className="hidden md:inline">{t.agentDashboard}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                title="Logout dari Sesi Admin"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-sm transition-all"
              title="Masuk sebagai Agen / Admin"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>{t.loginAdmin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
