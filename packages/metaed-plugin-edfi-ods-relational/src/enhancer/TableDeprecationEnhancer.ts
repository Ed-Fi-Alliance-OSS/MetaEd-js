import { EnhancerResult, MetaEdEnvironment, Namespace, NoTopLevelEntity } from '@edfi/metaed-core';
import { tableEntities } from './EnhancerHelper';
import { Table } from '../model/database/Table';

const enhancerName = 'TableDeprecationEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.parentEntity === NoTopLevelEntity) return;
      if (!table.parentEntity.isDeprecated) return;
      table.isDeprecated = true;
      table.deprecationReasons.push(table.parentEntity.deprecationReason);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
