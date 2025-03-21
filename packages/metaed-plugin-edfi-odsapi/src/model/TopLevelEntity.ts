// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';
import { NoAggregate } from './domainMetadata/Aggregate';
import { Aggregate } from './domainMetadata/Aggregate';

export interface TopLevelEntityEdfiOdsApi {
  aggregate: Aggregate;
}

const enhancerName = 'TopLevelEntitySetupEnhancer';

export function addTopLevelEntityEdfiOdsApiTo(topLevelEntity: TopLevelEntity) {
  if (topLevelEntity.data.edfiOdsApi == null) topLevelEntity.data.edfiOdsApi = {};

  Object.assign(topLevelEntity.data.edfiOdsApi, {
    aggregate: NoAggregate,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces([...metaEd.namespace.values()]).forEach((entity) => {
    addTopLevelEntityEdfiOdsApiTo(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
