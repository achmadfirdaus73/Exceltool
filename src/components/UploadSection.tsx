import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { readExcelFile, parseSheetToRows } from '../utils/excelHelper';
import { DataRow } from '../types';

interface UploadSectionProps {
  onDataLoaded: (rows: DataRow[], columns: string[], fileName: string) => void;
  currentFileName?: string;
  rowCount?: number;
  colCount?: number;
  hasData: boolean;
}

export function UploadSection({
  onDataLoaded,
  currentFileName,
  rowCount = 0,
  colCount = 0,
  hasData,
}: UploadSectionProps) {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>(currentFileName || '');
  const [isExpanded, setIsExpanded] = useState<boolean>(!hasData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    try {
      setFileName(file.name);
      const res = await readExcelFile(file);
      setWorkbook(res.workbook);
      setSheetNames(res.sheetNames);

      if (res.sheetNames.length > 1) {
        setSelectedSheet(res.sheetNames[0]);
      } else if (res.sheetNames.length === 1) {
        const { rows, columns } = parseSheetToRows(res.workbook, res.sheetNames[0]);
        if (rows.length === 0) {
          alert('Sheet kosong atau format tidak sesuai!');
        } else {
          onDataLoaded(rows, columns, file.name);
          setIsExpanded(false);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('Gagal membaca file Excel/CSV: ' + (err.message || 'Format tidak didukung'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleLoadSelectedSheet = () => {
    if (!workbook || !selectedSheet) return;
    const { rows, columns } = parseSheetToRows(workbook, selectedSheet);
    if (rows.length === 0) {
      alert('Sheet kosong!');
      return;
    }
    onDataLoaded(rows, columns, fileName || 'Data');
    setIsExpanded(false);
  };

  return (
    <section
      id="upload-data-section"
      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              📂 1. Upload Data Excel / CSV
            </h2>
            <p className="text-xs text-slate-500">
              Pilih file Excel (<code>.xlsx</code>, <code>.xls</code>) atau <code>.csv</code> untuk diolah
            </p>
          </div>
        </div>

        {hasData && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-toggle-upload-box"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Tutup Upload' : 'Ganti / Upload File Lain'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Info bar if data loaded */}
      {hasData && !isExpanded && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <div>
              <span className="text-slate-500">File Aktif: </span>
              <strong className="text-slate-900 font-semibold">{currentFileName || 'Data Excel'}</strong>
              <span className="text-slate-500 ml-2">
                ({rowCount.toLocaleString('id-ID')} baris, {colCount} kolom)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Pilih File Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Dropzone and Controls (Shown when no data or expanded) */}
      {(isExpanded || !hasData) && (
        <div className="space-y-4 pt-1">
          {/* Standard Input Form */}
          <div>
            <label
              className="block mb-2 text-xs font-semibold text-slate-700"
              htmlFor="fileInputPrimary"
            >
              Pilih file Excel / CSV dari perangkat Anda:
            </label>
            <input
              id="fileInputPrimary"
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="block w-full text-xs sm:text-sm text-slate-600 border border-slate-200 rounded-xl cursor-pointer bg-slate-50 focus:outline-none file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />
          </div>

          {/* Drag and Drop Zone */}
          <div
            id="file-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {isLoading ? 'Sedang membaca file...' : 'Klik untuk pilih file atau seret file .xlsx/.csv ke sini'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mendukung file Excel multi-sheet, format CSV koma/titik-koma
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Multi-sheet selector alert */}
      {sheetNames.length > 1 && (
        <div
          id="multi-sheet-panel"
          className="mt-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
        >
          <div className="flex items-center gap-2 text-amber-900">
            <Layers className="w-4 h-4 shrink-0 text-amber-700" />
            <span className="font-semibold text-xs sm:text-sm">
              File memiliki {sheetNames.length} sheet. Pilih sheet:
            </span>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-2">
            <select
              id="select-sheet-dropdown"
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="w-full sm:w-64 bg-white border border-amber-300 text-slate-800 text-xs sm:text-sm rounded-xl p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {sheetNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              id="btn-confirm-load-sheet"
              onClick={handleLoadSelectedSheet}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm"
            >
              Muat Sheet
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
