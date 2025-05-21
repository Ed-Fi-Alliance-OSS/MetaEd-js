// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, DecimalProperty } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { DecimalPropertyValidationInfo } from '../model/api-schema/DecimalPropertyValidationInfo';

/**
 * Accumulates the DecimalPropertyValidationInfos for use in validating decimal scale and precision
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'domainEntityExtension',
    'associationExtension',
  ).forEach((entity) => {
    // Using Set to remove duplicates
    const decimalResult: Set<DecimalPropertyValidationInfo> = new Set();

    const { allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

    Object.entries(allJsonPathsMapping).forEach(([, jsonPathsInfo]) => {
      jsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        // Ignore merged away entries
        if (jppp.flattenedIdentityProperty.mergedAwayBy != null) return;
        switch (jppp.sourceProperty.type) {
          case 'decimal':
          case 'sharedDecimal': {
            const result: DecimalPropertyValidationInfo = { path: jppp.jsonPath };
            const decimalProperty: DecimalProperty = jppp.sourceProperty as DecimalProperty;
            if (decimalProperty.totalDigits != null) {
              result.totalDigits = Number(decimalProperty.totalDigits);
            }
            if (decimalProperty.decimalPlaces != null) {
              result.decimalPlaces = Number(decimalProperty.decimalPlaces);
            }
            decimalResult.add(result);
            break;
          }
          default:
            // No action needed for other types
            break;
        }
      });
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).decimalPropertyValidationInfos = [...decimalResult].sort();
  });

  // Descriptors have no decimal properties
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    edfiApiSchemaData.decimalPropertyValidationInfos = [];
  });

  return {
    enhancerName: 'DecimalPropertyValidationInfos',
    success: true,
  };
}
