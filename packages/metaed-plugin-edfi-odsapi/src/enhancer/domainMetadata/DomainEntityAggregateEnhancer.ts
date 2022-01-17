import { getAllEntitiesOfType, asTopLevelEntity, asDomainEntity } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity, DomainEntity } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName = 'DomainEntityAggregateEnhancer';

export function enhanceEntityTable(
  // @ts-ignore - value never read
  metaEd: MetaEdEnvironment,
  entity: TopLevelEntity,
  table: Table,
  entityTable: EntityTable,
): void {
  const domainEntity: DomainEntity = asDomainEntity(entity);
  if (
    (domainEntity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTableId === table.tableId &&
    domainEntity.isAbstract
  ) {
    entityTable.isAbstract = true;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, asTopLevelEntity(modelBase), metaEd.namespace, enhanceEntityTable);
  });

  return {
    enhancerName,
    success: true,
  };
}
