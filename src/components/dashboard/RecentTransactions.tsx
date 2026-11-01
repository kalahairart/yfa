import React from 'react';
import { Transaction, ThemeSettings } from '../../types/property';
import { Receipt, ArrowRight, ExternalLink } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  settings: ThemeSettings;
  onViewAllTransactions: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  settings,
  onViewAllTransactions,
}) => {
  const formatAmount = (val: number) => {
    if (settings.currency === 'IDR') {
      const idr = val * 16000;
      return `Rp ${idr.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString()}`;
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50';
      case 'Pending':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50';
      case 'Failed':
        return 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50';
      case 'Refunded':
        return 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-500" />
            <span>{settings.language === 'id' ? 'Aktivitas Transaksi Terbaru' : 'Recent Property Transactions'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {settings.language === 'id' ? 'Catatan mutasi invoice dan pembayaran escrow' : 'Latest escrow payments and buyer invoices'}
          </p>
        </div>
        <button
          onClick={onViewAllTransactions}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
        >
          <span>{settings.language === 'id' ? 'Buka Buku Besar' : 'Full Ledger'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Invoice</th>
              <th className="py-3 px-3">{settings.language === 'id' ? 'Properti' : 'Property'}</th>
              <th className="py-3 px-3">{settings.language === 'id' ? 'Klien' : 'Client'}</th>
              <th className="py-3 px-3">{settings.language === 'id' ? 'Metode' : 'Method'}</th>
              <th className="py-3 px-3 text-right">{settings.language === 'id' ? 'Jumlah' : 'Amount'}</th>
              <th className="py-3 px-3 text-center">{settings.language === 'id' ? 'Status' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {transactions.slice(0, 5).map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white">
                  {trx.invoiceNumber}
                </td>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  {trx.propertyTitle}
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                  {trx.clientName}
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                  {trx.paymentMethod}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatAmount(trx.amount)}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(trx.status)}`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
