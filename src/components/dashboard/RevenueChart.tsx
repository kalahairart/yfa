import React, { useState } from 'react';
import { MONTHLY_SALES_DATA } from '../../data/mockData';
import { ThemeSettings } from '../../types/property';
import { TrendingUp, BarChart3, LineChart } from 'lucide-react';

interface RevenueChartProps {
  settings: ThemeSettings;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ settings }) => {
  const [activeRange, setActiveRange] = useState<'week' | 'month' | 'year'>('year');
  const [chartMode, setChartMode] = useState<'bar' | 'area'>('bar');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const formatPrice = (val: number) => {
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      if (idr >= 1000000000) {
        return `Rp ${(idr / 1000000000).toFixed(1)} M`;
      }
      return `Rp ${(idr / 1000000).toFixed(0)} Jt`;
    }
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const maxSales = Math.max(...MONTHLY_SALES_DATA.map((d) => d.sales)) * 1.15;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {settings.language === 'id' ? 'Analisis Penjualan & Pendapatan Properti' : 'Property Sales & Revenue Analytics'}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              +24.8% YoY
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {settings.language === 'id' 
              ? 'Volume transaksi kotor vs komisi bersih agen berlisensi' 
              : 'Gross property deal volume vs net broker commission'}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {/* Chart mode toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setChartMode('bar')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                chartMode === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartMode('area')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                chartMode === 'area'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Area Line Chart"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Time range tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveRange('week')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRange === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {settings.language === 'id' ? 'Minggu' : 'Week'}
            </button>
            <button
              onClick={() => setActiveRange('month')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRange === 'month'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {settings.language === 'id' ? 'Bulan' : 'Month'}
            </button>
            <button
              onClick={() => setActiveRange('year')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRange === 'year'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {settings.language === 'id' ? 'Tahun' : 'Year'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            {settings.language === 'id' ? 'Total Volume Transaksi' : 'Total Deal Volume'}
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {formatPrice(29880000)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            {settings.language === 'id' ? 'Pendapatan Komisi' : 'Net Commission'}
          </span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatPrice(2980000)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            {settings.language === 'id' ? 'Rata-rata Harga Listing' : 'Average Listing Price'}
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {formatPrice(1750000)}
          </span>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative h-64 sm:h-72 w-full pt-4">
        {chartMode === 'bar' ? (
          /* Dual Bar Chart */
          <div className="h-full flex items-end justify-between gap-1.5 sm:gap-3 px-2">
            {MONTHLY_SALES_DATA.map((item, idx) => {
              const salesHeight = (item.sales / maxSales) * 100;
              const revenueHeight = ((item.revenue * 8.5) / maxSales) * 100;
              const isHovered = hoveredPoint === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap border border-slate-700 animate-in fade-in duration-100">
                      <div className="font-bold text-emerald-400">{item.month} 2026</div>
                      <div>Sales: {formatPrice(item.sales)}</div>
                      <div>Comm: {formatPrice(item.revenue)}</div>
                    </div>
                  )}

                  {/* Bars container */}
                  <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-[82%]">
                    {/* Sales bar */}
                    <div
                      style={{ height: `${salesHeight}%` }}
                      className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                        isHovered ? 'bg-emerald-500 scale-105' : 'bg-emerald-600/85 hover:bg-emerald-500'
                      }`}
                    />
                    {/* Commission bar */}
                    <div
                      style={{ height: `${revenueHeight}%` }}
                      className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                        isHovered ? 'bg-teal-400 scale-105' : 'bg-teal-500/70 hover:bg-teal-400'
                      }`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className={`text-[11px] font-semibold mt-2.5 transition-colors ${
                    isHovered ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'
                  }`}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Area / Line Chart representation */
          <div className="h-full relative flex flex-col justify-between">
            <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="160" x2="800" y2="160" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />

              {/* Smooth Area Path */}
              {(() => {
                const points = MONTHLY_SALES_DATA.map((d, i) => {
                  const x = (i / (MONTHLY_SALES_DATA.length - 1)) * 800;
                  const y = 200 - (d.sales / maxSales) * 170;
                  return `${x},${y}`;
                });
                const dPath = `M 0,200 L ${points.join(' L ')} L 800,200 Z`;
                const strokePath = `M ${points.join(' L ')}`;

                return (
                  <>
                    <path d={dPath} fill="url(#areaGradient)" />
                    <path d={strokePath} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {MONTHLY_SALES_DATA.map((d, i) => {
                      const x = (i / (MONTHLY_SALES_DATA.length - 1)) * 800;
                      const y = 200 - (d.sales / maxSales) * 170;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={hoveredPoint === i ? 6 : 4}
                          className="fill-white stroke-emerald-600 stroke-[3] transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            <div className="flex justify-between px-2 pt-2 text-[11px] font-semibold text-slate-400">
              {MONTHLY_SALES_DATA.map((d, i) => (
                <span key={i}>{d.month}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {settings.language === 'id' ? 'Volume Penjualan' : 'Total Sales Volume'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-teal-400 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {settings.language === 'id' ? 'Komisi Agen' : 'Broker Commission'}
          </span>
        </div>
      </div>
    </div>
  );
};
