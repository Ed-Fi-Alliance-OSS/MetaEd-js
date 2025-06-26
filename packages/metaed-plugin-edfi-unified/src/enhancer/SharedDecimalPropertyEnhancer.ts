// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, SharedDecimal } from '@edfi/metaed-core';
import { NoSharedSimple } from '@edfi/metaed-core';
import { withEmptyAsNull } from './SharedPropertyEnhancerUtility';

const enhancerName = 'SharedDecimalPropertyEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedDecimal.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;

    const referencedEntity = property.referencedEntity as SharedDecimal;
    property.totalDigits = referencedEntity.totalDigits;
    property.decimalPlaces = referencedEntity.decimalPlaces;
    property.minValue = withEmptyAsNull(referencedEntity.minValue);
    property.maxValue = withEmptyAsNull(referencedEntity.maxValue);
  });

  return {
    enhancerName,
    success: true,
  };
}
