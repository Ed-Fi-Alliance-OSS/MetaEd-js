// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, getAllEntitiesOfType, MetaEdEnvironment } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { JsonPathsInfo } from '../model/JsonPathsMapping';

/**
 * Adds array uniqueness constraints for JsonPaths derived from array identities
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'associationSubclass',
    'domainEntitySubclass',
    'associationExtension',
    'domainEntityExtension',
  ).forEach((entity) => {
    const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    // Filter out duplicate paths in allJsonPathsMapping (guaranteed to be duplicates)
    const result: Set<JsonPath> = new Set();

    // Look through all the paths for array identities
    Object.values(edfiApiSchemaData.allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
      if (jsonPathsInfo.isArrayIdentity) {
        const jsonPaths: JsonPath[] = jsonPathsInfo.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);
        jsonPaths.forEach(result.add, result);
      }
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints = [...result].sort();
  });

  return {
    enhancerName: 'ArrayUniquenessConstraintEnhancer',
    success: true,
  };
}
