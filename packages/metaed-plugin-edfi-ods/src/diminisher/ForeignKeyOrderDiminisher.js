// @flow
import R from 'ramda';
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getForeignKeys } from '../model/database/Table';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { ColumnNamePair } from '../model/database/ColumnNamePair';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// METAED-630
// Orders foreign key columns to match EdFi DS 2.0
// Depends on PrimaryKeyOrderDiminisher
const enhancerName: string = 'ForeignKeyOrderDiminisher';
const targetVersions: string = '2.0.x';

const namespace: string = 'edfi';

function modifyForeignKeyColumnOrder(repository: EdFiOdsEntityRepository): void {
  const foreignKeys: Array<ForeignKey> = R.chain((table: Table) => getForeignKeys(table).filter(
    (fk: ForeignKey) => fk.columnNames.length > 1 && fk.foreignTableSchema === namespace),
  )([...repository.table.values()]);
  if (foreignKeys.length === 0) return;

  foreignKeys.forEach((fk: ForeignKey) => {
    const foreignTable: ?Table = getTable(repository, fk.foreignTableName);
    if (foreignTable == null) return;

    const primaryKeyOrder: Array<string> = foreignTable.primaryKeys.map((pk: Column) => pk.name);
    const foreignKeyColumnPairLookup: { [foreignKeyName: string]: ColumnNamePair } = R.groupBy(
      R.prop('foreignTableColumnName'),
      fk.columnNames,
    );
    const foreignKeyColumnPairFor: (foreignKeyName: string) => ColumnNamePair = R.prop(R.__, foreignKeyColumnPairLookup);

    const foreignKeyOrder: Array<ColumnNamePair> = R.chain(
      (pkName: string) => foreignKeyColumnPairFor(pkName),
    )(primaryKeyOrder);

    fk.parentTableColumnNames = foreignKeyOrder.map((x: ColumnNamePair) => x.parentTableColumnName);
    fk.foreignTableColumnNames = foreignKeyOrder.map((x: ColumnNamePair) => x.foreignTableColumnName);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  modifyForeignKeyColumnOrder(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
