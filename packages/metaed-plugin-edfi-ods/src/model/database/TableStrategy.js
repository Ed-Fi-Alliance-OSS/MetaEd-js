// @flow
import type { Table } from './Table';

export class TableStrategy {
  table: Table;
  schema: string;
  name: string;

  constructor(table: Table): void {
    this.table = table;
    this.schema = table.schema;
    this.name = table.name;
  }

  static default(table: Table) {
    return new TableStrategy(table);
  }

  static extension(table: Table, baseSchemaName: string, baseTableName: string) {
    // eslint-disable-next-line no-use-before-define
    return new ExtensionTableStrategy(table, baseSchemaName, baseTableName);
  }
}

class ExtensionTableStrategy extends TableStrategy {
  constructor(table: Table, baseSchemaName: string, baseTableName: string) {
    super(table);
    this.schema = baseSchemaName;
    this.name = baseTableName;
  }
}

// export const TableStrategy = {
//   default: (table: Table) => (): { table: Table, schema: string, name: string } => ({ table, schema: table.schema, name: table.name }),
//   extension: (table: Table, name: string, schema: string) => (): { table: Table, schema: string, name: string } => ({ table, schema, name }),
// };
