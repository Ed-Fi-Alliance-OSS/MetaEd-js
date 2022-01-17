import R from 'ramda';
import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column } from '../model/database/Column';
import { ColumnPair } from '../model/database/ColumnPair';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

// METAED-630
// Orders foreign key columns to match EdFi DS 2.x
// Depends on PrimaryKeyOrderDiminisher
const enhancerName = 'ForeignKeyOrderDiminisher';
const targetVersions = '2.x';

const schemaName = 'edfi';

function modifyForeignKeyColumnOrder(tablesForCoreNamespace: Map<string, Table>): void {
  const foreignKeys: ForeignKey[] = R.chain((table: Table) =>
    table.foreignKeys.filter((fk: ForeignKey) => fk.columnPairs.length > 1 && fk.foreignTableSchema === schemaName),
  )([...tablesForCoreNamespace.values()]);
  if (foreignKeys.length === 0) return;

  foreignKeys.forEach((foreignKey: ForeignKey) => {
    const foreignTable: Table | undefined = tablesForCoreNamespace.get(foreignKey.foreignTableId);
    if (foreignTable == null) return;

    const primaryKeyOrder: string[] = foreignTable.primaryKeys.map((pk: Column) => pk.columnId);
    const foreignKeyColumnPairLookup: { [foreignKeyName: string]: ColumnPair } = R.groupBy(
      R.prop('foreignTableColumnId'),
      foreignKey.columnPairs,
    );
    // eslint-disable-next-line no-underscore-dangle
    const foreignKeyColumnPairFor: (foreignKeyName: string) => ColumnPair = R.prop(R.__, foreignKeyColumnPairLookup);

    const newForeignKeyOrder: ColumnPair[] = R.chain((pkName: string) => foreignKeyColumnPairFor(pkName))(primaryKeyOrder);

    foreignKey.columnPairs = newForeignKeyOrder;
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  modifyForeignKeyColumnOrder(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
