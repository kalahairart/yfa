import React, { useState } from 'react';
import { Transaction, ThemeSettings } from '../../types/property';
import { 
  Receipt, 
  Search, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X, 
  Printer,
  DollarSign
} from 'lucide-react';

interface TransactionLedgerProps {
  transactions: Transaction[];
  settings: ThemeSettings;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  settings,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['InvoiceNumber,Property,Client,Agent,Amount,Date,Method,Status\n'];
      const rows = filtered.map(
        (t) =>
          `"${t.invoiceNumber}","${t.propertyTitle}","${t.clientName}","${t.agentName}",${t.amount},"${t.date}","${t.paymentMethod}","${t.status}"`
      );
      const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lahomes_transactions_${Date.now()}.csv`;
      a.click();
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {settings.language === 'id' ? 'Buku Besar & Invoice Transaksi' : 'Transactions & Invoice Ledger'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {settings.language === 'id' 
              ? 'Arsip digital penerimaan dana escrow dan pembayaran klien' 
              : 'Digital ledger of escrow disbursements, client retainers, and settlement invoices'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all self-start sm:self-auto hover:bg-slate-800"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? (settings.language === 'id' ? 'Mengekspor...' : 'Exporting...') : (settings.language === 'id' ? 'Unduh Laporan CSV' : 'Export CSV Ledger')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={settings.language === 'id' ? 'Cari nomor invoice, properti, atau pembeli...' : 'Search invoice #, property, or buyer...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">{settings.language === 'id' ? 'Semua Status' : 'All Statuses'}</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Properti Terkait' : 'Property'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Klien' : 'Buyer'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Agen' : 'Broker'}</th>
                <th className="py-3.5 px-3">{settings.language === 'id' ? 'Metode' : 'Method'}</th>
                <th className="py-3.5 px-3 text-right">{settings.language === 'id' ? 'Jumlah' : 'Amount'}</th>
                <th className="py-3.5 px-3 text-center">{settings.language === 'id' ? 'Status' : 'Status'}</th>
                <th className="py-3.5 px-4 text-right">{settings.language === 'id' ? 'Faktur' : 'Receipt'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {trx.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                    {trx.propertyTitle}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {trx.clientName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {trx.agentName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                    {trx.paymentMethod}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {formatAmount(trx.amount)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(trx.status)}`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveInvoice(trx)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 ml-auto text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{settings.language === 'id' ? 'Lihat Faktur' : 'View Invoice'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveInvoice(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in fade-in zoom-in-95 duration-150 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  LH
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Lahomes Real Estate Settlement
                  </h3>
                  <span className="text-[10px] text-slate-400">Official Escrow Receipt</span>
                </div>
              </div>
              <button onClick={() => setActiveInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 my-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoice Number</span>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{activeInvoice.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{activeInvoice.date}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right max-w-xs">{activeInvoice.propertyTitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Beneficiary / Buyer:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeInvoice.clientName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Managing Broker:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeInvoice.agentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeInvoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(activeInvoice.status)}`}>
                    {activeInvoice.status}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Total Disbursed:</span>
                <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300">
                  {formatAmount(activeInvoice.amount)}
                </span>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{settings.language === 'id' ? 'Cetak Kwitansi' : 'Print Receipt'}</span>
              </button>
              <button
                onClick={() => setActiveInvoice(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
              >
                {settings.language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
