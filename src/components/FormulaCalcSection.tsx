import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calculator,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Play,
  Search,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  Check,
  Copy,
  TableProperties,
  ArrowRight,
  ListFilter,
  Sigma,
  Calendar,
  DollarSign,
  Type as TypeIcon,
  SearchCode,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { DataRow, CalcMode, MultiCriteriaItem } from '../types';
import { exportJsonToExcel } from '../utils/excelHelper';
import {
  EXCEL_FORMULA_CATALOG,
  FormulaCategory,
  FormulaMeta,
  evaluateFormula,
} from '../utils/excelFormulaEngine';

interface FormulaCalcSectionProps {
  rawData: DataRow[];
  columns: string[];
  onAddCalculatedColumn?: (newColName: string, newRows: DataRow[], newCols: string[]) => void;
}

export function FormulaCalcSection({ rawData, columns, onAddCalculatedColumn }: FormulaCalcSectionProps) {
  // Main Suite Tab: 'formula_bar' | 'catalog' | 'wizard' | 'column_operator'
  const [suiteTab, setSuiteTab] = useState<'formula_bar' | 'catalog' | 'wizard' | 'column_operator'>('formula_bar');

  // Formula Bar State
  const [formulaInput, setFormulaInput] = useState<string>('=SUM([Harga], [Diskon])');
  const [targetNewColName, setTargetNewColName] = useState<string>('Total_Bersih');
  const [formulaLiveResult, setFormulaLiveResult] = useState<any>('');
  const [formulaError, setFormulaError] = useState<string | null>(null);

  // Catalog State
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<FormulaCategory>('Semua');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [selectedFormulaDetail, setSelectedFormulaDetail] = useState<FormulaMeta | null>(EXCEL_FORMULA_CATALOG[0]);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Classic Wizard State
  const [calcMode, setCalcMode] = useState<CalcMode>('operator');

  // Operator mode state
  const [opCol1, setOpCol1] = useState<string>(columns[0] || '');
  const [opSymbol, setOpSymbol] = useState<string>('*');
  const [opCol2, setOpCol2] = useState<string>(columns[1] || columns[0] || '');
  const [resultColName, setResultColName] = useState<string>('HasilKalkulasi');

  // Checkbox category state
  const [filterColSelect, setFilterColSelect] = useState<string>(columns[0] || '');
  const [uniqueCategoryItems, setUniqueCategoryItems] = useState<string[]>([]);
  const [checkedCategoryItems, setCheckedCategoryItems] = useState<string[]>([]);
  const [targetValSelect, setTargetValSelect] = useState<string>(columns[0] || '');

  // Single IF state
  const [ifColSelect, setIfColSelect] = useState<string>(columns[0] || '');
  const [ifOperator, setIfOperator] = useState<'equals' | 'contains' | 'gt' | 'lt'>('equals');
  const [ifCriteriaValue, setIfCriteriaValue] = useState<string>('');

  // Multi IFS state
  const [multiCriteriaList, setMultiCriteriaList] = useState<MultiCriteriaItem[]>([
    { id: '1', col: columns[0] || '', op: 'equals', val: '' },
  ]);

  // Results & Execution State
  const [lastCalcResult, setLastCalcResult] = useState<DataRow[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<string>('');
  const [calcStats, setCalcStats] = useState<{ sum: number; avg: number; min: number; max: number; count: number } | null>(null);
  const [previewSearch, setPreviewSearch] = useState<string>('');
  const [isAddedToMain, setIsAddedToMain] = useState<boolean>(false);

  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Sync column selections when columns prop changes
  useEffect(() => {
    if (columns.length > 0) {
      if (!opCol1 || !columns.includes(opCol1)) setOpCol1(columns[0]);
      if (!opCol2 || !columns.includes(opCol2)) setOpCol2(columns[1] || columns[0]);
      if (!filterColSelect || !columns.includes(filterColSelect)) setFilterColSelect(columns[0]);
      if (!targetValSelect || !columns.includes(targetValSelect)) setTargetValSelect(columns[0]);
      if (!ifColSelect || !columns.includes(ifColSelect)) setIfColSelect(columns[0]);
    }
  }, [columns]);

  // Update unique category items when filterColSelect changes
  useEffect(() => {
    if (!filterColSelect || rawData.length === 0) return;
    const items = Array.from(
      new Set(rawData.map((r) => String(r[filterColSelect] ?? '')))
    ).filter(Boolean);
    setUniqueCategoryItems(items);
    setCheckedCategoryItems(items);
  }, [filterColSelect, rawData]);

  // Live evaluation of formula on row 1 for instant feedback
  useEffect(() => {
    if (rawData.length === 0 || !formulaInput.trim()) {
      setFormulaLiveResult('');
      setFormulaError(null);
      return;
    }

    try {
      const res = evaluateFormula(formulaInput, rawData[0], rawData, columns, 0);
      if (typeof res === 'string' && (res.startsWith('#') || res.startsWith('#ERROR') || res.startsWith('#SYNTAX_ERR'))) {
        setFormulaError(res);
        setFormulaLiveResult('');
      } else {
        setFormulaError(null);
        setFormulaLiveResult(res);
      }
    } catch (err: any) {
      setFormulaError(err.message || 'Syntax error');
    }
  }, [formulaInput, rawData, columns]);

  // Insert column tag at cursor position
  const handleInsertColumnTag = (colName: string) => {
    const tag = `[${colName}]`;
    const input = formulaInputRef.current;
    if (input) {
      const start = input.selectionStart || formulaInput.length;
      const end = input.selectionEnd || formulaInput.length;
      const newFormula = formulaInput.substring(0, start) + tag + formulaInput.substring(end);
      setFormulaInput(newFormula);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + tag.length, start + tag.length);
      }, 50);
    } else {
      setFormulaInput((prev) => prev + ' ' + tag);
    }
  };

  // Insert formula from catalog
  const handleInsertFormulaFromCatalog = (formula: FormulaMeta) => {
    setFormulaInput(formula.example.startsWith('=') ? formula.example : `=${formula.example}`);
    setSuiteTab('formula_bar');
    if (formulaInputRef.current) {
      formulaInputRef.current.focus();
    }
  };

  const handleCopyExample = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Add criteria row for SUMIFS
  const addCriteriaRow = () => {
    setMultiCriteriaList([
      ...multiCriteriaList,
      {
        id: Date.now().toString(),
        col: columns[0] || '',
        op: 'equals',
        val: '',
      },
    ]);
  };

  const removeCriteriaRow = (id: string) => {
    if (multiCriteriaList.length === 1) return;
    setMultiCriteriaList(multiCriteriaList.filter((item) => item.id !== id));
  };

  const updateCriteriaRow = (id: string, field: keyof MultiCriteriaItem, value: any) => {
    setMultiCriteriaList(
      multiCriteriaList.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Execute Formula for all rows
  const runCustomFormula = () => {
    if (rawData.length === 0) {
      alert('Belum ada data yang dimuat! Silakan unggah file atau gunakan contoh data.');
      return;
    }

    if (!formulaInput.trim()) {
      alert('Masukkan rumus formula terlebih dahulu!');
      return;
    }

    const colName = targetNewColName.trim() || 'Hasil_Rumus';
    const computedRows: DataRow[] = [];
    const numericValues: number[] = [];

    rawData.forEach((row, index) => {
      const res = evaluateFormula(formulaInput, row, rawData, columns, index);
      const isNum = typeof res === 'number' && !isNaN(res);
      if (isNum) numericValues.push(res);

      computedRows.push({
        No: index + 1,
        ...row,
        [colName]: res,
      });
    });

    // Compute stats
    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      setCalcStats({ sum, avg, min, max, count: numericValues.length });
    } else {
      setCalcStats(null);
    }

    setIsAddedToMain(false);
    setSummaryInfo(`Rumus "${formulaInput}" berhasil diproses untuk seluruh ${rawData.length} baris.`);
    setLastCalcResult(computedRows);
  };

  // Add calculated column directly to main dataset
  const handleApplyToMainTable = () => {
    if (lastCalcResult.length === 0) {
      runCustomFormula();
    }
    const colName = targetNewColName.trim() || 'Hasil_Rumus';

    if (columns.includes(colName)) {
      if (!window.confirm(`Kolom "${colName}" sudah ada di tabel. Apakah Anda ingin menimpa nilainya?`)) {
        return;
      }
    }

    const updatedRows = rawData.map((row, index) => {
      const res = evaluateFormula(formulaInput, row, rawData, columns, index);
      return {
        ...row,
        [colName]: res,
      };
    });

    const updatedCols = columns.includes(colName) ? columns : [...columns, colName];

    if (onAddCalculatedColumn) {
      onAddCalculatedColumn(colName, updatedRows, updatedCols);
      setIsAddedToMain(true);
    } else {
      try {
        localStorage.setItem('mini_excel_raw_data', JSON.stringify(updatedRows));
        localStorage.setItem('mini_excel_columns', JSON.stringify(updatedCols));
        setIsAddedToMain(true);
        alert(`Kolom "${colName}" berhasil ditambahkan ke tabel utama!`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Run calculation from Classic Wizard
  const runWizardCalculation = () => {
    if (rawData.length === 0) {
      alert('Belum ada data yang dimuat!');
      return;
    }

    const exportData: DataRow[] = [];

    if (calcMode === 'operator') {
      const numericValues: number[] = [];
      rawData.forEach((row, index) => {
        const v1 = parseFloat(String(row[opCol1])) || 0;
        const v2 = parseFloat(String(row[opCol2])) || 0;
        let hasil = 0;
        if (opSymbol === '*') hasil = v1 * v2;
        else if (opSymbol === '/') hasil = v2 !== 0 ? v1 / v2 : 0;
        else if (opSymbol === '+') hasil = v1 + v2;
        else if (opSymbol === '-') hasil = v1 - v2;

        numericValues.push(hasil);
        exportData.push({
          No: index + 1,
          [opCol1]: v1,
          Operator: opSymbol,
          [opCol2]: v2,
          [resultColName || 'Hasil']: hasil,
        });
      });

      const sum = numericValues.reduce((a, b) => a + b, 0);
      setCalcStats({
        sum,
        avg: sum / numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        count: numericValues.length,
      });

      setSummaryInfo(`Operasi [${opCol1} ${opSymbol} ${opCol2}] selesai untuk ${rawData.length} baris.`);
      setLastCalcResult(exportData);
    } else if (
      calcMode === 'sumifs' ||
      calcMode === 'countifs' ||
      calcMode === 'averageifs'
    ) {
      const filtered = rawData.filter((row) => {
        return multiCriteriaList.every((crit) => {
          const cellStr = String(row[crit.col] ?? '').toLowerCase();
          const targetStr = crit.val.toLowerCase().trim();
          if (crit.op === 'equals') return cellStr === targetStr;
          if (crit.op === 'contains') return cellStr.includes(targetStr);
          if (crit.op === 'gt') return parseFloat(String(row[crit.col])) > parseFloat(crit.val);
          if (crit.op === 'lt') return parseFloat(String(row[crit.col])) < parseFloat(crit.val);
          return true;
        });
      });

      const numbers = filtered.map((r) => parseFloat(String(r[targetValSelect])) || 0);
      let resVal = 0;
      if (calcMode === 'sumifs') resVal = numbers.reduce((a, b) => a + b, 0);
      else if (calcMode === 'countifs') resVal = numbers.length;
      else if (calcMode === 'averageifs')
        resVal = numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;

      filtered.forEach((row, index) => {
        exportData.push({
          No: index + 1,
          [`Nilai (${targetValSelect})`]: parseFloat(String(row[targetValSelect])) || 0,
        });
      });

      exportData.push({
        No: 'HASIL AKHIR',
        [`Nilai (${targetValSelect})`]: resVal,
      });

      setSummaryInfo(`Hasil ${calcMode.toUpperCase()} (${filtered.length} baris cocok): ${resVal.toLocaleString('id-ID')}`);
      setLastCalcResult(exportData);
      setCalcStats(null);
    } else if (
      calcMode === 'sumif' ||
      calcMode === 'countif' ||
      calcMode === 'averageif'
    ) {
      const filtered = rawData.filter((row) => {
        const cellStr = String(row[ifColSelect] ?? '').toLowerCase();
        const targetStr = ifCriteriaValue.toLowerCase().trim();
        if (ifOperator === 'equals') return cellStr === targetStr;
        if (ifOperator === 'contains') return cellStr.includes(targetStr);
        if (ifOperator === 'gt')
          return parseFloat(String(row[ifColSelect])) > parseFloat(ifCriteriaValue);
        if (ifOperator === 'lt')
          return parseFloat(String(row[ifColSelect])) < parseFloat(ifCriteriaValue);
        return true;
      });

      const numbers = filtered.map((r) => parseFloat(String(r[targetValSelect])) || 0);
      let resVal = 0;
      if (calcMode === 'sumif') resVal = numbers.reduce((a, b) => a + b, 0);
      else if (calcMode === 'countif') resVal = numbers.length;
      else if (calcMode === 'averageif')
        resVal = numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;

      filtered.forEach((row, index) => {
        exportData.push({
          No: index + 1,
          [ifColSelect]: row[ifColSelect] ?? '',
          [targetValSelect]: parseFloat(String(row[targetValSelect])) || 0,
        });
      });

      exportData.push({
        No: 'HASIL AKHIR',
        [ifColSelect]: `${calcMode.toUpperCase()} (${filtered.length} cocok)`,
        [targetValSelect]: resVal,
      });

      setSummaryInfo(`Hasil ${calcMode.toUpperCase()}: ${resVal.toLocaleString('id-ID')}`);
      setLastCalcResult(exportData);
      setCalcStats(null);
    } else {
      if (checkedCategoryItems.length === 0) {
        alert('Pilih minimal satu item kategori!');
        return;
      }

      const filtered = rawData.filter((row) =>
        checkedCategoryItems.includes(String(row[filterColSelect] ?? ''))
      );
      const numbers = filtered.map((r) => parseFloat(String(r[targetValSelect])) || 0);

      let resVal = 0;
      if (calcMode === 'item_sum') resVal = numbers.reduce((a, b) => a + b, 0);
      else if (calcMode === 'item_avg')
        resVal = numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
      else if (calcMode === 'item_max') resVal = numbers.length ? Math.max(...numbers) : 0;
      else if (calcMode === 'item_min') resVal = numbers.length ? Math.min(...numbers) : 0;
      else if (calcMode === 'item_count') resVal = numbers.length;

      filtered.forEach((row, index) => {
        exportData.push({
          No: index + 1,
          [filterColSelect]: row[filterColSelect] ?? '',
          [targetValSelect]: parseFloat(String(row[targetValSelect])) || 0,
        });
      });

      exportData.push({
        No: 'HASIL AKHIR',
        [filterColSelect]: `Total terpilih (${filtered.length} baris)`,
        [targetValSelect]: resVal,
      });

      setSummaryInfo(`Hasil ${calcMode.toUpperCase()} (${checkedCategoryItems.length} kategori dipilih): ${resVal.toLocaleString('id-ID')}`);
      setLastCalcResult(exportData);
      setCalcStats(null);
    }
  };

  const handleDownloadCalc = () => {
    if (lastCalcResult.length === 0) {
      alert('Jalankan kalkulator terlebih dahulu!');
      return;
    }
    exportJsonToExcel(lastCalcResult, 'HasilKalkulasi', `Hasil_Kalkulator_Excel`);
  };

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return EXCEL_FORMULA_CATALOG.filter((f) => {
      const matchCat = selectedCatalogCategory === 'Semua' || f.category === selectedCatalogCategory;
      const q = catalogSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.syntax.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCatalogCategory, catalogSearch]);

  // Filter Preview Results
  const filteredPreviewRows = useMemo(() => {
    if (!previewSearch.trim()) return lastCalcResult;
    const q = previewSearch.toLowerCase();
    return lastCalcResult.filter((row) =>
      Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(q))
    );
  }, [lastCalcResult, previewSearch]);

  const previewColumns = useMemo(() => {
    if (lastCalcResult.length === 0) return [];
    return Object.keys(lastCalcResult[0]);
  }, [lastCalcResult]);

  // Icon Helper for Categories
  const getCategoryIcon = (cat: FormulaCategory) => {
    switch (cat) {
      case 'Matematika & Trigonometri':
        return <Sigma className="w-3.5 h-3.5" />;
      case 'Statistik':
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 'Logika & Kondisional':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Teks & String':
        return <TypeIcon className="w-3.5 h-3.5" />;
      case 'Lookup & Referensi':
        return <SearchCode className="w-3.5 h-3.5" />;
      case 'Tanggal & Waktu':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'Finansial & Bisnis':
        return <DollarSign className="w-3.5 h-3.5" />;
      default:
        return <Calculator className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="formula-calc-section" className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <span className="font-mono text-base font-bold">fx</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Formula Studio & Kalkulator Excel Lengkap
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                80+ Rumus Excel
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluator formula Excel resmi (Matematika, Statistik, Logika, Teks, Lookup, Tanggal, Finansial)
            </p>
          </div>
        </div>

        {lastCalcResult.length > 0 && (
          <button
            id="btn-export-calc-xlsx"
            type="button"
            onClick={handleDownloadCalc}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Hasil (.xlsx)</span>
          </button>
        )}
      </div>

      {/* Main Suite Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSuiteTab('formula_bar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            suiteTab === 'formula_bar'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
          }`}
        >
          <span className="font-mono font-black text-sm">fx</span>
          <span>Formula Bar & Evaluator</span>
        </button>

        <button
          onClick={() => setSuiteTab('catalog')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            suiteTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kamus & Katalog 80+ Rumus</span>
        </button>

        <button
          onClick={() => setSuiteTab('wizard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            suiteTab === 'wizard'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Wizard Kondisional (SUMIF, IFS)</span>
        </button>

        <button
          onClick={() => setSuiteTab('column_operator')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            suiteTab === 'column_operator'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Operasi Cepat Antar Kolom</span>
        </button>
      </div>

      {/* TAB 1: FORMULA BAR & EVALUATOR */}
      {suiteTab === 'formula_bar' && (
        <div className="space-y-5">
          {/* Formula Bar Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">fx</span>
                  Formula Bar Excel
                </span>
                <span className="text-[11px] text-slate-500">
                  (Mendukung nested formula, cell A1/A:A, nama kolom [Harga], & logika)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSuiteTab('catalog')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lihat Daftar Rumus</span>
                </button>
              </div>
            </div>

            {/* Input Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
                  fx
                </div>
                <input
                  ref={formulaInputRef}
                  type="text"
                  value={formulaInput}
                  onChange={(e) => setFormulaInput(e.target.value)}
                  placeholder='=IF([Harga] > 100000, [Harga] * 0.9, [Harga]) atau =VLOOKUP([Kode], [Daftar], 2, FALSE)'
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={targetNewColName}
                  onChange={(e) => setTargetNewColName(e.target.value)}
                  placeholder="Nama Kolom Baru"
                  title="Nama kolom hasil perhitungan"
                  className="w-40 sm:w-48 px-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={runCustomFormula}
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Hitung Semua</span>
                </button>
              </div>
            </div>

            {/* Available Column Chips Quick Insert */}
            {columns.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">
                    💡 Klik Kolom untuk Menyisipkan ke Rumus:
                  </span>
                  <span className="text-[10px] text-slate-400">Total {columns.length} kolom tersedia</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white border border-slate-200 rounded-xl">
                  {columns.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleInsertColumnTag(c)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                    >
                      [{c}]
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Result & Syntax Verification Box */}
            <div className="p-3.5 rounded-xl border bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Simulasi Live Baris ke-1:
                </span>
                {formulaError ? (
                  <p className="text-rose-600 font-mono text-[11px] flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{formulaError}</span>
                  </p>
                ) : (
                  <p className="text-slate-600">
                    Hasil untuk baris 1: <strong className="text-emerald-700 font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{String(formulaLiveResult !== '' ? formulaLiveResult : '...')}</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleApplyToMainTable}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>{isAddedToMain ? '✓ Sudah Ada di Tabel' : '+ Tambah ke Tabel Utama'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Examples Showcase Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Contoh Rumus Populer yang Siap Pakai:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { title: 'Diskon Bersyarat IF', formula: '=IF([Harga] > 100000, [Harga] * 0.9, [Harga])', name: 'Harga_Diskon' },
                { title: 'Penggabungan Teks CONCAT', formula: '=CONCAT([Kategori], " - ", [Kota])', name: 'Kategori_Kota' },
                { title: 'Pembulatan ROUND', formula: '=ROUND([Harga] * 1.11, 0)', name: 'Harga_Plus_PPN' },
                { title: 'Teks Kapital UPPER & TRIM', formula: '=UPPER(TRIM([Kategori]))', name: 'Kategori_Besar' },
                { title: 'Selisih Hari DATEDIF', formula: '=DATEDIF([Tanggal], TODAY(), "D")', name: 'Usia_Hari' },
                { title: 'Total Multi Kriteria SUMIFS', formula: '=SUMIFS(Total, Kategori, "Elektronik", Status, "Lunas")', name: 'Total_Elek_Lunas' },
              ].map((ex, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setFormulaInput(ex.formula);
                    setTargetNewColName(ex.name);
                  }}
                  className="p-2.5 bg-white border border-slate-200 hover:border-amber-400 rounded-xl cursor-pointer transition space-y-1 hover:shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span>{ex.title}</span>
                    <span className="text-amber-600 text-[10px]">Terapkan &rarr;</span>
                  </div>
                  <p className="font-mono text-[10px] text-blue-700 truncate bg-slate-50 p-1 rounded">
                    {ex.formula}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KATALOG & KAMUS 80+ RUMUS EXCEL */}
      {suiteTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Cari rumus Excel (misal: VLOOKUP, SUMIFS, IF, TEXTJOIN, DATEDIF, PMT, dll)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(
              [
                'Semua',
                'Matematika & Trigonometri',
                'Statistik',
                'Logika & Kondisional',
                'Teks & String',
                'Lookup & Referensi',
                'Tanggal & Waktu',
                'Finansial & Bisnis',
                'Informasi & Error',
              ] as FormulaCategory[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCatalogCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedCatalogCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Catalog Layout: Left Grid & Right Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* List of Formulas */}
            <div className="lg:col-span-7 space-y-2 max-h-[500px] overflow-y-auto pr-1">
              <div className="text-xs text-slate-500 font-medium">
                Ditemukan <strong>{filteredCatalog.length}</strong> rumus Excel
              </div>
              {filteredCatalog.map((formula) => {
                const isSelected = selectedFormulaDetail?.name === formula.name;
                return (
                  <div
                    key={formula.name}
                    onClick={() => setSelectedFormulaDetail(formula)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {formula.name}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full">
                          {formula.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate">{formula.description}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsertFormulaFromCatalog(formula);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        title="Sisipkan rumus ini ke Formula Bar"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Gunakan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail View Panel */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 self-start sticky top-20">
              {selectedFormulaDetail ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black font-mono text-slate-900">
                          {selectedFormulaDetail.name}
                        </h3>
                        <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {selectedFormulaDetail.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Rumus Resmi Spreadsheet</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInsertFormulaFromCatalog(selectedFormulaDetail)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Pakai Rumus</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Penjelasan:</span>
                      <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                        {selectedFormulaDetail.description}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Sintaks & Struktur Parameter:</span>
                      <div className="bg-slate-900 text-amber-300 font-mono p-3 rounded-xl text-xs overflow-x-auto">
                        ={selectedFormulaDetail.syntax}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-700">Contoh Penggunaan:</span>
                        <button
                          type="button"
                          onClick={() => handleCopyExample(selectedFormulaDetail.example)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedFormula === selectedFormulaDetail.example ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded-xl font-mono text-blue-800 text-xs break-all">
                        {selectedFormulaDetail.example}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1 italic">
                        {selectedFormulaDetail.exampleExplanation}
                      </p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                      <span className="font-bold text-emerald-900">Contoh Hasil:</span>
                      <span className="font-mono font-bold text-emerald-800 text-xs">
                        {String(selectedFormulaDetail.sampleResult)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Pilih rumus di sisi kiri untuk melihat panduan lengkap.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WIZARD KONDISIONAL (SUMIF, SUMIFS, CHECKBOX) */}
      {suiteTab === 'wizard' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700">
                Pilih Tipe Agregasi Bersyarat
              </label>
              <select
                value={calcMode}
                onChange={(e) => setCalcMode(e.target.value as CalcMode)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
              >
                <option value="sumif">SUMIF (Total dengan 1 Syarat Kategori)</option>
                <option value="countif">COUNTIF (Hitung Jumlah dengan 1 Syarat)</option>
                <option value="averageif">AVERAGEIF (Rata-rata dengan 1 Syarat)</option>
                <option value="sumifs">SUMIFS (Total dengan Banyak Kriteria / Multi-Syarat)</option>
                <option value="countifs">COUNTIFS (Hitung Banyak Kriteria)</option>
                <option value="averageifs">AVERAGEIFS (Rata-rata Banyak Kriteria)</option>
                <option value="item_sum">Total (Sum) Berdasarkan Pilihan Checkbox</option>
                <option value="item_avg">Rata-rata (Avg) Berdasarkan Pilihan Checkbox</option>
                <option value="item_max">Nilai Tertinggi (Max) Berdasarkan Checkbox</option>
                <option value="item_min">Nilai Terendah (Min) Berdasarkan Checkbox</option>
              </select>
            </div>

            {/* Single IF Form */}
            {(calcMode === 'sumif' || calcMode === 'countif' || calcMode === 'averageif') && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom Kriteria</label>
                  <select
                    value={ifColSelect}
                    onChange={(e) => setIfColSelect(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Operator Syarat</label>
                  <select
                    value={ifOperator}
                    onChange={(e) => setIfOperator(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="equals">Sama Dengan (=)</option>
                    <option value="contains">Mengandung Teks</option>
                    <option value="gt">Lebih Besar Dari (&gt;)</option>
                    <option value="lt">Lebih Kecil Dari (&lt;)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Nilai yang Dicari</label>
                  <input
                    type="text"
                    value={ifCriteriaValue}
                    onChange={(e) => setIfCriteriaValue(e.target.value)}
                    placeholder="Nilai kriteria..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom Nilai yang Dihitung</label>
                  <select
                    value={targetValSelect}
                    onChange={(e) => setTargetValSelect(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Multi IFS Form */}
            {(calcMode === 'sumifs' || calcMode === 'countifs' || calcMode === 'averageifs') && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Daftar Multi-Kriteria:</label>
                  <button
                    type="button"
                    onClick={addCriteriaRow}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Kriteria</span>
                  </button>
                </div>

                {multiCriteriaList.map((crit, idx) => (
                  <div key={crit.id} className="flex flex-col sm:flex-row items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                    <select
                      value={crit.col}
                      onChange={(e) => updateCriteriaRow(crit.id, 'col', e.target.value)}
                      className="w-full sm:w-1/3 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2"
                    >
                      {columns.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select
                      value={crit.op}
                      onChange={(e) => updateCriteriaRow(crit.id, 'op', e.target.value)}
                      className="w-full sm:w-1/4 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2"
                    >
                      <option value="equals">Sama Dengan (=)</option>
                      <option value="contains">Mengandung</option>
                      <option value="gt">&gt; (Lebih Besar)</option>
                      <option value="lt">&lt; (Lebih Kecil)</option>
                    </select>

                    <input
                      type="text"
                      value={crit.val}
                      onChange={(e) => updateCriteriaRow(crit.id, 'val', e.target.value)}
                      placeholder="Nilai kriteria..."
                      className="w-full sm:flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2"
                    />

                    {multiCriteriaList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCriteriaRow(crit.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom Nilai Target</label>
                  <select
                    value={targetValSelect}
                    onChange={(e) => setTargetValSelect(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Checkbox Category Selector */}
            {calcMode.startsWith('item_') && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom Kategori</label>
                    <select
                      value={filterColSelect}
                      onChange={(e) => setFilterColSelect(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2"
                    >
                      {columns.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom Angka Target</label>
                    <select
                      value={targetValSelect}
                      onChange={(e) => setTargetValSelect(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2"
                    >
                      {columns.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Centang Kategori yang Dihitung:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCheckedCategoryItems(
                          checkedCategoryItems.length === uniqueCategoryItems.length ? [] : [...uniqueCategoryItems]
                        )
                      }
                      className="text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      {checkedCategoryItems.length === uniqueCategoryItems.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    {uniqueCategoryItems.map((item) => {
                      const isChecked = checkedCategoryItems.includes(item);
                      return (
                        <label
                          key={item}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition ${
                            isChecked
                              ? 'bg-purple-100/80 border-purple-300 text-purple-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setCheckedCategoryItems([...checkedCategoryItems, item]);
                              else setCheckedCategoryItems(checkedCategoryItems.filter((x) => x !== item));
                            }}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={runWizardCalculation}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Jalankan Kalkulasi Wizard</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: OPERASI CEPAT ANTAR KOLOM */}
      {suiteTab === 'column_operator' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Kalkulator Aritmatika Kolom (Contoh: Qty * Harga, Total - Diskon)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom 1</label>
                <select
                  value={opCol1}
                  onChange={(e) => setOpCol1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                >
                  {columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-600">Operator</label>
                <select
                  value={opSymbol}
                  onChange={(e) => setOpSymbol(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold font-mono text-center"
                >
                  <option value="*">x (Perkalian)</option>
                  <option value="/">÷ (Pembagian)</option>
                  <option value="+">+ (Penjumlahan)</option>
                  <option value="-">- (Pengurangan)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-600">Kolom 2</label>
                <select
                  value={opCol2}
                  onChange={(e) => setOpCol2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                >
                  {columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-600">Nama Kolom Hasil</label>
                <input
                  type="text"
                  value={resultColName}
                  onChange={(e) => setResultColName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCalcMode('operator');
                runWizardCalculation();
              }}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Hitung Operasi Kolom</span>
            </button>
          </div>
        </div>
      )}

      {/* RESULT SECTION & STATS */}
      {lastCalcResult.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Summary Alert */}
          {summaryInfo && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold">{summaryInfo}</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px] shrink-0 font-medium">
                {lastCalcResult.length} baris
              </span>
            </div>
          )}

          {/* Quick Metrics Cards */}
          {calcStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Total (Sum)</span>
                <p className="text-sm sm:text-base font-black font-mono text-slate-900">
                  {Number(calcStats.sum.toFixed(2)).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Rata-Rata (Avg)</span>
                <p className="text-sm sm:text-base font-black font-mono text-blue-700">
                  {Number(calcStats.avg.toFixed(2)).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Tertinggi (Max)</span>
                <p className="text-sm sm:text-base font-black font-mono text-emerald-700">
                  {Number(calcStats.max.toFixed(2)).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Terendah (Min)</span>
                <p className="text-sm sm:text-base font-black font-mono text-amber-700">
                  {Number(calcStats.min.toFixed(2)).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}

          {/* Result Table Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TableProperties className="w-4 h-4 text-emerald-600" />
              Preview Hasil Kalkulasi (50 Baris Pertama):
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={previewSearch}
                onChange={(e) => setPreviewSearch(e.target.value)}
                placeholder="Filter hasil..."
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleDownloadCalc}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-80 border border-slate-200 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold sticky top-0 border-b border-slate-200">
                <tr>
                  {previewColumns.map((col) => (
                    <th key={col} className="px-3.5 py-2.5 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredPreviewRows.slice(0, 50).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition">
                    {previewColumns.map((col) => {
                      const val = row[col];
                      const isNum = typeof val === 'number';
                      return (
                        <td
                          key={col}
                          className={`px-3.5 py-2 whitespace-nowrap ${
                            isNum ? 'text-right font-bold text-blue-800' : 'text-slate-800 font-sans'
                          }`}
                        >
                          {isNum ? val.toLocaleString('id-ID') : String(val ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
