import { Table2, Smartphone, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

interface NavbarProps {
  rowCount: number;
  colCount: number;
  onLoadSample: () => void;
  onOpenApkModal: () => void;
  onClearStorage: () => void;
}

export function Navbar({
  rowCount,
  colCount,
  onLoadSample,
  onOpenApkModal,
  onClearStorage,
}: NavbarProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 px-4 py-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Mini Excel Ultimate
              </h1>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-blue-200">
                PWA / Web Edition
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Multi-Pivot • Merge & Append • Kalkulator Rumus • Auto-Save
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {rowCount > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong className="text-slate-900 font-semibold">{rowCount.toLocaleString('id-ID')}</strong> Baris |{' '}
                <strong className="text-slate-900 font-semibold">{colCount}</strong> Kolom
              </span>
            </div>
          )}

          <button
            id="btn-load-sample"
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition cursor-pointer"
            title="Muat contoh dataset penjualan untuk mencoba langsung"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contoh Data</span>
          </button>

          <button
            id="btn-open-apk-guide"
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Jadikan APK</span>
          </button>

          {rowCount > 0 && (
            <button
              id="btn-reset-app-data"
              onClick={onClearStorage}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs transition cursor-pointer"
              title="Reset data & hapus penyimpanan lokal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
