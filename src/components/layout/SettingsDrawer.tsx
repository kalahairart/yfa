import React from 'react';
import { X, Moon, Sun, RotateCcw, Check, DollarSign, Layout, Palette } from 'lucide-react';
import { ThemeSettings } from '../../types/property';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onUpdateSettings: (newSettings: Partial<ThemeSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-500" />
              <span>{settings.language === 'id' ? 'Kustomisasi Tema Lahomes' : 'Lahomes Customizer'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {settings.language === 'id' ? 'Atur gaya tata letak dan preferensi' : 'Configure layout styling & preferences'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body settings options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Color Scheme */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              {settings.language === 'id' ? 'Mode Warna (Light / Dark)' : 'Color Scheme'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateSettings({ mode: 'light' })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  settings.mode === 'light'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sun className={`w-4 h-4 ${settings.mode === 'light' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {settings.mode === 'light' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Light Mode</div>
                  <div className="text-[11px] text-slate-500">Clean & Bright</div>
                </div>
              </button>

              <button
                onClick={() => onUpdateSettings({ mode: 'dark' })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  settings.mode === 'dark'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Moon className={`w-4 h-4 ${settings.mode === 'dark' ? 'text-emerald-500' : 'text-slate-400'}`} />
                  {settings.mode === 'dark' && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark Mode</div>
                  <div className="text-[11px] text-slate-500">Elegant Slate</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sidebar Theme */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              {settings.language === 'id' ? 'Warna Sidebar' : 'Sidebar Theme'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateSettings({ sidebarColor: 'dark' })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  settings.sidebarColor === 'dark'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-4 h-4 rounded-full bg-[#141b2d] border border-slate-700" />
                  {settings.sidebarColor === 'dark' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark Navy</div>
                  <div className="text-[11px] text-slate-500">Default Lahomes</div>
                </div>
              </button>

              <button
                onClick={() => onUpdateSettings({ sidebarColor: 'light' })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  settings.sidebarColor === 'light'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-xs" />
                  {settings.sidebarColor === 'light' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Clean White</div>
                  <div className="text-[11px] text-slate-500">Minimalist Light</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sidebar Width Mode */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              {settings.language === 'id' ? 'Ukuran Navigasi Sidebar' : 'Sidebar Layout View'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateSettings({ sidebarCondensed: false })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  !settings.sidebarCondensed
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Layout className="w-4 h-4 text-slate-400" />
                  {!settings.sidebarCondensed && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Expanded</div>
                  <div className="text-[11px] text-slate-500">260px Standard</div>
                </div>
              </button>

              <button
                onClick={() => onUpdateSettings({ sidebarCondensed: true })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  settings.sidebarCondensed
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Layout className="w-4 h-4 text-slate-400" />
                  {settings.sidebarCondensed && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Condensed</div>
                  <div className="text-[11px] text-slate-500">80px Icon Only</div>
                </div>
              </button>
            </div>
          </div>

          {/* Currency Display */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              {settings.language === 'id' ? 'Format Mata Uang' : 'Currency Display'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateSettings({ currency: 'USD' })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  settings.currency === 'USD'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">USD ($)</span>
                {settings.currency === 'USD' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onUpdateSettings({ currency: 'IDR' })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  settings.currency === 'IDR'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">IDR (Rp)</span>
                {settings.currency === 'IDR' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              {settings.language === 'id' ? 'Bahasa Antarmuka' : 'Language'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  settings.language === 'en'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">English (EN)</span>
                {settings.language === 'en' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onUpdateSettings({ language: 'id' })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  settings.language === 'id'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">Indonesia (ID)</span>
                {settings.language === 'id' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
          <button
            onClick={onResetSettings}
            className="flex-1 py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{settings.language === 'id' ? 'Reset Default' : 'Reset Defaults'}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all text-center"
          >
            {settings.language === 'id' ? 'Simpan & Terapkan' : 'Save & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
