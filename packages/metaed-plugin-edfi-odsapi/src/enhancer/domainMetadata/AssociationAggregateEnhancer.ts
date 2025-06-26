// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType } from '@edfi/metaed-core';
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
    enhanceSingleEntity(metaEd, modelBase as Association, metaEd.namespace, enhanceEntityTable);
  });

  return {
    enhancerName,
    success: true,
  };
}
