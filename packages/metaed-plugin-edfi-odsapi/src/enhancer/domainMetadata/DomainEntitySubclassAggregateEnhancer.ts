import { getAllEntitiesOfType, asTopLevelEntity } from 'metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity } from 'metaed-core';
import { Table, TopLevelEntityEdfiOds, tableEntity } from 'metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName = 'DomainEntitySubclassAggregateEnhancer';

export function enhanceEntityTable(
  metaEd: MetaEdEnvironment,
  entity: TopLevelEntity,
  table: Table,
  entityTable: EntityTable,
): void {
  if ((entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTableId === table.tableId && entity.baseEntity != null) {
    const isaTable: Table | undefined = tableEntity(
      metaEd,
      entity.baseEntity.namespace,
      entity.baseEntity.data.edfiOdsRelational.odsTableId,
    );

    entityTable.isA = isaTable ? isaTable.data.edfiOdsSqlServer.tableName : '';
    entityTable.hasIsA = true;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, asTopLevelEntity(modelBase), metaEd.namespace, enhanceEntityTable);
  });

  return {
    enhancerName,
    success: true,
  };
}
