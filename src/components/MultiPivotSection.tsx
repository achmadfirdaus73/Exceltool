import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Download,
  Play,
  BarChart3,
  Table as TableIcon,
  Eye,
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

export function MultiPivotSection({ rawData, columns }: MultiPivotSectionProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [valSelect, setValSelect] = useState<string>(columns[0] || '');
  const [aggSelect, setAggSelect] = useState<AggregatorType>('Sum');
  const [pivotResult, setPivotResult] = useState<PivotResult | null>(null);
  const [displayMode, setDisplayMode] = useState<'both' | 'table' | 'chart'>('both');

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
            </h2>
            <p className="text-xs text-slate-500">
              Analisis multi-dimensi baris & kolom dengan agregasi nilai dan visualisasi grafik interaktif
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
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                  selectedRows.includes(c)
                    ? 'bg-purple-100/90 border-purple-300 font-semibold text-purple-900'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRows.includes(c)}
                  onChange={() => toggleRowSelect(c)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                />
                <span className="truncate">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Column breakdown */}
        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-indigo-700">
            2. Pemecah Kolom (Opsional):
          </label>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {columns.map((c) => (
              <label
                key={c}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                  selectedCols.includes(c)
                    ? 'bg-indigo-100/90 border-indigo-300 font-semibold text-indigo-900'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCols.includes(c)}
                  onChange={() => toggleColSelect(c)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="truncate">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Values and Aggregator */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-3 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-600">
                Kolom Nilai (Data Angka)
              </label>
              <select
                id="select-pivot-val"
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
          </div>

          <div className="max-h-96 overflow-auto">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="text-[11px] font-bold text-slate-700 uppercase bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3 w-12 text-center text-slate-500">No</th>
                  {pivotResult.selectedRows.map((r) => (
                    <th key={r} className="px-3.5 py-3 border-l border-slate-200/80">
                      {r}
                    </th>
                  ))}
                  {pivotResult.colValues.map((c) => (
                    <th
                      key={c}
                      className="px-3.5 py-2.5 border-l border-slate-200/80 text-right whitespace-nowrap"
                    >
                      {c}
                    </th>
                  ))}
                  {pivotResult.selectedCols.length > 0 && (
                    <th className="px-3.5 py-3 text-right text-amber-700 font-bold whitespace-nowrap border-l border-slate-200/80">
                      Grand Total
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(pivotResult.groupedData).map((rowKey, rowIdx) => {
                  const rowParts = rowKey.split(' | ');
                  let allRowVals: number[] = [];

                  return (
                    <tr
                      key={rowKey}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono">
                        {rowIdx + 1}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
