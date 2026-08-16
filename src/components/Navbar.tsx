import { Table2, Trash2 } from 'lucide-react';

interface NavbarProps {
  rowCount: number;
  colCount: number;
  onClearStorage: () => void;
}

export function Navbar({
  rowCount,
  colCount,
  onClearStorage,
}: NavbarProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 px-4 py-2.5 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Mini Excel Ultimate
              </h1>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200">
                Formula Studio & Multi-Pivot
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500">
              Multi-Pivot • Merge & Append • 80+ Rumus Excel • Auto-Save
            </p>
          </div>
        </div>

        {/* Status Badges & Quick Action */}
        <div className="flex items-center gap-2.5">
          {rowCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                <strong className="text-slate-900 font-semibold">{rowCount.toLocaleString('id-ID')}</strong> Baris |{' '}
                <strong className="text-slate-900 font-semibold">{colCount}</strong> Kolom
              </span>
            </div>
          )}

          {rowCount > 0 && (
            <button
              id="btn-reset-app-data"
              onClick={onClearStorage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition cursor-pointer"
              title="Reset data & hapus penyimpanan lokal"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

