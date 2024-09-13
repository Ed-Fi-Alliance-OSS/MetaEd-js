import xlsx from 'xlsx';
import { Worksheet } from './Worksheet';

export interface Workbook {
  sheets: Worksheet[];
}

export function newWorkbook(): Workbook {
  return {
    sheets: [],
  };
}

export function exportWorkbook(workbook: Workbook, type: string): any {
  const wb: {
    SheetNames: string[];
    Sheets: {};
  } = {
    SheetNames: [],
    Sheets: {},
  };
  workbook.sheets.forEach((sheet) => {
    wb.SheetNames.push(sheet.name);
    wb.Sheets[sheet.name] = xlsx.utils.json_to_sheet(sheet.rows);
    wb.Sheets[sheet.name]['!cols'] = sheet['!cols'];
  });

  if (wb.SheetNames.length > 0) return xlsx.write(wb, { type: type as any });
  if (type === 'base64') {
    return '';
  }
  if (type === 'buffer') {
    return Buffer.alloc(0);
  }
  return '';
}
