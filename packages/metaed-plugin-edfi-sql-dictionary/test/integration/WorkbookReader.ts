import xlsx from 'xlsx';
import { newRow } from '../../src/model/Row';
import { Workbook, newWorkbook } from '../../src/model/Workbook';
import { Worksheet, newWorksheet } from '../../src/model/Worksheet';

export function readWorkbook(input: any, type: string): Workbook {
  const wb: any = xlsx.read(input, { type: type as any });
  const workbook: Workbook = newWorkbook();
  Object.values(wb.Sheets).forEach((sheet, i) => {
    const worksheet: Worksheet = newWorksheet(wb.SheetNames[i]);
    const parsedWorksheet: any = xlsx.utils.sheet_to_json(sheet as any, { header: 1 });
    const headers: string[] = parsedWorksheet.shift();
    parsedWorksheet.forEach((row) => {
      worksheet.rows.push({ ...newRow(), headers, values: row });
    });
    workbook.sheets.push(worksheet);
  });
  return workbook;
}
