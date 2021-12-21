import { EnhancerResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import { NoTable } from '../model/database/Table';
import { tableEntities } from './EnhancerHelper';
import { Table } from '../model/database/Table';

const enhancerName = 'ForeignKeyForeignTableReferenceEnhancer';

// set reference to Foreign table - now that all tables are created
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);
    tables.forEach((table: Table) => {
      table.foreignKeys.forEach((foreignKey) => {
        const foreignTable: Table | undefined = tableEntities(metaEd, foreignKey.foreignTableNamespace).get(
          foreignKey.foreignTableId,
        );
        foreignKey.foreignTable = foreignTable || NoTable;
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
