import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Download,
  Play,
  CheckSquare,
  Layers,
  BarChart3,
  Table as TableIcon,
  Eye,
  Sparkles,
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { DataRow, AggregatorType } from '../types';
import { exportJsonToExcel } from '../utils/excelHelper';
import { PivotChartSection } from './PivotChartSection';

interface MultiPivotSectionProps {
  rawData: DataRow[];
  columns: string[];
}

export interface PivotResult {
  selectedRows: string[];
  selectedCols: string[];
  colValues: string[];
  groupedData: Record<string, Record<string, number[]>>;
  valueCol: string;
  aggregator: AggregatorType;
}

export interface PivotCartItem {
  id: string;
  rowKey: string;
  categoryLabels: Record<string, string>;
  metricValues: Record<string, number>;
  grandTotal: number;
  valueCol: string;
  aggregator: AggregatorType;
  addedAt: string;
}

export function MultiPivotSection({ rawData, columns }: MultiPivotSectionProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [valSelect, setValSelect] = useState<string>(columns[0] || '');
  const [aggSelect, setAggSelect] = useState<AggregatorType>('Sum');
  const [pivotResult, setPivotResult] = useState<PivotResult | null>(null);
  const [displayMode, setDisplayMode] = useState<'both' | 'table' | 'chart'>('both');

  // Pivot Cart State
  const [cartItems, setCartItems] = useState<PivotCartItem[]>([]);
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  // Helper to generate pivot from given params
  const generatePivotData = (
    rowsToGroup: string[],
    colsToGroup: string[],
    valueColumn: string,
    agg: AggregatorType
  ) => {
    if (rowsToGroup.length === 0 || !valueColumn || rawData.length === 0) return;

    // Extract unique values for side columns
    let colValues = ['Total'];
    if (colsToGroup.length > 0) {
      const rawColVals: string[] = [];
      rawData.forEach((row) => {
        const keyParts = colsToGroup.map((c) =>
          row[c] !== undefined ? String(row[c]) : 'N/A'
        );
        rawColVals.push(keyParts.join(' / '));
      });
      colValues = Array.from(new Set(rawColVals)).sort();
    }

    // Grouping
    const groupedData: Record<string, Record<string, number[]>> = {};

    rawData.forEach((row) => {
      const rowKeyParts = rowsToGroup.map((c) =>
        row[c] !== undefined ? String(row[c]) : 'N/A'
      );
      const rowKey = rowKeyParts.join(' | ');

      let colKey = 'Total';
      if (colsToGroup.length > 0) {
        const keyParts = colsToGroup.map((c) =>
          row[c] !== undefined ? String(row[c]) : 'N/A'
        );
        colKey = keyParts.join(' / ');
      }

      if (!groupedData[rowKey]) {
        groupedData[rowKey] = {};
      }
      if (!groupedData[rowKey][colKey]) {
        groupedData[rowKey][colKey] = [];
      }

      const numVal = parseFloat(String(row[valueColumn])) || 0;
      groupedData[rowKey][colKey].push(numVal);
    });

    setPivotResult({
      selectedRows: rowsToGroup,
      selectedCols: colsToGroup,
      colValues,
      groupedData,
      valueCol: valueColumn,
      aggregator: agg,
    });
  };

  // Auto-initialize default smart pivot when data is loaded
  useEffect(() => {
    if (columns.length > 0 && rawData.length > 0) {
      // Find suitable numeric column for values
      let numericCol = columns.find((c) => {
        const val = rawData[0]?.[c];
        return typeof val === 'number' || (!isNaN(Number(val)) && String(val).trim() !== '');
      }) || columns[columns.length - 1];

      // Find suitable categorical column for rows
      let categoryCol = columns.find((c) => {
        const val = rawData[0]?.[c];
        return isNaN(Number(val)) || typeof val === 'string';
      }) || columns[0];

      // If they are the same and columns length > 1, pick different one
      if (categoryCol === numericCol && columns.length > 1) {
        categoryCol = columns[0];
        numericCol = columns[columns.length - 1];
      }

      const initialRows = [categoryCol];
      setSelectedRows(initialRows);
      setValSelect(numericCol);
      setAggSelect('Sum');

      // Generate immediately
      generatePivotData(initialRows, [], numericCol, 'Sum');
    }
  }, [columns, rawData]);

  const toggleRowSelect = (col: string) => {
    if (selectedRows.includes(col)) {
      setSelectedRows(selectedRows.filter((c) => c !== col));
    } else {
      setSelectedRows([...selectedRows, col]);
    }
  };

  const toggleColSelect = (col: string) => {
    if (selectedCols.includes(col)) {
      setSelectedCols(selectedCols.filter((c) => c !== col));
    } else {
      setSelectedCols([...selectedCols, col]);
    }
  };

  const calculateAgg = (arr: number[], agg: AggregatorType): number => {
    if (!arr || arr.length === 0) return 0;
    if (agg === 'Sum') return arr.reduce((a, b) => a + b, 0);
    if (agg === 'Count') return arr.length;
    if (agg === 'Average') return arr.reduce((a, b) => a + b, 0) / arr.length;
    if (agg === 'Max') return Math.max(...arr);
    if (agg === 'Min') return Math.min(...arr);
    return arr.reduce((a, b) => a + b, 0);
  };

  const handleGeneratePivot = () => {
    if (selectedRows.length === 0) {
      alert('Pilih minimal satu Kolom Baris untuk Pivot!');
      return;
    }
    if (!valSelect) {
      alert('Pilih Kolom Nilai (Value)!');
      return;
    }

    generatePivotData(selectedRows, selectedCols, valSelect, aggSelect);
  };

  const handleDownloadPivot = () => {
    if (!pivotResult) {
      alert('Tampilkan pivot terlebih dahulu!');
      return;
    }

    const { selectedRows, selectedCols, colValues, groupedData, aggregator } = pivotResult;
    const exportRows: DataRow[] = [];

    Object.keys(groupedData).forEach((rowKey) => {
      const rowParts = rowKey.split(' | ');
      const rowObj: DataRow = {};

      selectedRows.forEach((r, idx) => {
        rowObj[r] = rowParts[idx] || '';
      });

      let allRowVals: number[] = [];
      colValues.forEach((c) => {
        const arr = groupedData[rowKey][c] || [];
        const res = calculateAgg(arr, aggregator);
        rowObj[c] = res;
        allRowVals = allRowVals.concat(arr);
      });

      if (selectedCols.length > 0) {
        rowObj['Grand Total'] = calculateAgg(allRowVals, aggregator);
      }

      exportRows.push(rowObj);
    });

    exportJsonToExcel(exportRows, 'PivotTable', `Hasil_Pivot_${aggregator}`);
  };

  // Cart operations
  const isRowInCart = (rowKey: string) => {
    return cartItems.some((item) => item.rowKey === rowKey);
  };

  const toggleAddToCart = (rowKey: string) => {
    if (!pivotResult) return;

    if (isRowInCart(rowKey)) {
      setCartItems((prev) => prev.filter((item) => item.rowKey !== rowKey));
      setCartNotification(`Dihapus dari Keranjang: "${rowKey}"`);
    } else {
      const rowParts = rowKey.split(' | ');
      const categoryLabels: Record<string, string> = {};
      pivotResult.selectedRows.forEach((r, idx) => {
        categoryLabels[r] = rowParts[idx] || '';
      });

      const metricValues: Record<string, number> = {};
      let allVals: number[] = [];
      pivotResult.colValues.forEach((c) => {
        const arr = pivotResult.groupedData[rowKey]?.[c] || [];
        const val = calculateAgg(arr, pivotResult.aggregator);
        metricValues[c] = val;
        allVals = allVals.concat(arr);
      });

      const grandTotal = calculateAgg(allVals, pivotResult.aggregator);

      const newItem: PivotCartItem = {
        id: `${rowKey}_${Date.now()}`,
        rowKey,
        categoryLabels,
        metricValues,
        grandTotal,
        valueCol: pivotResult.valueCol,
        aggregator: pivotResult.aggregator,
        addedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setCartItems((prev) => [...prev, newItem]);
      setCartNotification(`Ditambahkan ke Keranjang: "${rowKey}"`);
    }

    setTimeout(() => setCartNotification(null), 3000);
  };

  const addAllToCart = () => {
    if (!pivotResult) return;
    const allKeys = Object.keys(pivotResult.groupedData);
    const newItems: PivotCartItem[] = [];

    allKeys.forEach((rowKey) => {
      if (!isRowInCart(rowKey)) {
        const rowParts = rowKey.split(' | ');
        const categoryLabels: Record<string, string> = {};
        pivotResult.selectedRows.forEach((r, idx) => {
          categoryLabels[r] = rowParts[idx] || '';
        });

        const metricValues: Record<string, number> = {};
        let allVals: number[] = [];
        pivotResult.colValues.forEach((c) => {
          const arr = pivotResult.groupedData[rowKey]?.[c] || [];
          const val = calculateAgg(arr, pivotResult.aggregator);
          metricValues[c] = val;
          allVals = allVals.concat(arr);
        });

        const grandTotal = calculateAgg(allVals, pivotResult.aggregator);

        newItems.push({
          id: `${rowKey}_${Date.now()}_${Math.random()}`,
          rowKey,
          categoryLabels,
          metricValues,
          grandTotal,
          valueCol: pivotResult.valueCol,
          aggregator: pivotResult.aggregator,
          addedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    });

    if (newItems.length > 0) {
      setCartItems((prev) => [...prev, ...newItems]);
      setCartNotification(`${newItems.length} baris dimasukkan ke Keranjang!`);
    } else {
      setCartNotification('Semua baris sudah ada di Keranjang.');
    }
    setTimeout(() => setCartNotification(null), 3000);
  };

  const clearCart = () => {
    if (confirm('Kosongkan semua item di Keranjang Pivot?')) {
      setCartItems([]);
      setCartNotification('Keranjang dikosongkan.');
      setTimeout(() => setCartNotification(null), 2500);
    }
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownloadCart = () => {
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }

    const exportRows: DataRow[] = cartItems.map((item, idx) => {
      const row: DataRow = {
        No: idx + 1,
        ...item.categoryLabels,
        ...item.metricValues,
        'Grand Total': item.grandTotal,
        'Waktu Disimpan': item.addedAt,
      };
      return row;
    });

    exportJsonToExcel(exportRows, 'KeranjangPivot', `Keranjang_Pivot_Pilihan_${Date.now()}`);
  };

  // Cart summary stats
  const cartTotalSum = cartItems.reduce((acc, item) => acc + item.grandTotal, 0);
  const cartAvg = cartItems.length > 0 ? cartTotalSum / cartItems.length : 0;
  const cartMax = cartItems.length > 0 ? Math.max(...cartItems.map((i) => i.grandTotal)) : 0;
  const cartMin = cartItems.length > 0 ? Math.min(...cartItems.map((i) => i.grandTotal)) : 0;

  return (
    <section
      id="multi-pivot-section"
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              4. Multi-Pivot Table & Grafik
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-bold">
                Auto-Chart & Cart
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Analisis multi-dimensi baris & kolom dengan visualisasi grafik dan keranjang simpan data
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pivotResult && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setDisplayMode('both')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  displayMode === 'both'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilkan Tabel & Grafik"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tabel & Grafik</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode('chart')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  displayMode === 'chart'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hanya Grafik"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Grafik Saja</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  displayMode === 'table'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hanya Tabel"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabel Saja</span>
              </button>
            </div>
          )}

          {pivotResult && (
            <button
              id="btn-export-pivot-xlsx"
              type="button"
              onClick={handleDownloadPivot}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Pivot (.xlsx)</span>
            </button>
          )}
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Row selection */}
        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-purple-700">
            1. Kolom Baris (Kategori):
          </label>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {columns.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedRows.includes(c)}
                  onChange={() => toggleRowSelect(c)}
                  className="w-3.5 h-3.5 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <span className="truncate">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Column side selection */}
        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-purple-700">
            2. Kolom Samping (Opsional):
          </label>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {columns.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedCols.includes(c)}
                  onChange={() => toggleColSelect(c)}
                  className="w-3.5 h-3.5 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <span className="truncate">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Value and Aggregator */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-3 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-600">
                Kolom Nilai (Value)
              </label>
              <select
                id="select-pivot-value-col"
                value={valSelect}
                onChange={(e) => setValSelect(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-600">
                Fungsi Hitung (Aggregator)
              </label>
              <select
                id="select-pivot-agg"
                value={aggSelect}
                onChange={(e) => setAggSelect(e.target.value as AggregatorType)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Sum">Sum (Penjumlahan Total)</option>
                <option value="Count">Count (Jumlah Frekuensi)</option>
                <option value="Average">Average (Rata-rata)</option>
                <option value="Max">Max (Nilai Tertinggi)</option>
                <option value="Min">Min (Nilai Terendah)</option>
              </select>
            </div>
          </div>

          <button
            id="btn-generate-pivot"
            type="button"
            onClick={handleGeneratePivot}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Perbarui Pivot & Grafik</span>
          </button>
        </div>
      </div>

      {/* Cart Toast Notification */}
      {cartNotification && (
        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in shadow-xs">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-purple-600" />
            <span>{cartNotification}</span>
          </span>
          <span className="text-[11px] text-purple-600 font-mono">
            {cartItems.length} Item di Keranjang
          </span>
        </div>
      )}

      {/* PIVOT CHART VISUALIZATION */}
      {pivotResult && (displayMode === 'both' || displayMode === 'chart') && (
        <PivotChartSection
          selectedRows={pivotResult.selectedRows}
          selectedCols={pivotResult.selectedCols}
          colValues={pivotResult.colValues}
          groupedData={pivotResult.groupedData}
          valueCol={pivotResult.valueCol}
          aggregator={pivotResult.aggregator}
        />
      )}

      {/* Pivot Output Table */}
      {pivotResult && (displayMode === 'both' || displayMode === 'table') && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs space-y-0">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-800">
                📋 Tabel Pivot [{pivotResult.aggregator} dari {pivotResult.valueCol}]
              </span>
              <span className="text-[11px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md font-medium">
                {Object.keys(pivotResult.groupedData).length} baris kategori
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addAllToCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition cursor-pointer"
                title="Tambahkan semua baris pivot ke keranjang"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Semua ke Keranjang</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="text-[11px] font-bold text-slate-700 uppercase bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3 w-12 text-center text-slate-500">Pilih</th>
                  {pivotResult.selectedRows.map((r) => (
                    <th key={r} className="px-3.5 py-3 border-l border-slate-200/80">
                      {r}
                    </th>
                  ))}
                  {pivotResult.colValues.map((c) => (
                    <th
                      key={c}
                      className="px-3.5 py-3 border-l border-slate-200/80 text-right whitespace-nowrap"
                    >
                      {c}
                    </th>
                  ))}
                  {pivotResult.selectedCols.length > 0 && (
                    <th className="px-3.5 py-3 text-right text-amber-700 font-bold whitespace-nowrap border-l border-slate-200/80">
                      Grand Total
                    </th>
                  )}
                  <th className="px-3.5 py-3 text-center w-28 text-slate-500 border-l border-slate-200/80">
                    Aksi Keranjang
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(pivotResult.groupedData).map((rowKey) => {
                  const rowParts = rowKey.split(' | ');
                  let allRowVals: number[] = [];
                  const inCart = isRowInCart(rowKey);

                  return (
                    <tr
                      key={rowKey}
                      className={`hover:bg-slate-50 transition-colors ${
                        inCart ? 'bg-purple-50/40' : ''
                      }`}
                    >
                      <td className="px-3.5 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={inCart}
                          onChange={() => toggleAddToCart(rowKey)}
                          className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                          title="Pilih ke Keranjang"
                        />
                      </td>

                      {rowParts.map((part, idx) => (
                        <td
                          key={idx}
                          className="px-3.5 py-2.5 font-medium text-slate-900 border-l border-slate-100"
                        >
                          {part}
                        </td>
                      ))}

                      {pivotResult.colValues.map((c) => {
                        const arr = pivotResult.groupedData[rowKey][c] || [];
                        const res = calculateAgg(arr, pivotResult.aggregator);
                        allRowVals = allRowVals.concat(arr);

                        return (
                          <td
                            key={c}
                            className="px-3.5 py-2.5 text-right font-mono font-semibold text-blue-700 border-l border-slate-100"
                          >
                            {res.toLocaleString('id-ID')}
                          </td>
                        );
                      })}

                      {pivotResult.selectedCols.length > 0 && (
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-amber-700 border-l border-slate-100">
                          {calculateAgg(allRowVals, pivotResult.aggregator).toLocaleString('id-ID')}
                        </td>
                      )}

                      <td className="px-3.5 py-2.5 text-center border-l border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleAddToCart(rowKey)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer ${
                            inCart
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Tersimpan</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>+ Cart</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🛒 FITUR KERANJANG DATA PIVOT (PIVOT CART)                    */}
      {/* ============================================================ */}
      <div
        id="pivot-cart-section"
        className="bg-slate-50 border-2 border-purple-200/80 rounded-2xl p-4 sm:p-5 space-y-4"
      >
        {/* Cart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                🛒 Keranjang Pivot (Data Pilihan)
                <span className="text-xs bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {cartItems.length} Item
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Kumpulkan baris pivot penting untuk dievaluasi, dibandingkan, atau diekspor terpisah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <>
                <button
                  id="btn-export-cart-xlsx"
                  type="button"
                  onClick={handleDownloadCart}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Keranjang (.xlsx)</span>
                </button>

                <button
                  id="btn-clear-cart"
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                  title="Kosongkan Keranjang"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cart Quick Metrics Summary */}
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium">Total Item Dipilih</span>
                <p className="text-sm sm:text-base font-bold text-purple-700 font-mono">
                  {cartItems.length} Baris
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium">Total Akumulasi</span>
                <p className="text-sm sm:text-base font-bold text-emerald-600 font-mono">
                  {cartTotalSum.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium">Rata-rata Pilihan</span>
                <p className="text-sm sm:text-base font-bold text-blue-600 font-mono">
                  {cartAvg.toLocaleString('id-ID', { maximumFractionDigits: 1 })}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium">Nilai Tertinggi (Max)</span>
                <p className="text-sm sm:text-base font-bold text-amber-600 font-mono">
                  {cartMax.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Cart Table View */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="max-h-72 overflow-auto">
                <table className="w-full text-xs text-left text-slate-700 border-collapse">
                  <thead className="text-[11px] font-bold text-slate-700 uppercase bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5 w-12 text-center text-slate-500">No</th>
                      <th className="px-3.5 py-2.5 border-l border-slate-200">Kategori Pivot</th>
                      <th className="px-3.5 py-2.5 text-right border-l border-slate-200">Total Nilai</th>
                      <th className="px-3.5 py-2.5 text-center w-28 border-l border-slate-200">Waktu</th>
                      <th className="px-3.5 py-2.5 text-center w-16 border-l border-slate-200">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cartItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="px-3.5 py-2.5 border-l border-slate-100 font-medium text-slate-900">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {Object.entries(item.categoryLabels).map(([colName, val]) => (
                              <span
                                key={colName}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-[11px]"
                              >
                                <strong className="font-semibold">{colName}:</strong> {val}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-700 border-l border-slate-100">
                          {item.grandTotal.toLocaleString('id-ID')}
                        </td>
                        <td className="px-3.5 py-2.5 text-center text-slate-400 text-[11px] font-mono border-l border-slate-100">
                          {item.addedAt}
                        </td>
                        <td className="px-3.5 py-2.5 text-center border-l border-slate-100">
                          <button
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus dari keranjang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Keranjang Pivot Masih Kosong</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Klik tanda centang atau tombol <strong>"+ Cart"</strong> pada baris tabel pivot di atas
              untuk memasukkan item tertentu ke keranjang ini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

