// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';

/**
 * Accumulates the sensitiveDataJsonPaths for an entity
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
    const sensitiveData: Set<JsonPath> = new Set();

    const { allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

    Object.entries(allJsonPathsMapping).forEach(([, jsonPathsInfo]) => {
      jsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        // Ignore merged away entries
        if (jppp.flattenedIdentityProperty.mergedAwayBy != null) return;

        if (jppp.sourceProperty.isSensitiveData) {
          sensitiveData.add(jppp.jsonPath);
        }
      });
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).sensitiveDataJsonPaths = [...sensitiveData].sort();
  });

  // Descriptors have no sensitive data properties
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).sensitiveDataJsonPaths = [];
  });

  return {
    enhancerName: 'SensitiveDataEnhancer',
    success: true,
  };
}
