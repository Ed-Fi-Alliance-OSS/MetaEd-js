export interface ColumnsRow {
  tableSchema: string;
  tableName: string;
  columnName: string;
  columnDescription: string;
  columnDataType: string;
  columnNullOption: string;
  identity: string;
  primaryKey: string;
  foreignKey: string;
}

export const columnsSchema = [
  {
    column: 'Entity/Table Owner',
    type: String,
    width: 20,
    value: (row: ColumnsRow) => row.tableSchema,
  },
  {
    column: 'Table Name',
    type: String,
    width: 40,
    value: (row: ColumnsRow) => row.tableName,
  },
  {
    column: 'Column Name',
    type: String,
    width: 40,
    value: (row: ColumnsRow) => row.columnName,
  },
  {
    column: 'Attribute/Column Definition',
    type: String,
    width: 100,
    value: (row: ColumnsRow) => row.columnDescription,
  },
  {
    column: 'Column Data Type',
    type: String,
    width: 20,
    value: (row: ColumnsRow) => row.columnDataType,
  },
  {
    column: 'Column Null Option',
    type: String,
    width: 20,
    value: (row: ColumnsRow) => row.columnNullOption,
  },
  {
    column: 'Identity',
    type: String,
    width: 20,
    value: (row: ColumnsRow) => row.identity,
  },
  {
    column: 'Primary Key',
    type: String,
    width: 20,
    value: (row: ColumnsRow) => row.primaryKey,
  },
  {
    column: 'Foreign Key',
    type: String,
    width: 20,
    value: (row: ColumnsRow) => row.foreignKey,
  },
];

export const columnsWorksheetName = 'Columns';
