// @flow
import R from 'ramda';
import { getEntitiesOfType, asTopLevelEntity, normalizeEnumerationSuffix } from 'metaed-core';
import type { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity, NamespaceInfo } from 'metaed-core';
import type { Table, TopLevelEntityEdfiOds, DescriptorEdfiOds } from 'metaed-plugin-edfi-ods';
import type { DescriptorEdfiOdsApi } from '../../model/Descriptor';
import type { TopLevelEntityEdfiOdsApi } from '../../model/TopLevelEntity';
import type { EntityTable } from '../../model/domainMetadata/EntityTable';
import type { Aggregate } from '../../model/domainMetadata/Aggregate';
import { NoAggregate } from '../../model/domainMetadata/Aggregate';
import type { NamespaceInfoEdfiOdsApi } from '../../model/NamespaceInfo';
import { defaultOrderedAndUniqueTablesFor } from './AggregateEnhancerBase';

const enhancerName: string = 'DescriptorAggregateEnhancer';

function generateAggregate(entity: TopLevelEntity, namespaceInfo: NamespaceInfo): ?Aggregate {
  const tables: Array<Table> = defaultOrderedAndUniqueTablesFor(entity, namespaceInfo);
  if (tables.length === 0) return null;
  const aggregate: Aggregate = {
    root: ((entity.data.edfiOds: any): TopLevelEntityEdfiOds).ods_TableName,
    schema: entity.namespaceInfo.namespace,
    allowPrimaryKeyUpdates: entity.allowPrimaryKeyUpdates,
    isExtension: false,
    entityTables: [],
  };

  let typeAggregate: Aggregate = NoAggregate;
  if (entity.type === 'descriptor' && ((entity.data.edfiOds: any): DescriptorEdfiOds).ods_IsMapType) {
    typeAggregate = {
      root: normalizeEnumerationSuffix(entity.metaEdName),
      schema: entity.namespaceInfo.namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [],
    };
    ((entity.data.edfiOdsApi: any): DescriptorEdfiOdsApi).typeAggregate = typeAggregate;
    ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates.push(typeAggregate);
  }

  tables.forEach((table: Table) => {
    const entityTable: EntityTable = {
      table: table.name,
      isA: table.name === ((entity.data.edfiOds: any): TopLevelEntityEdfiOds).ods_TableName ? 'Descriptor' : null,
      isAbstract: false,
      isRequiredCollection: false,
      schema: table.schema,
      hasIsA: table.name === ((entity.data.edfiOds: any): TopLevelEntityEdfiOds).ods_TableName,
      requiresSchema: entity.namespaceInfo.isExtension,
    };

    if (typeAggregate !== NoAggregate && table.name === normalizeEnumerationSuffix(entity.metaEdName)) {
      typeAggregate.entityTables.push(entityTable);
      return;
    }

    aggregate.entityTables.push(entityTable);
  });

  return aggregate;
}

function enhanceSingleEntity(entity: TopLevelEntity, namespaceInfos: Array<NamespaceInfo>) {
  const entityNamespaceInfo = R.head(namespaceInfos.filter(n => n.namespace === entity.namespaceInfo.namespace));
  const aggregate = generateAggregate(entity, entityNamespaceInfo);
  if (aggregate == null) return;
  ((entity.data.edfiOdsApi: any): TopLevelEntityEdfiOdsApi).aggregate = aggregate;
  ((entityNamespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates.push(aggregate);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'descriptor').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(asTopLevelEntity(modelBase), Array.from(metaEd.entity.namespaceInfo.values()));
  });

  return {
    enhancerName,
    success: true,
  };
}
