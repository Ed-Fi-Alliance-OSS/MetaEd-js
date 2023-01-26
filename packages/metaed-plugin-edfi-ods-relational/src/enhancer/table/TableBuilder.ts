import { EntityProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableStrategy } from '../../model/database/TableStrategy';

export interface TableBuilder {
  buildTables(
    property: EntityProperty,
    tableStrategy: TableStrategy,
    primaryKeys: Column[],
    buildStrategy: BuildStrategy,
    tables: Table[],
    parentIsRequired: boolean | null,
  ): void;
}

export function nullTableBuilder() {
  return {
    buildTables: () => {},
  };
}
