// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { asTopLevelEntity, getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';
import { MetaEdEnvironment, EnhancerResult, EntityProperty, TopLevelEntity } from '@edfi/metaed-core';
import { NoTable } from './database/Table';
import { Table } from './database/Table';

export interface TopLevelEntityEdfiOds {
  odsTableId: string;
  odsCascadePrimaryKeyUpdates: boolean;
  odsProperties: EntityProperty[];
  odsIdentityProperties: EntityProperty[];
  odsEntityTable: Table;
  odsTables: Table[];
  usiProperty?: EntityProperty;
}

const enhancerName = 'OdsTopLevelEntitySetupEnhancer';

export function addTopLevelEntityEdfiOdsTo(topLevelEntity: TopLevelEntity) {
  if (topLevelEntity.data.edfiOdsRelational == null) topLevelEntity.data.edfiOdsRelational = {};

  Object.assign(topLevelEntity.data.edfiOdsRelational, {
    odsTableId: '',
    odsCascadePrimaryKeyUpdates: false,
    odsProperties: [...topLevelEntity.properties],
    odsIdentityProperties: [...topLevelEntity.identityProperties],
    odsEntityTable: NoTable,
    odsTables: [],
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity) => {
    addTopLevelEntityEdfiOdsTo(asTopLevelEntity(entity));
  });

  return {
    enhancerName,
    success: true,
  };
}
