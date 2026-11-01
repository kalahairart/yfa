import React from 'react';
import { ThemeSettings } from '../../types/property';
import { PieChart, MoreVertical } from 'lucide-react';

interface PropertyTypeDistributionProps {
  settings: ThemeSettings;
}

export const PropertyTypeDistribution: React.FC<PropertyTypeDistributionProps> = ({ settings }) => {
  const categories = [
    { name: 'Luxury Villas', nameId: 'Villa Mewah', count: 596, percent: 42, color: '#10b981', ringClass: 'text-emerald-500' },
    { name: 'Penthouses', nameId: 'Penthouse', count: 369, percent: 26, color: '#06b6d4', ringClass: 'text-cyan-500' },
    { name: 'Commercial & Office', nameId: 'Komersial & Kantor', count: 256, percent: 18, color: '#6366f1', ringClass: 'text-indigo-500' },
    { name: 'Townhouses & Houses', nameId: 'Rumah & Townhouse', count: 199, percent: 14, color: '#f59e0b', ringClass: 'text-amber-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-500" />
            <span>{settings.language === 'id' ? 'Distribusi Kategori Properti' : 'Property Type Breakdown'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {settings.language === 'id' ? 'Proporsi inventaris listing aktif' : 'Active inventory distribution'}
          </p>
        </div>
        <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Donut Graphic */}
      <div className="my-5 flex items-center justify-center relative">
        <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="18"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Villa: 42% (circumference ~ 377) */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="#10b981"
            strokeWidth="18"
            strokeDasharray={`${(42 / 100) * 377} 377`}
            strokeDashoffset="0"
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Penthouse: 26% */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="#06b6d4"
            strokeWidth="18"
            strokeDasharray={`${(26 / 100) * 377} 377`}
            strokeDashoffset={`-${(42 / 100) * 377}`}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Commercial: 18% */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="#6366f1"
            strokeWidth="18"
            strokeDasharray={`${(18 / 100) * 377} 377`}
            strokeDashoffset={`-${((42 + 26) / 100) * 377}`}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Houses: 14% */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="#f59e0b"
            strokeWidth="18"
            strokeDasharray={`${(14 / 100) * 377} 377`}
            strokeDashoffset={`-${((42 + 26 + 18) / 100) * 377}`}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            1,420
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {settings.language === 'id' ? 'Total Listing' : 'Total Units'}
          </span>
        </div>
      </div>

      {/* Breakdown list */}
      <div className="space-y-3 pt-2">
        {categories.map((cat, i) => (
          <div key={i} className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {settings.language === 'id' ? cat.nameId : cat.name}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                <span>{cat.count} units</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">({cat.percent}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
