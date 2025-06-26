// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity, Namespace } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds, DescriptorEdfiOds, tableEntity } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DescriptorEdfiOdsApi } from '../../model/Descriptor';
import { TopLevelEntityEdfiOdsApi } from '../../model/TopLevelEntity';
import { EntityTable } from '../../model/domainMetadata/EntityTable';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { NoAggregate } from '../../model/domainMetadata/Aggregate';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { defaultOrderedAndUniqueTablesFor } from './AggregateEnhancerBase';

const enhancerName = 'DescriptorAggregateEnhancer';

function generateAggregate(metaEd: MetaEdEnvironment, entity: TopLevelEntity, namespace: Namespace): Aggregate | null {
  const tables: Table[] = defaultOrderedAndUniqueTablesFor(entity, namespace);
  if (tables.length === 0) return null;
  const rootTable: Table | undefined = tableEntity(metaEd, namespace, entity.data.edfiOdsRelational.odsTableId);
  const aggregate: Aggregate = {
    root: rootTable ? rootTable.data.edfiOdsSqlServer.tableName : '',
    schema: entity.namespace.namespaceName.toLowerCase(),
    allowPrimaryKeyUpdates: entity.allowPrimaryKeyUpdates,
    isExtension: false,
    entityTables: [],
  };

  let typeAggregate: Aggregate = NoAggregate;
  if (entity.type === 'descriptor' && (entity.data.edfiOdsRelational as DescriptorEdfiOds).odsIsMapType) {
    typeAggregate = {
      root: normalizeEnumerationSuffix(entity.metaEdName),
      schema: entity.namespace.namespaceName.toLowerCase(),
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [],
    };
    (entity.data.edfiOdsApi as DescriptorEdfiOdsApi).typeAggregate = typeAggregate;
    (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.push(typeAggregate);
  }

  tables.forEach((table: Table) => {
    const entityTable: EntityTable = {
      table: table.data.edfiOdsSqlServer.tableName,
      isA: table.tableId === (entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTableId ? 'Descriptor' : null,
      isAbstract: false,
      isRequiredCollection: false,
      schema: table.schema,
      hasIsA: table.tableId === (entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTableId,
      requiresSchema: entity.namespace.isExtension,
    };

    // TODO: Table ID math is going on here, though it's Ed-Fi 2.x only (descriptors with map types)
    if (typeAggregate !== NoAggregate && table.tableId === normalizeEnumerationSuffix(entity.metaEdName)) {
      typeAggregate.entityTables.push(entityTable);
      return;
    }

    aggregate.entityTables.push(entityTable);
  });

  return aggregate;
}

function enhanceSingleEntity(metaEd: MetaEdEnvironment, entity: TopLevelEntity) {
  const aggregate = generateAggregate(metaEd, entity, entity.namespace);
  if (aggregate == null) return;
  (entity.data.edfiOdsApi as TopLevelEntityEdfiOdsApi).aggregate = aggregate;
  (entity.namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.push(aggregate);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, modelBase as TopLevelEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
