import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from './EnhancerHelper';
import { Table } from '../model/database/Table';
import { Column } from '../model/database/Column';

const enhancerName = 'ColumnDeprecationEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      table.columns.forEach((column: Column) => {
        column.sourceEntityProperties.forEach((property) => {
          if (property.isDeprecated) {
            column.isDeprecated = true;
            column.deprecationReasons.push(property.deprecationReason);
          }
        });
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
