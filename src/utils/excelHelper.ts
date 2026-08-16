import * as XLSX from 'xlsx';
import { DataRow } from '../types';

export interface ParseResult {
  workbook: XLSX.WorkBook;
  sheetNames: string[];
}

export function readExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve({
          workbook,
          sheetNames: workbook.SheetNames || [],
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function parseSheetToRows(workbook: XLSX.WorkBook, sheetName: string): { rows: DataRow[]; columns: string[] } {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return { rows: [], columns: [] };

  const rawJson: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (!rawJson || rawJson.length === 0) {
    return { rows: [], columns: [] };
  }

  let firstRow = rawJson[0] || [];
  let hasValidHeader = firstRow.some((cell) => cell !== undefined && cell !== '' && isNaN(Number(cell)));

  let parsed: DataRow[] = [];
  if (!hasValidHeader) {
    parsed = XLSX.utils.sheet_to_json<DataRow>(sheet, { header: 'A' });
  } else {
    let headerRowIndex = 0;
    for (let i = 0; i < rawJson.length; i++) {
      let row = rawJson[i];
      let hasText = row && row.some((cell) => cell !== undefined && cell !== '' && isNaN(Number(cell)));
      if (hasText) {
        headerRowIndex = i;
        break;
      }
    }
    parsed = XLSX.utils.sheet_to_json<DataRow>(sheet, { range: headerRowIndex });
  }

  if (parsed.length === 0) {
    return { rows: [], columns: [] };
  }

  // Sanitize columns list to maintain consistency
  const rawCols = Object.keys(parsed[0]);
  const columns = rawCols.filter((col) => col && !col.startsWith('__EMPTY'));

  // Fill in any undefined keys with empty string
  const rows = parsed.map((r) => {
    const obj: DataRow = {};
    columns.forEach((c) => {
      obj[c] = r[c] !== undefined ? r[c] : '';
    });
    return obj;
  });

  return { rows, columns };
}

export function exportJsonToExcel(data: DataRow[], sheetName: string, fileName: string) {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Data');
  XLSX.writeFile(workbook, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
}

export function exportTableElementToExcel(tableElement: HTMLTableElement, sheetName: string, fileName: string) {
  if (!tableElement) return;
  const workbook = XLSX.utils.table_to_book(tableElement, { sheet: sheetName || 'Data' });
  XLSX.writeFile(workbook, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
}
