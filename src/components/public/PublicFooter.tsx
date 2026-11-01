import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { translations } from '../../utils/translations';

interface PublicFooterProps {
  onSwitchToAdmin: () => void;
  agentPhone: string;
  language?: 'id' | 'en';
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onSwitchToAdmin,
  agentPhone,
  language = 'id',
}) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">YFA Villa Collection</span>
                <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wider">Independent Villa Brokerage</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t.footerDesc}
            </p>

            <div className="flex items-center gap-4 text-xs text-emerald-400 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.notaryVerified}</span>
              </span>
              <span>·</span>
              <span>{t.arebiCertified}</span>
            </div>
          </div>

          {/* Destinasi Populer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.topDestinations}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#ubud" className="hover:text-emerald-400 transition-colors">Ubud Eco Sanctuary & Valley</a></li>
              <li><a href="#canggu" className="hover:text-emerald-400 transition-colors">Canggu Coastal & Lifestyle</a></li>
              <li><a href="#uluwatu" className="hover:text-emerald-400 transition-colors">Uluwatu Sunset Ocean Cliff</a></li>
              <li><a href="#seminyak" className="hover:text-emerald-400 transition-colors">Seminyak Boutique Prime</a></li>
              <li><a href="#sanur" className="hover:text-emerald-400 transition-colors">Sanur Sunrise Beachfront</a></li>
            </ul>
          </div>

          {/* Kontak Agen */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.officeContact}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Jl. Sunset Road No. 88, Seminyak, Kuta, Badung, Bali 80361</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono">{agentPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>candra.villa@lahomes.realestate</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onSwitchToAdmin}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                >
                  {t.enterDashboard}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} YFA Villa Management. {language === 'id' ? 'Desain & antarmuka dikembangkan untuk Agen Properti Profesional.' : 'Design & interface built for Professional Real Estate Agents.'}</p>
          <div className="flex items-center gap-4">
            <button onClick={onSwitchToAdmin} className="hover:text-slate-300">{t.agentPortal}</button>
            <span>·</span>
            <span>Next.js 15 App Router</span>
            <span>·</span>
            <span>Supabase PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
