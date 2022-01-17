import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table } from '@edfi/metaed-plugin-edfi-ods-relational';

export interface TableEdfiOdsRecordOwnership {
  /** For ODS/API 3.3+ record level ownership support */
  hasOwnershipTokenColumn: boolean;
}

const enhancerName = 'RecordOwnershipTableSetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.data.edfiOdsRecordOwnership == null) {
        (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership) = { hasOwnershipTokenColumn: false };
      } else {
        (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn = false;
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
