// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { asIntegerType, NoSharedSimple } from '@edfi/metaed-core';
import { withEmptyAsNull } from './SharedPropertyEnhancerUtility';

const enhancerName = 'SharedIntegerPropertyEnhancer';

function copyRestrictions(property) {
  const referencedEntity = asIntegerType(property.referencedEntity);
  property.minValue = withEmptyAsNull(referencedEntity.minValue);
  property.maxValue = withEmptyAsNull(referencedEntity.maxValue);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedInteger.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;
    copyRestrictions(property);
  });

  metaEd.propertyIndex.sharedShort.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;
    copyRestrictions(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
