// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';

/**
 * Accumulates the booleanJsonPaths, dateTimeJsonPaths and numericJsonPaths for an entity for use in type coercion
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
    const booleanResult: Set<JsonPath> = new Set();
    const dateResult: Set<JsonPath> = new Set();
    const dateTimeResult: Set<JsonPath> = new Set();
    const numericResult: Set<JsonPath> = new Set();
    const numericTypes = [
      'currency',
      'decimal',
      'duration',
      'integer',
      'percent',
      'schoolYearEnumeration',
      'sharedDecimal',
      'sharedInteger',
      'sharedShort',
      'short',
      'year',
    ];

    const { allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

    Object.entries(allJsonPathsMapping).forEach(([, jsonPathsInfo]) => {
      jsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        // Ignore merged away entries
        if (jppp.flattenedIdentityProperty.mergedAwayBy != null) return;

        if (jppp.sourceProperty.type === 'boolean') {
          booleanResult.add(jppp.jsonPath);
        } else if (jppp.sourceProperty.type === 'date') {
          dateResult.add(jppp.jsonPath);
        } else if (jppp.sourceProperty.type === 'datetime') {
          dateTimeResult.add(jppp.jsonPath);
        } else if (numericTypes.includes(jppp.sourceProperty.type)) {
          numericResult.add(jppp.jsonPath);
        }
      });
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).booleanJsonPaths = [...booleanResult].sort();
    (entity.data.edfiApiSchema as EntityApiSchemaData).dateJsonPaths = [...dateResult].sort();
    (entity.data.edfiApiSchema as EntityApiSchemaData).dateTimeJsonPaths = [...dateTimeResult].sort();
    (entity.data.edfiApiSchema as EntityApiSchemaData).numericJsonPaths = [...numericResult].sort();
  });

  // Descriptors have no boolean, numeric, date, or datetime properties
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    edfiApiSchemaData.booleanJsonPaths = [];
    edfiApiSchemaData.dateJsonPaths = [];
    edfiApiSchemaData.dateTimeJsonPaths = [];
    edfiApiSchemaData.numericJsonPaths = [];
  });

  return {
    enhancerName: 'TypeCoercionJsonPathsEnhancer',
    success: true,
  };
}
