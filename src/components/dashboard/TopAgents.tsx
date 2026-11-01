import React from 'react';
import { Agent, ThemeSettings } from '../../types/property';
import { Award, Star, Phone, MessageSquare, ArrowRight } from 'lucide-react';

interface TopAgentsProps {
  agents: Agent[];
  settings: ThemeSettings;
  onViewAllAgents: () => void;
  onChatWithAgent?: (agent: Agent) => void;
}

export const TopAgents: React.FC<TopAgentsProps> = ({
  agents,
  settings,
  onViewAllAgents,
}) => {
  const formatSales = (val: number) => {
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      return `Rp ${(idr / 1000000000).toFixed(1)} M`;
    }
    return `$${(val / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{settings.language === 'id' ? 'Agen Terbaik Bulan Ini' : 'Top Performing Brokers'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {settings.language === 'id' ? 'Berdasarkan volume penjualan dan kepuasan klien' : 'Ranked by closed deal volume'}
          </p>
        </div>
        <button
          onClick={onViewAllAgents}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
        >
          <span>{settings.language === 'id' ? 'Semua' : 'All'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Agents list */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
        {agents.slice(0, 4).map((agent, index) => (
          <div key={agent.id} className="py-3 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                  agent.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {agent.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 mr-0.5" />
                    {agent.rating}
                  </span>
                  <span>·</span>
                  <span>{agent.dealsClosed} {settings.language === 'id' ? 'transaksi' : 'deals'}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tabular-nums block">
                {formatSales(agent.totalSalesValue)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {agent.propertiesCount} {settings.language === 'id' ? 'listing' : 'listings'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Agent Callout */}
      <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {settings.language === 'id' 
            ? 'Total 64 agen terdaftar aktif di sistem' 
            : '64 licensed brokers active across 8 regional hubs'}
        </span>
      </div>
    </div>
  );
};
