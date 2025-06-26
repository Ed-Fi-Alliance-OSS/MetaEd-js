// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds, tableEntity } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName = 'AssociationSubclassAggregateEnhancer';

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
  getAllEntitiesOfType(metaEd, 'associationSubclass').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, modelBase as TopLevelEntity, metaEd.namespace, enhanceEntityTable);
  });

  return {
    enhancerName,
    success: true,
  };
}
