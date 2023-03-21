import { getAllEntitiesOfType, asAssociation } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, Association } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName = 'AssociationAggregateEnhancer';

export function enhanceEntityTable(
  _metaEd: MetaEdEnvironment,
  association: Association,
  table: Table,
  entityTable: EntityTable,
): void {
  if ((association.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTableId === table.tableId && association.isAbstract) {
    entityTable.isAbstract = true;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'association').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, asAssociation(modelBase), metaEd.namespace, enhanceEntityTable);
  });

  return {
    enhancerName,
    success: true,
  };
}
