// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, getAllEntitiesOfType, MetaEdEnvironment, MetaEdPropertyPath } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { JsonPathsInfo } from '../model/JsonPathsMapping';
import { ArrayUniquenessConstraint } from '../model/api-schema/ArrayUniquenessConstraint';

/**
 * Extracts the array base path from a JsonPath (e.g., "$.addresses[*].periods[*].beginDate" -> "$.addresses[*]")
 */
function extractArrayBasePath(jsonPath: JsonPath): JsonPath | null {
  const match = jsonPath.match(/^(\$\.[^[]+\[\*\])/);
  return match ? (match[1] as JsonPath) : null;
}

/**
 * Extracts the nested path relative to the base path
 * (e.g., "$.addresses[*].periods[*].beginDate" with base "$.addresses[*]" -> "$.periods[*].beginDate")
 */
function extractNestedPath(jsonPath: JsonPath, basePath: JsonPath): JsonPath {
  return jsonPath.replace(basePath, '$') as JsonPath;
}

/**
 * Groups JsonPaths by their array base paths to build nested constraint structure
 */
function groupJsonPathsByArrayStructure(jsonPaths: JsonPath[]): ArrayUniquenessConstraint {
  const sortedPaths = [...jsonPaths].sort();

  // Check if all paths have the same base array path
  const firstBasePath = extractArrayBasePath(sortedPaths[0]);

  if (!firstBasePath) {
    // No array structure, this shouldn't happen for array identities
    return { paths: sortedPaths };
  }

  // Group paths by whether they are simple (one level) or nested (multiple levels)
  const simplePaths: JsonPath[] = [];
  const nestedPaths: JsonPath[] = [];

  sortedPaths.forEach((path) => {
    const basePath = extractArrayBasePath(path);
    if (basePath === firstBasePath) {
      // Check if this is a simple path (no further nesting)
      const remainingPath = extractNestedPath(path, basePath);
      if (!remainingPath.includes('[*]')) {
        simplePaths.push(path);
      } else {
        nestedPaths.push(path);
      }
    }
  });

  const constraint: ArrayUniquenessConstraint = {};

  // Add simple paths if any
  if (simplePaths.length > 0) {
    constraint.paths = simplePaths;
  }

  // Add nested constraint if any
  if (nestedPaths.length > 0) {
    const nestedRelativePaths = nestedPaths.map((path) => extractNestedPath(path, firstBasePath));
    constraint.nestedConstraint = {
      basePath: firstBasePath,
      ...groupJsonPathsByArrayStructure(nestedRelativePaths),
    };
  }

  return constraint;
}

/**
 * Converts a Map<MetaEdPropertyPath, Set<JsonPath>> to ArrayUniquenessConstraint[]
 * Groups paths by their MetaEdPropertyPath and builds nested constraint structures
 */
function buildArrayUniquenessConstraints(map: Map<MetaEdPropertyPath, Set<JsonPath>>): ArrayUniquenessConstraint[] {
  const mapEntriesArray: [MetaEdPropertyPath, Set<JsonPath>][] = Array.from(map.entries());

  // Sort outer array by MetaEdPropertyPaths
  mapEntriesArray.sort((entry1: [MetaEdPropertyPath, Set<JsonPath>], entry2: [MetaEdPropertyPath, Set<JsonPath>]) => {
    const propertyPath1: MetaEdPropertyPath = entry1[0];
    const propertyPath2: MetaEdPropertyPath = entry2[0];
    return propertyPath1.localeCompare(propertyPath2);
  });

  return mapEntriesArray.map((entry) => {
    const jsonPaths = Array.from(entry[1]);
    return groupJsonPathsByArrayStructure(jsonPaths);
  });
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

    (entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints =
      buildArrayUniquenessConstraints(resultMap);
  });

  return {
    enhancerName: 'ArrayUniquenessConstraintEnhancer',
    success: true,
  };
}
