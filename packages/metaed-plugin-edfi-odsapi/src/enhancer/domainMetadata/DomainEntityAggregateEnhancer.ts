// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, asTopLevelEntity, asDomainEntity } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity, DomainEntity } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName = 'DomainEntityAggregateEnhancer';

export function enhanceEntityTable(
  _metaEd: MetaEdEnvironment,
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
