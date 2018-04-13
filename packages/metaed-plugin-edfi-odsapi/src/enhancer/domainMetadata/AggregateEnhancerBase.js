// @flow
import R from 'ramda';
import type { NamespaceInfo, TopLevelEntity } from 'metaed-core';
import type { Table, TopLevelEntityEdfiOds } from 'metaed-plugin-edfi-ods';
import type { TopLevelEntityEdfiOdsApi } from '../../model/TopLevelEntity';
import type { NamespaceInfoEdfiOdsApi } from '../../model/NamespaceInfo';
import type { Aggregate } from '../../model/domainMetadata/Aggregate';
import type { EntityTable } from '../../model/domainMetadata/EntityTable';

export type EnhanceEntityTable = (entity: TopLevelEntity, table: Table, entityTable: EntityTable) => void;
export type IsAggregateExtension = () => boolean;
export type OrderedAndUniqueTablesFor = (entity: TopLevelEntity, namespaceInfo: NamespaceInfo) => Array<Table>;

export type EnhanceSingleEntityOptions = {
  enhanceEntityTable: EnhanceEntityTable,
  isAggregateExtension: IsAggregateExtension,
  orderedAndUniqueTablesFor: OrderedAndUniqueTablesFor,
};

// eslint-disable-next-line no-unused-vars
export function nullEnhanceEntityTable(entity: TopLevelEntity, table: Table, entityTable: EntityTable): void {}

export function defaultOrderedAndUniqueTablesFor(entity: TopLevelEntity, namespaceInfo: NamespaceInfo): Array<Table> {
  const tablesForNamespace = ((entity.data.edfiOds: any): TopLevelEntityEdfiOds).ods_Tables.filter(
    (t: Table) => t.schema === namespaceInfo.namespace,
  );
  // TODO: why is unique necessary?
  const uniquedTables = R.uniqBy(R.prop('name'), tablesForNamespace);
  return R.sortBy(R.prop('name'), uniquedTables);
}

function generateAggregate(
  entity: TopLevelEntity,
  namespaceInfo: NamespaceInfo,
  { enhanceEntityTable, isAggregateExtension, orderedAndUniqueTablesFor }: EnhanceSingleEntityOptions,
): ?Aggregate {
  const tables: Array<Table> = orderedAndUniqueTablesFor(entity, namespaceInfo);
  if (tables.length === 0) return null;
  const aggregate: Aggregate = {
    root: ((entity.data.edfiOds: any): TopLevelEntityEdfiOds).ods_TableName,
    schema: entity.namespaceInfo.namespace,
    allowPrimaryKeyUpdates: entity.allowPrimaryKeyUpdates,
    isExtension: isAggregateExtension(),
    entityTables: [],
  };

  tables.forEach((table: Table) => {
    const entityTable: EntityTable = {
      table: table.name,
      isA: null,
      isAbstract: false,
      isRequiredCollection: table.isRequiredCollectionTable,
      schema: table.schema,
      hasIsA: false,
      requiresSchema: namespaceInfo.isExtension,
    };
    enhanceEntityTable(entity, table, entityTable);
    aggregate.entityTables.push(entityTable);
  });
  return aggregate;
}

export function enhanceSingleEntity(
  entity: TopLevelEntity,
  namespaceInfoMap: Map<string, NamespaceInfo>,
  {
    enhanceEntityTable = nullEnhanceEntityTable,
    isAggregateExtension = () => false,
    orderedAndUniqueTablesFor = defaultOrderedAndUniqueTablesFor,
  }: EnhanceSingleEntityOptions = {},
) {
  const entityNamespaceInfo = R.head(
    Array.from(namespaceInfoMap.values()).filter(n => n.namespace === entity.namespaceInfo.namespace),
  );
  const aggregate = generateAggregate(entity, entityNamespaceInfo, {
    enhanceEntityTable,
    isAggregateExtension,
    orderedAndUniqueTablesFor,
  });
  if (aggregate == null) return;
  ((entity.data.edfiOdsApi: any): TopLevelEntityEdfiOdsApi).aggregate = aggregate;
  ((entityNamespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates.push(aggregate);
}
