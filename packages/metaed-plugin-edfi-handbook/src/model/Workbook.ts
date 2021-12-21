import xlsx, { WorkSheet } from 'xlsx';
import { Worksheet } from './Worksheet';
import { newWorksheet } from './Worksheet';
import { newRow } from './Row';

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

export function readWorkbook(input: any, type: string): Workbook {
  const wb: any = xlsx.read(input, { type: type as any });
  const workbook: Workbook = newWorkbook();
  Object.values(wb.Sheets).forEach((sheet, i) => {
    const worksheet: Worksheet = newWorksheet(wb.SheetNames[i]);
    const parsedWorksheet: any = xlsx.utils.sheet_to_json(sheet as WorkSheet, { header: 1 });
    const headers: string[] = parsedWorksheet.shift();
    parsedWorksheet.forEach((row) => {
      worksheet.rows.push({
        ...newRow(),
        headers,
        values: row,
      });
    });
    workbook.sheets.push(worksheet);
  });
  return workbook;
}
