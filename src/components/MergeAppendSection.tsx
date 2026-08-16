import { useState, useRef, ChangeEvent } from 'react';
import { GitMerge, PlusCircle, CheckSquare, Sparkles, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { readExcelFile, parseSheetToRows } from '../utils/excelHelper';
import { SAMPLE_SUPPLEMENTARY_DATA } from '../utils/sampleData';
import { DataRow, MergeMode } from '../types';

interface MergeAppendSectionProps {
  mainRows: DataRow[];
  mainColumns: string[];
  onMergeSuccess: (mergedRows: DataRow[], mergedColumns: string[]) => void;
}

export function MergeAppendSection({
  mainRows,
  mainColumns,
  onMergeSuccess,
}: MergeAppendSectionProps) {
  const [workbook2, setWorkbook2] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames2, setSheetNames2] = useState<string[]>([]);
  const [selectedSheet2, setSelectedSheet2] = useState<string>('');
  const [file2Rows, setFile2Rows] = useState<DataRow[]>([]);
  const [file2Columns, setFile2Columns] = useState<string[]>([]);
  const [file2Name, setFile2Name] = useState<string>('');

  const [mergeMode, setMergeMode] = useState<MergeMode>('append');
  const [keyMain, setKeyMain] = useState<string>(mainColumns[0] || '');
  const [keySecond, setKeySecond] = useState<string>('');
  const [selectedCols2, setSelectedCols2] = useState<string[]>([]);
  const [innerJoin, setInnerJoin] = useState<boolean>(false);

  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileChange2 = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFile2Name(file.name);
      const res = await readExcelFile(file);
      setWorkbook2(res.workbook);
      setSheetNames2(res.sheetNames);

      if (res.sheetNames.length > 1) {
        setSelectedSheet2(res.sheetNames[0]);
      } else if (res.sheetNames.length === 1) {
        loadData2(res.workbook, res.sheetNames[0], file.name);
      }
    } catch (err: any) {
      alert('Gagal membaca file kedua: ' + (err.message || 'Format tidak valid'));
    }
  };

  const loadData2 = (wb: XLSX.WorkBook, sheetName: string, name: string) => {
    const { rows, columns } = parseSheetToRows(wb, sheetName);
    if (rows.length === 0) {
      alert('Sheet file kedua kosong!');
      return;
    }
    setFile2Rows(rows);
    setFile2Columns(columns);
    setKeySecond(columns[0] || '');
    setSelectedCols2(columns);
  };

  const handleLoadSample2 = () => {
    const cols = Object.keys(SAMPLE_SUPPLEMENTARY_DATA[0]);
    setFile2Rows(SAMPLE_SUPPLEMENTARY_DATA);
    setFile2Columns(cols);
    setFile2Name('Contoh_Data_Tambahan_Sales.xlsx');
    setKeySecond(cols[0] || '');
    setSelectedCols2(cols);
  };

  const toggleCol2 = (col: string) => {
    if (selectedCols2.includes(col)) {
      setSelectedCols2(selectedCols2.filter((c) => c !== col));
    } else {
      setSelectedCols2([...selectedCols2, col]);
    }
  };

  const executeMerge = () => {
    if (file2Rows.length === 0) {
      alert('Muat file kedua terlebih dahulu!');
      return;
    }

    let resultRows: DataRow[] = [];
    let resultCols: string[] = [];

    if (mergeMode === 'append') {
      const unionCols = [...mainColumns];
      file2Columns.forEach((c) => {
        if (!unionCols.includes(c)) unionCols.push(c);
      });

      const baseRows = mainRows.map((r) => {
        const o: DataRow = {};
        unionCols.forEach((c) => {
          o[c] = r[c] !== undefined ? r[c] : '';
        });
        return o;
      });

      const appendRows = file2Rows.map((r) => {
        const o: DataRow = {};
        unionCols.forEach((c) => {
          o[c] = r[c] !== undefined ? r[c] : '';
        });
        return o;
      });

      resultRows = baseRows.concat(appendRows);
      resultCols = unionCols;
    } else if (mergeMode === 'merge_nokey') {
      const cols2Renamed = file2Columns.map((c) =>
        mainColumns.includes(c) ? `${c}_2` : c
      );
      const maxLen = Math.max(mainRows.length, file2Rows.length);
      const merged: DataRow[] = [];

      for (let i = 0; i < maxLen; i++) {
        const o: DataRow = {};
        mainColumns.forEach((c) => {
          o[c] = mainRows[i] ? (mainRows[i][c] !== undefined ? mainRows[i][c] : '') : '';
        });
        file2Columns.forEach((c, idx) => {
          const newName = cols2Renamed[idx];
          o[newName] = file2Rows[i]
            ? file2Rows[i][c] !== undefined
              ? file2Rows[i][c]
              : ''
            : '';
        });
        merged.push(o);
      }

      resultRows = merged;
      resultCols = [...mainColumns, ...cols2Renamed];
    } else if (mergeMode === 'merge_key') {
      if (!keyMain || !keySecond) {
        alert('Pilih kolom kunci untuk kedua file!');
        return;
      }
      if (selectedCols2.length === 0) {
        alert('Pilih minimal satu kolom dari file kedua untuk digabungkan!');
        return;
      }

      const renamedMap: Record<string, string> = {};
      selectedCols2.forEach((c) => {
        renamedMap[c] = mainColumns.includes(c) && c !== keyMain ? `${c}_2` : c;
      });

      const merged: DataRow[] = [];
      mainRows.forEach((row) => {
        const mainVal = String(row[keyMain] ?? '').trim();
        const matchRow = file2Rows.find(
          (r2) => String(r2[keySecond] ?? '').trim() === mainVal
        );

        if (!matchRow && innerJoin) return;

        const o: DataRow = { ...row };
        selectedCols2.forEach((c) => {
          o[renamedMap[c]] = matchRow ? (matchRow[c] !== undefined ? matchRow[c] : '') : '';
        });
        merged.push(o);
      });

      resultRows = merged;
      const newAddedCols = selectedCols2.map((c) => renamedMap[c]).filter((c) => !mainColumns.includes(c));
      resultCols = [...mainColumns, ...newAddedCols];
    }

    onMergeSuccess(resultRows, resultCols);
    alert(`Berhasil digabung! Data sekarang memiliki ${resultRows.length} baris dan ${resultCols.length} kolom.`);
  };

  return (
    <section id="merge-append-section" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              2. Merge & Append Data (Opsional)
            </h2>
            <p className="text-xs text-slate-500">
              Gabungkan file kedua (Excel / CSV) dengan tabel data utama
            </p>
          </div>
        </div>

        <button
          id="btn-sample-merge2"
          onClick={handleLoadSample2}
          className="text-xs text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Muat Contoh File Kedua</span>
          <span className="sm:hidden">Contoh 2</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Upload file 2 */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-slate-700">
            Pilih File Kedua (Excel / CSV)
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef2}
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange2}
              className="block w-full text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer bg-slate-50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
            />
          </div>
        </div>

        {/* Sheet 2 selector if multiple */}
        {sheetNames2.length > 1 && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs text-slate-700 font-semibold">Pilih Sheet File Kedua:</span>
            <select
              value={selectedSheet2}
              onChange={(e) => setSelectedSheet2(e.target.value)}
              className="flex-1 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {sheetNames2.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => workbook2 && loadData2(workbook2, selectedSheet2, file2Name)}
              className="px-3 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600 transition cursor-pointer"
            >
              Muat
            </button>
          </div>
        )}

        {/* Controls when file 2 loaded */}
        {file2Rows.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-teal-800 bg-teal-50 p-3 rounded-xl border border-teal-200">
              <span className="flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>
                  File kedua dimuat: <strong className="font-bold">{file2Name}</strong> ({file2Rows.length.toLocaleString('id-ID')} baris, {file2Columns.length} kolom)
                </span>
              </span>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                Mode Penggabungan
              </label>
              <select
                id="select-merge-mode"
                value={mergeMode}
                onChange={(e) => setMergeMode(e.target.value as MergeMode)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="append">Append (Gabung Baris - Union vertikal)</option>
                <option value="merge_nokey">Merge Tanpa Kunci (Gabung Kolom Sejajar per Baris)</option>
                <option value="merge_key">Merge Dengan Kunci (Join by Key, mirip VLOOKUP)</option>
              </select>
            </div>

            {mergeMode === 'append' && (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 leading-relaxed">
                Baris dari file kedua akan ditambahkan ke bawah tabel utama. Kolom dengan nama yang sama otomatis disatukan; kolom yang baru akan ditambahkan di tabel.
              </div>
            )}

            {mergeMode === 'merge_nokey' && (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 leading-relaxed">
                Semua kolom dari file kedua akan ditempel di samping kanan tabel utama berdasarkan urutan nomor baris (baris ke-1 dengan baris ke-1). Kolom dengan nama sama akan otomatis diberi akhiran <code>_2</code>.
              </div>
            )}

            {mergeMode === 'merge_key' && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-600">
                      Kolom Kunci - Data Utama
                    </label>
                    <select
                      id="select-key-main"
                      value={keyMain}
                      onChange={(e) => setKeyMain(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      {mainColumns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-600">
                      Kolom Kunci - File Kedua
                    </label>
                    <select
                      id="select-key-second"
                      value={keySecond}
                      onChange={(e) => setKeySecond(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      {file2Columns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Pilih Kolom dari File Kedua yang Ingin Digabungkan:
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCols2(
                          selectedCols2.length === file2Columns.length ? [] : [...file2Columns]
                        )
                      }
                      className="text-[11px] text-teal-700 font-semibold hover:underline"
                    >
                      {selectedCols2.length === file2Columns.length ? 'Batal Semua' : 'Pilih Semua'}
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto bg-white border border-slate-200 p-2.5 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {file2Columns.map((c) => (
                      <label
                        key={c}
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCols2.includes(c)}
                          onChange={() => toggleCol2(c)}
                          className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                        />
                        <span className="truncate">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={innerJoin}
                    onChange={(e) => setInnerJoin(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span>Hanya tampilkan baris yang cocok pada kedua file (Inner Join)</span>
                </label>
              </div>
            )}

            <button
              id="btn-run-merge"
              type="button"
              onClick={executeMerge}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-teal-600/20 transition cursor-pointer"
            >
              Jalankan Gabung Data
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
