import React from 'react';
import { Building, DollarSign, Key, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ThemeSettings } from '../../types/property';

interface StatCardsProps {
  settings: ThemeSettings;
  propertiesCount: number;
  totalRevenue: number;
  soldCount: number;
  agentsCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  settings,
  propertiesCount,
  totalRevenue,
  soldCount,
  agentsCount,
}) => {
  const formatCurrency = (val: number) => {
    if (settings.currency === 'IDR') {
      // 1 USD approx 16,000 IDR
      const idrVal = val * 16000;
      if (idrVal >= 1000000000) {
        return `Rp ${(idrVal / 1000000000).toFixed(1)} M`;
      }
      return `Rp ${idrVal.toLocaleString('id-ID')}`;
    }
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${val.toLocaleString()}`;
  };

  const cards = [
    {
      title: settings.language === 'id' ? 'Total Properti' : 'Total Properties',
      value: propertiesCount.toLocaleString(),
      change: '+8.4%',
      isPositive: true,
      subtext: settings.language === 'id' ? 'vs bulan lalu' : 'vs last month',
      icon: Building,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
      badgeBg: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400',
    },
    {
      title: settings.language === 'id' ? 'Total Pendapatan' : 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+14.2%',
      isPositive: true,
      subtext: settings.language === 'id' ? 'vs target kuartal' : 'vs quarter target',
      icon: DollarSign,
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
      badgeBg: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400',
    },
    {
      title: settings.language === 'id' ? 'Properti Terjual' : 'Properties Sold',
      value: soldCount.toLocaleString(),
      change: '+6.1%',
      isPositive: true,
      subtext: settings.language === 'id' ? 'konversi 92%' : '92% conversion',
      icon: Key,
      iconBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
      badgeBg: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400',
    },
    {
      title: settings.language === 'id' ? 'Agen Aktif' : 'Active Agents',
      value: agentsCount.toLocaleString(),
      change: '+3.5%',
      isPositive: true,
      subtext: settings.language === 'id' ? '4 spesialis baru' : '4 new specialists',
      icon: Users,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
      badgeBg: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {card.value}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <span className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md ${card.badgeBg}`}>
                {card.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {card.change}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
