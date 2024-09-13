import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace, orderByPath } from '@edfi/metaed-core';
import { tableEntities, Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import writeXlsxFile from 'write-excel-file';
import { TablesRow, tablesSchema, tablesWorksheetName } from '../model/Tables';
import { ColumnsRow, columnsSchema, columnsWorksheetName } from '../model/Columns';

function byEntityNameAscending(a, b) {
  if (a.entityName < b.entityName) return -1;
  if (a.entityName > b.entityName) return 1;
  return 0;
}

function byTableAndColumnNameAscending(a, b) {
  if (a.tableName < b.tableName) return -1;
  if (a.tableName > b.tableName) return 1;

  if (a.columnName < b.columnName) return -1;
  if (a.columnName > b.columnName) return 1;
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

  const tablesRows: TablesRow[] = [];
  const columnsRow: ColumnsRow[] = [];

  orderedTables.forEach((table: Table) => {
    tablesRows.push({
      entityName: table.data.edfiOdsSqlServer.tableName,
      entitySchema: table.schema,
      entityDefinition: table.description,
    });
    tablesRows.sort(byEntityNameAscending);

    table.columns.forEach((column: Column) => {
      columnsRow.push({
        tableSchema: table.schema,
        tableName: table.data.edfiOdsSqlServer.tableName,
        columnName: column.data.edfiOdsSqlServer.columnName,
        columnDescription: column.description,
        columnDataType: column.data.edfiOdsSqlServer.dataType,
        columnNullOption: column.isNullable ? 'NULL' : 'NOT NULL',
        identity: column.isIdentityDatabaseType ? 'Yes' : 'No',
        primaryKey: column.isPartOfPrimaryKey ? 'Yes' : 'No',
        foreignKey: isForeignKey(table, column) ? 'Yes' : 'No',
      });
      columnsRow.sort(byTableAndColumnNameAscending);
    });
  });

  // @ts-ignore - TypeScript typings here don't recognize Blob return type
  const fileAsBlob: Blob = await writeXlsxFile([tablesRows, columnsRow], {
    buffer: true,
    schema: [tablesSchema, columnsSchema],
    sheets: [tablesWorksheetName, columnsWorksheetName],
  });
  const fileAsArrayBuffer = await fileAsBlob.arrayBuffer();

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'SqlDataDictionary',
      namespace: 'Documentation',
      folderName: 'DataDictionary',
      fileName: 'SqlDataDictionary.xlsx',
      resultString: '',
      resultStream: Buffer.from(fileAsArrayBuffer),
    },
  ];

  return {
    generatorName: 'edfiSqlDataDictionary.SqlDataDictionaryGenerator',
    generatedOutput,
  };
}
