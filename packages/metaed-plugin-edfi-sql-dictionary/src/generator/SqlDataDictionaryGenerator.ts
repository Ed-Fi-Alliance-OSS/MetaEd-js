import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace, orderByPath } from '@edfi/metaed-core';
import { tableEntities, Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';

import { Workbook } from '../model/Workbook';
import { newWorkbook, exportWorkbook } from '../model/Workbook';
import { Row } from '../model/Row';
import { newRow, createRow, setRow } from '../model/Row';
import { Worksheet } from '../model/Worksheet';
import { newWorksheet } from '../model/Worksheet';

function byEntityNameAscending(a: Record<string, any>, b: Record<string, any>) {
  if (a['Entity Name'] < b['Entity Name']) return -1;
  if (a['Entity Name'] > b['Entity Name']) return 1;
  return 0;
}

function byTableAndColumnNameAscending(a: Record<string, any>, b: Record<string, any>) {
  if (a['Table Name'] < b['Table Name']) return -1;
  if (a['Table Name'] > b['Table Name']) return 1;

  if (a['Column Name'] < b['Column Name']) return -1;
  if (a['Column Name'] > b['Column Name']) return 1;
  return 0;
}

function isForeignKey(table: Table, column: Column) {
  return table.foreignKeys.some((fk) => fk.columnPairs.some((cnp) => cnp.parentTableColumnId === column.columnId));
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const allTables: Table[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    allTables.push(...tableEntities(metaEd, namespace).values());
  });

  const orderedTables: Table[] = orderByPath(['data', 'edfiOdsSqlServer', 'tableName'])(allTables);

  const workbook: Workbook = newWorkbook();
  const tablesSheet: Worksheet = newWorksheet('Tables');
  const columnsSheet: Worksheet = newWorksheet('Columns');
  workbook.sheets.push(tablesSheet);
  workbook.sheets.push(columnsSheet);

  orderedTables.forEach((table: Table) => {
    const tableRow: Row = newRow();
    setRow(tableRow, 'Entity Name', table.data.edfiOdsSqlServer.tableName);
    setRow(tableRow, 'Entity Schema', table.schema);
    setRow(tableRow, 'Entity Definition', table.description);

    tablesSheet.rows.push(createRow(tableRow));
    tablesSheet.rows.sort(byEntityNameAscending);
    tablesSheet['!cols'] = [{ wpx: 300 }, { wpx: 100 }, { wpx: 500 }];

    table.columns.forEach((column: Column) => {
      const columnRow: Row = newRow();
      setRow(columnRow, 'Entity/Table Owner', table.schema);
      setRow(columnRow, 'Table Name', table.data.edfiOdsSqlServer.tableName);
      setRow(columnRow, 'Column Name', column.data.edfiOdsSqlServer.columnName);
      setRow(columnRow, 'Attribute/Column Definition', column.description);
      setRow(columnRow, 'Column Data Type', column.data.edfiOdsSqlServer.dataType);
      setRow(columnRow, 'Column Null Option', column.isNullable ? 'NULL' : 'NOT NULL');
      setRow(columnRow, 'Identity', column.isIdentityDatabaseType ? 'Yes' : 'No');
      setRow(columnRow, 'Primary Key', column.isPartOfPrimaryKey ? 'Yes' : 'No');
      setRow(columnRow, 'Foreign Key', isForeignKey(table, column) ? 'Yes' : 'No');
      columnsSheet.rows.push(createRow(columnRow));
      columnsSheet.rows.sort(byTableAndColumnNameAscending);
      columnsSheet['!cols'] = [
        { wpx: 100 },
        { wpx: 200 },
        { wpx: 200 },
        { wpx: 500 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 100 },
      ];
    });
  });

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'SqlDataDictionary',
      namespace: 'Documentation',
      folderName: 'DataDictionary',
      fileName: 'SqlDataDictionary.xlsx',
      resultString: '',
      resultStream: exportWorkbook(workbook, 'buffer'),
    },
  ];

  return {
    generatorName: 'edfiSqlDataDictionary.SqlDataDictionaryGenerator',
    generatedOutput,
  };
}
