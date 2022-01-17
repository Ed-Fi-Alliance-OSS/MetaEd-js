import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table, constructCollapsedNameFrom } from '@edfi/metaed-plugin-edfi-ods-relational';

const enhancerName = 'SqlServerTableNamingEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      table.data.edfiOdsSqlServer.tableName = constructCollapsedNameFrom(table.nameGroup);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
