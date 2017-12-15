// @flow
import R from 'ramda';
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getForeignKeys, getPrimaryKeys } from '../model/database/Table';
import { getParentTableColumnNames } from '../model/database/ForeignKey';
import { pluginEnvironment } from './EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// Calculate if a reverse foreign key index is required for each Foreign Key
const enhancerName: string = 'ForeignKeyReverseIndexEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  pluginEnvironment(metaEd).entity.table.forEach((table: Table) => {
    const primaryKeyColumnNames: Array<string> = getPrimaryKeys(table).map((pk: Column) => pk.name);

    R.compose(
      R.forEach((fk: ForeignKey) => { fk.withReverseForeignKeyIndex = true; }),
      R.reject((fk: ForeignKey) => R.equals(getParentTableColumnNames(fk), primaryKeyColumnNames)),
    )(getForeignKeys(table));
  });

  return {
    enhancerName,
    success: true,
  };
}
