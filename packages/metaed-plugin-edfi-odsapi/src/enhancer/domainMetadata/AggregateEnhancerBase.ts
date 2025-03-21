// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { Namespace, TopLevelEntity, MetaEdEnvironment } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds, tableEntity } from '@edfi/metaed-plugin-edfi-ods-relational';
import { TopLevelEntityEdfiOdsApi } from '../../model/TopLevelEntity';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

export type EnhanceEntityTable = (
  metaEd: MetaEdEnvironment,
  entity: TopLevelEntity,
  table: Table,
  entityTable: EntityTable,
) => void;
export type IsAggregateExtension = () => boolean;
export type OrderedAndUniqueTablesFor = (entity: TopLevelEntity, namespace: Namespace) => Table[];

export function nullEnhanceEntityTable(
  _metaEd: MetaEdEnvironment,
  _entity: TopLevelEntity,
  _table: Table,
  _entityTable: EntityTable,
): void {} // eslint-disable-line no-unused-vars

export function defaultOrderedAndUniqueTablesFor(entity: TopLevelEntity, namespace: Namespace): Table[] {
  const tablesForNamespace = (entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTables.filter(
    (t: Table) => t.schema === namespace.namespaceName.toLowerCase(),
  );
  // TODO: why is unique necessary?
  const uniquedTables = R.uniqBy(R.prop('tableId'), tablesForNamespace);
  return R.sortBy(R.path(['data', 'edfiOdsSqlServer', 'tableName']), uniquedTables);
}

function generateAggregate(
  metaEd: MetaEdEnvironment,
  entity: TopLevelEntity,
  namespace: Namespace,
  enhanceEntityTable: EnhanceEntityTable,
  isAggregateExtension: IsAggregateExtension,
  orderedAndUniqueTablesFor: OrderedAndUniqueTablesFor,
): Aggregate | null {
  const tables: Table[] = orderedAndUniqueTablesFor(entity, namespace).filter((table: Table) => !table.hideFromApiMetadata);
  if (tables.length === 0) return null;
  let rootTable: Table | undefined;
  if (isAggregateExtension()) {
    if (entity.baseEntity != null) {
      rootTable = tableEntity(metaEd, entity.baseEntity.namespace, entity.data.edfiOdsRelational.odsTableId);
    }
  } else {
    rootTable = tableEntity(metaEd, entity.namespace, entity.data.edfiOdsRelational.odsTableId);
  }

  const aggregate: Aggregate = {
    root: rootTable == null ? '' : rootTable.data.edfiOdsSqlServer.tableName,
    schema: entity.namespace.namespaceName.toLowerCase(),
    allowPrimaryKeyUpdates: entity.allowPrimaryKeyUpdates,
    isExtension: isAggregateExtension(),
    entityTables: [],
  };

  tables.forEach((table: Table) => {
    const entityTable: EntityTable = {
      table: table.data.edfiOdsSqlServer.tableName,
      isA: null,
      isAbstract: false,
      isRequiredCollection: table.isRequiredCollectionTable,
      schema: table.schema,
      hasIsA: false,
      requiresSchema: namespace.isExtension,
    };
    enhanceEntityTable(metaEd, entity, table, entityTable);
    aggregate.entityTables.push(entityTable);
  });
  return aggregate;
}

export function enhanceSingleEntity(
  metaEd: MetaEdEnvironment,
  entity: TopLevelEntity,
  namespaceMap: Map<string, Namespace>,
  enhanceEntityTable: EnhanceEntityTable = nullEnhanceEntityTable,
  isAggregateExtension: IsAggregateExtension = () => false,
  orderedAndUniqueTablesFor: OrderedAndUniqueTablesFor = defaultOrderedAndUniqueTablesFor,
) {
  const entityNamespace = R.head(
    Array.from(namespaceMap.values()).filter((n) => n.namespaceName === entity.namespace.namespaceName),
  );
  const aggregate = generateAggregate(
    metaEd,
    entity,
    entityNamespace,
    enhanceEntityTable,
    isAggregateExtension,
    orderedAndUniqueTablesFor,
  );
  if (aggregate == null) return;
  (entity.data.edfiOdsApi as TopLevelEntityEdfiOdsApi).aggregate = aggregate;
  (entityNamespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.push(aggregate);
}
