Import { useState, useEffect } from 'react';
import {
  Table2,
  GitMerge,
  LayoutGrid,
  Calculator,
  CheckCircle2,
  Rows,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { MergeAppendSection } from './components/MergeAppendSection';
import { MainTableSection } from './components/MainTableSection';
import { MultiPivotSection } from './components/MultiPivotSection';
import { FormulaCalcSection } from './components/FormulaCalcSection';
import { DataRow } from './types';

export default function App() {
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'merge' | 'pivot' | 'calc' | 'all'>('table');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from LocalStorage (Auto-Save restoration)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('mini_excel_raw_data');
      const savedColumns = localStorage.getItem('mini_excel_columns');
      const savedFileName = localStorage.getItem('mini_excel_filename');
      if (savedData && savedColumns) {
        const parsedRows = JSON.parse(savedData);
        const parsedCols = JSON.parse(savedColumns);
        if (Array.isArray(parsedRows) && parsedRows.length > 0) {
          setRawData(parsedRows);
          setColumns(parsedCols);
          if (savedFileName) setCurrentFileName(savedFileName);
          showToast('Data sebelumnya berhasil dipulihkan dari Auto-Save.');
        }
      }
    } catch (err) {
      console.error('Gagal memuat auto-save localStorage:', err);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDataLoaded = (rows: DataRow[], cols: string[], fileName: string) => {
    setRawData(rows);
    setColumns(cols);
    setCurrentFileName(fileName);
    setActiveTab('table');

    try {
      localStorage.setItem('mini_excel_raw_data', JSON.stringify(rows));
      localStorage.setItem('mini_excel_columns', JSON.stringify(cols));
      localStorage.setItem('mini_excel_filename', fileName);
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err);
    }

    showToast(`Berhasil memuat ${rows.length} baris dari ${fileName}`);
  };

  const handleClearStorage = () => {
    if (window.confirm('Hapus semua data tersimpan di memori lokal?')) {
      localStorage.removeItem('mini_excel_raw_data');
      localStorage.removeItem('mini_excel_columns');
      localStorage.removeItem('mini_excel_filename');
      setRawData([]);
      setColumns([]);
      setCurrentFileName('');
      showToast('Penyimpanan lokal telah dibersihkan.');
    }
  };

  const handleMergeSuccess = (mergedRows: DataRow[], mergedCols: string[]) => {
    setRawData(mergedRows);
    setColumns(mergedCols);
    try {
      localStorage.setItem('mini_excel_raw_data', JSON.stringify(mergedRows));
      localStorage.setItem('mini_excel_columns', JSON.stringify(mergedCols));
    } catch (err) {
      console.error(err);
    }
    setActiveTab('table');
    showToast(`Data berhasil digabungkan (${mergedRows.length} baris).`);
  };

  const handleDataChange = (newRows: DataRow[]) => {
    setRawData(newRows);
    try {
      localStorage.setItem('mini_excel_raw_data', JSON.stringify(newRows));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormulaColumnAdded = (newColName: string, updatedRows: DataRow[], updatedCols: string[]) => {
    setRawData(updatedRows);
    setColumns(updatedCols);
    try {
      localStorage.setItem('mini_excel_raw_data', JSON.stringify(updatedRows));
      localStorage.setItem('mini_excel_columns', JSON.stringify(updatedCols));
    } catch (err) {
      console.error(err);
    }
    showToast(`Kolom "${newColName}" berhasil ditambahkan ke tabel utama!`);
  };

  const hasData = rawData.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-white border border-blue-200 text-blue-800 text-xs px-4 py-3 rounded-2xl shadow-xl shadow-blue-500/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        rowCount={rawData.length}
        colCount={columns.length}
        onClearStorage={handleClearStorage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* SECTION 1: UPLOAD FILE UTAMA (SELALU MUNCUL DI ATAS) */}
        <UploadSection
          onDataLoaded={handleDataLoaded}
          currentFileName={currentFileName}
          rowCount={rawData.length}
          colCount={columns.length}
          hasData={hasData}
        />

        {/* JIKA BELUM ADA DATA: TAMPILKAN RINGKASAN FITUR */}
        {!hasData ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl text-center space-y-1.5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">
                Pilih atau seret file spreadsheet Excel (<code>.xlsx</code>, <code>.xls</code>) atau <code>.csv</code> pada kotak di atas untuk mulai mengolah data.
              </p>
              <p className="text-xs text-slate-500">
                Data diproses 100% aman di browser Anda dan tersimpan otomatis ke penyimpanan lokal.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                  <GitMerge className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">2. Merge & Append</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gabung baris vertikal (Union) atau gabung kolom (VLOOKUP Join by Key) dari file kedua.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <Table2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">3. Filter & Sortir</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Filter spesifik, sortir cerdas, conditional formatting, & hapus baris duplikat.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">4. Multi-Pivot Table</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pengelompokan baris jamak, pemisahan kolom, agregasi Sum/Count/Avg, & Grand Total.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">5. Kalkulator Rumus</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  SUMIF, COUNTIF, SUMIFS, perkalian kolom (Qty * Harga), dan kalkulasi kategori.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Bar Navigation */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-x-auto">
              <button
                id="nav-tab-table"
                type="button"
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'table'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Table2 className="w-4 h-4" />
                <span>3. Tabel Utama & Filter</span>
              </button>

              <button
                id="nav-tab-merge"
                type="button"
                onClick={() => setActiveTab('merge')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'merge'
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <GitMerge className="w-4 h-4" />
                <span>2. Merge & Append</span>
              </button>

              <button
                id="nav-tab-pivot"
                type="button"
                onClick={() => setActiveTab('pivot')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'pivot'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>4. Multi-Pivot</span>
              </button>

              <button
                id="nav-tab-calc"
                type="button"
                onClick={() => setActiveTab('calc')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'calc'
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>5. Kalkulator Rumus</span>
              </button>

              <button
                id="nav-tab-all"
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Tampilkan semua bagian dalam satu halaman panjang"
              >
                <Rows className="w-4 h-4" />
                <span>Tampilkan Semua Bagian</span>
              </button>
            </div>

            {/* Active Content Panel */}
            {activeTab === 'table' && (
              <MainTableSection
                rawData={rawData}
                columns={columns}
                onDataChange={handleDataChange}
              />
            )}

            {activeTab === 'merge' && (
              <MergeAppendSection
                mainRows={rawData}
                mainColumns={columns}
                onMergeSuccess={handleMergeSuccess}
              />
            )}

            {activeTab === 'pivot' && (
              <MultiPivotSection rawData={rawData} columns={columns} />
            )}

            {activeTab === 'calc' && (
              <FormulaCalcSection
                rawData={rawData}
                columns={columns}
                onAddCalculatedColumn={handleFormulaColumnAdded}
              />
            )}

            {activeTab === 'all' && (
              <div className="space-y-6">
                <MergeAppendSection
                  mainRows={rawData}
                  mainColumns={columns}
                  onMergeSuccess={handleMergeSuccess}
                />
                <MainTableSection
                  rawData={rawData}
                  columns={columns}
                  onDataChange={handleDataChange}
                />
                <MultiPivotSection rawData={rawData} columns={columns} />
                <FormulaCalcSection
                  rawData={rawData}
                  columns={columns}
                  onAddCalculatedColumn={handleFormulaColumnAdded}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
