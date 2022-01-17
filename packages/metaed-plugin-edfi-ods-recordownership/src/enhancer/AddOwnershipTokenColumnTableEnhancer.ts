import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { TableEdfiOdsRecordOwnership } from '../model/Table';
import { recordOwnershipIndicated } from './RecordOwnershipIndicator';

const enhancerName = 'AddOwnershipTokenColumnTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!recordOwnershipIndicated(metaEd)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    tableEntities(metaEd, namespace).forEach((table: Table) => {
      if (table.isAggregateRootTable) {
        (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn = true;
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
