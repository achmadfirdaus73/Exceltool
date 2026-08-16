import { useState, useMemo } from 'react';
import {
  Filter,
  ArrowUpDown,
  Palette,
  Download,
  Trash2,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DataRow, FilterCondition, SortOrder, CFRule } from '../types';
import { exportJsonToExcel } from '../utils/excelHelper';

interface MainTableSectionProps {
  rawData: DataRow[];
  columns: string[];
  onDataChange: (newRaw: DataRow[]) => void;
}

export function MainTableSection({
  rawData,
  columns,
  onDataChange,
}: MainTableSectionProps) {
  // Filter state
  const [filterField, setFilterField] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('contains');
  const [filterValue, setFilterValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<{
    field: string;
    condition: FilterCondition;
    val: string;
  } | null>(null);

  // Global search
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Sort state
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Conditional Formatting
  const [cfField, setCfField] = useState<string>('');
  const [cfRule, setCfRule] = useState<CFRule>('none');
  const [cfValue, setCfValue] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const handleApplyFilter = () => {
    if (!filterField) {
      alert('Pilih kolom untuk filter!');
      return;
    }
    setActiveFilter({
      field: filterField,
      condition: filterCondition,
      val: filterValue,
    });
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setActiveFilter(null);
    setFilterValue('');
    setGlobalSearch('');
  };

  const handleRemoveDuplicates = () => {
    if (rawData.length === 0) return;
    const seen = new Set<string>();
    const deduplicated = rawData.filter((row) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const removedCount = rawData.length - deduplicated.length;
    onDataChange(deduplicated);
    alert(`Pembersihan selesai! Menghapus ${removedCount} baris duplikat. Sisa: ${deduplicated.length} baris.`);
  };

  const handleResetAllData = () => {
    setActiveFilter(null);
    setFilterValue('');
    setGlobalSearch('');
    setSortField('');
    setCfField('');
    setCfRule('none');
    setCfValue('');
    setCurrentPage(1);
  };

  // Compute processed data
  const filteredData = useMemo(() => {
    let result = [...rawData];

    // Specific field filter
    if (activeFilter && activeFilter.field) {
      const { field, condition, val } = activeFilter;
      const targetVal = val.toLowerCase().trim();

      result = result.filter((row) => {
        const cellRaw = row[field];
        const cellStr = String(cellRaw ?? '').toLowerCase();

        if (condition === 'contains') return cellStr.includes(targetVal);
        if (condition === 'equals') return cellStr === targetVal;
        if (condition === 'gt') return parseFloat(String(cellRaw)) > parseFloat(val);
        if (condition === 'lt') return parseFloat(String(cellRaw)) < parseFloat(val);
        return true;
      });
    }

    // Global quick search
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase().trim();
      result = result.filter((row) =>
        columns.some((col) => String(row[col] ?? '').toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] ?? '';
        const valB = b[sortField] ?? '';

        const numA = Number(valA);
        const numB = Number(valB);

        if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '') {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        } else {
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        }
      });
    }

    return result;
  }, [rawData, activeFilter, globalSearch, sortField, sortOrder, columns]);

  // Paginated view
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleDownloadMainExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk didownload!');
      return;
    }
    exportJsonToExcel(filteredData, 'Tabel_Utama', 'Hasil_Filter_Tabel_Utama');
  };

  const cfThreshold = parseFloat(cfValue);

  return (
    <section id="main-table-section" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              3. Filter Kriteria, Sort & Tabel Utama
            </h2>
            <p className="text-xs text-slate-500">
              Cari data spesifik, pengurutan, pewarnaan otomatis (CF), dan ekspor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-main-xlsx"
            type="button"
            onClick={handleDownloadMainExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Control Panels Accordion / Grid */}
      <div className="space-y-3">
        {/* Specific Filter Bar */}
        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" /> Filter Spesifik:
            </span>
            {activeFilter && (
              <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                Aktif: [{activeFilter.field}] {activeFilter.condition} "{activeFilter.val}"
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-600">Kolom</label>
              <select
                id="select-filter-field"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- Pilih Kolom --</option>
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-600">Kondisi</label>
              <select
                id="select-filter-condition"
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value as FilterCondition)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="contains">Mengandung teks</option>
                <option value="equals">Sama persis (=)</option>
                <option value="gt">Lebih besar (&gt;)</option>
                <option value="lt">Lebih kecil (&lt;)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-600">Nilai Dicari</label>
              <input
                id="input-filter-value"
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                placeholder="Kata kunci..."
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                id="btn-apply-filter"
                type="button"
                onClick={handleApplyFilter}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer"
              >
                Terapkan
              </button>
              {activeFilter && (
                <button
                  id="btn-reset-filter"
                  type="button"
                  onClick={handleResetFilter}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-2 px-2.5 rounded-xl transition cursor-pointer"
                  title="Hapus Filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sort & Quick Global Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Sort bar */}
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan (Sort):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <select
                  id="select-sort-field"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Tanpa Sort --</option>
                  {columns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  id="select-sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="asc">A-Z / Terkecil (Asc)</option>
                  <option value="desc">Z-A / Terbesar (Desc)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditional Formatting Bar */}
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Conditional Formatting (CF):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <select
                  id="select-cf-field"
                  value={cfField}
                  onChange={(e) => setCfField(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Kolom --</option>
                  {columns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  id="select-cf-rule"
                  value={cfRule}
                  onChange={(e) => setCfRule(e.target.value as CFRule)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="none">Tanpa CF</option>
                  <option value="gt">&gt; Di Atas Angka (Hijau)</option>
                  <option value="lt">&lt; Di Bawah Angka (Merah)</option>
                </select>
              </div>
              <div>
                <input
                  id="input-cf-value"
                  type="number"
                  placeholder="Angka..."
                  value={cfValue}
                  onChange={(e) => setCfValue(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Search & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-global-search"
              type="text"
              placeholder="Cari cepat di semua baris..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-remove-duplicates"
              type="button"
              onClick={handleRemoveDuplicates}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Duplikat</span>
            </button>

            <button
              id="btn-reset-all-filters"
              type="button"
              onClick={handleResetAllData}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              title="Reset semua filter dan sortir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="max-h-[440px] overflow-auto">
          {paginatedData.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ada baris data yang cocok dengan kriteria filter.
            </div>
          ) : (
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="text-[11px] font-bold text-slate-700 uppercase bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3 w-12 text-center text-slate-500">No</th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-3.5 py-3 whitespace-nowrap border-l border-slate-200/80"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((row, idx) => {
                  const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono">
                        {rowNumber}
                      </td>
                      {columns.map((col) => {
                        const val = row[col] !== undefined ? row[col] : '';
                        let cellClass = '';

                        if (cfField === col && !isNaN(cfThreshold) && cfRule !== 'none') {
                          const numVal = parseFloat(String(val));
                          if (cfRule === 'gt' && numVal > cfThreshold) {
                            cellClass = 'bg-emerald-100 text-emerald-900 font-semibold';
                          } else if (cfRule === 'lt' && numVal < cfThreshold) {
                            cellClass = 'bg-rose-100 text-rose-900 font-semibold';
                          }
                        }

                        return (
                          <td
                            key={col}
                            className={`px-3.5 py-2.5 whitespace-nowrap border-l border-slate-100 font-medium ${cellClass}`}
                          >
                            {typeof val === 'number'
                              ? val.toLocaleString('id-ID')
                              : String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Menampilkan{' '}
            <strong className="text-slate-900 font-semibold">
              {filteredData.length > 0
                ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                    currentPage * pageSize,
                    filteredData.length
                  )}`
                : 0}
            </strong>{' '}
            dari <strong className="text-slate-900 font-semibold">{filteredData.length.toLocaleString('id-ID')}</strong> baris{' '}
            {filteredData.length !== rawData.length && (
              <span className="text-blue-700 font-medium">
                (difilter dari {rawData.length.toLocaleString('id-ID')} total baris)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-2 py-1 focus:ring-1 focus:ring-blue-500"
            >
              <option value={15}>15 per hal</option>
              <option value={25}>25 per hal</option>
              <option value={50}>50 per hal</option>
              <option value={100}>100 per hal</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
