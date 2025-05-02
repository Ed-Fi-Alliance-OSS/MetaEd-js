// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, getAllEntitiesOfType, MetaEdEnvironment, MetaEdPropertyPath } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { JsonPathsInfo } from '../model/JsonPathsMapping';

/**
 * Converts a Map<MetaEdPropertyPath, Set<JsonPath>> to a JsonPath[][] as arrays of JsonPaths
 * from the Set. Sorts the inner array by the JsonPaths and outer array by the MetaEdPropertyPath.
 * MetaEdPropertyPath itself is discarded.
 */
function groupedJsonPathArraysFrom(map: Map<MetaEdPropertyPath, Set<JsonPath>>): JsonPath[][] {
  const mapEntriesArray: [MetaEdPropertyPath, Set<JsonPath>][] = Array.from(map.entries());

  // Sort outer array by MetaEdPropertyPaths
  mapEntriesArray.sort((entry1: [MetaEdPropertyPath, Set<JsonPath>], entry2: [MetaEdPropertyPath, Set<JsonPath>]) => {
    const propertyPath1: MetaEdPropertyPath = entry1[0];
    const propertyPath2: MetaEdPropertyPath = entry2[0];
    return propertyPath1.localeCompare(propertyPath2);
  });

  // Convert Set of JsonPaths to inner array and sort
  return mapEntriesArray.map((entry) => Array.from(entry[1]).sort());
}

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
    const resultMap: Map<MetaEdPropertyPath, Set<JsonPath>> = new Map();

    // Look through all the paths for array identities
    Object.values(edfiApiSchemaData.allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
      if (jsonPathsInfo.isArrayIdentity) {
        let setForPropertyPath: Set<JsonPath> | undefined = resultMap.get(jsonPathsInfo.initialPropertyPath);
        if (setForPropertyPath == null) {
          setForPropertyPath = new Set();
          resultMap.set(jsonPathsInfo.initialPropertyPath, setForPropertyPath);
        }

        const jsonPaths: JsonPath[] = jsonPathsInfo.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);
        jsonPaths.forEach(setForPropertyPath.add, setForPropertyPath);
      }
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints = groupedJsonPathArraysFrom(resultMap);
  });

  return {
    enhancerName: 'ArrayUniquenessConstraintEnhancer',
    success: true,
  };
}
