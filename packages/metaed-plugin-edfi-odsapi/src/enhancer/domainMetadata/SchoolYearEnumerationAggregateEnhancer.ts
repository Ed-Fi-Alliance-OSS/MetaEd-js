// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, asTopLevelEntity } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult } from '@edfi/metaed-core';
import { enhanceSingleEntity } from './AggregateEnhancerBase';

const enhancerName = 'SchoolYearEnumerationAggregateEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, asTopLevelEntity(modelBase), metaEd.namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
