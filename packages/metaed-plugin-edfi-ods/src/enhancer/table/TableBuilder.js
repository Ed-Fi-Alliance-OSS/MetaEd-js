// @flow
import type { EntityProperty } from 'metaed-core';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { Table } from '../../model/database/Table';
import type { TableStrategy } from '../../model/database/TableStrategy';

export type TableBuilder = {
  buildTables(
    property: EntityProperty,
    tableStrategy: TableStrategy,
    primaryKeys: Array<Column>,
    buildStrategy: BuildStrategy,
    tables: Array<Table>,
    parentIsRequired: ?boolean,
  ): void;
}
