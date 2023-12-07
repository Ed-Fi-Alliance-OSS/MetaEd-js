/* eslint-disable max-classes-per-file */
import { Namespace } from '@edfi/metaed-core';
import { TableNameGroup, Table } from './Table';

export class TableStrategy {
  table: Table;

  schema: string;

  schemaNamespace: Namespace;

  tableId: string;

  nameGroup: TableNameGroup;

  constructor(table: Table) {
    this.table = table;
    this.schema = table.schema;
    this.schemaNamespace = table.namespace;
    this.tableId = table.tableId;
    this.nameGroup = table.nameGroup;
  }

  static default(table: Table) {
    return new TableStrategy(table);
  }

  static extension(
    table: Table,
    baseSchemaName: string,
    baseSchemaNamespace: Namespace,
    baseTableId: string,
    baseTableNameGroup: TableNameGroup,
  ) {
    // eslint-disable-next-line no-use-before-define
    return new ExtensionTableStrategy(table, baseSchemaName, baseSchemaNamespace, baseTableId, baseTableNameGroup);
  }
}

class ExtensionTableStrategy extends TableStrategy {
  constructor(
    table: Table,
    baseSchemaName: string,
    baseSchemaNamespace: Namespace,
    baseTableId: string,
    baseTableNameGroup: TableNameGroup,
  ) {
    super(table);
    this.schema = baseSchemaName;
    this.schemaNamespace = baseSchemaNamespace;
    this.tableId = baseTableId;
    this.nameGroup = baseTableNameGroup;
  }
}
