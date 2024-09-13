export interface TablesRow {
  entityName: string;
  entitySchema: string;
  entityDefinition: string;
}

export const tablesSchema = [
  {
    column: 'Entity Name',
    type: String,
    width: 60,
    value: (row: TablesRow) => row.entityName,
  },
  {
    column: 'Entity Schema',
    type: String,
    width: 20,
    value: (row: TablesRow) => row.entitySchema,
  },
  {
    column: 'Entity Definition',
    type: String,
    width: 100,
    value: (row: TablesRow) => row.entityDefinition,
  },
];

export const tablesWorksheetName = 'Tables';
