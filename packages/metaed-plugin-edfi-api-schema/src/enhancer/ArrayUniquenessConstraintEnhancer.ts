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

  // Group paths by their array base paths
  const pathsByBasePath = new Map<JsonPath | null, JsonPath[]>();

  sortedPaths.forEach((path) => {
    const basePath = extractArrayBasePath(path);
    if (!pathsByBasePath.has(basePath)) {
      pathsByBasePath.set(basePath, []);
    }
    pathsByBasePath.get(basePath)!.push(path);
  });

  // If no array structure, return simple paths
  if (pathsByBasePath.has(null) && pathsByBasePath.size === 1) {
    return { paths: pathsByBasePath.get(null)! };
  }

  // Handle multiple array base paths
  const allSimplePaths: JsonPath[] = [];
  const nestedConstraints: any[] = [];

  pathsByBasePath.forEach((paths, basePath) => {
    if (basePath === null) {
      // Non-array paths - add to simple paths
      allSimplePaths.push(...paths);
    } else {
      // Check if these are simple array paths or nested
      const simplePaths: JsonPath[] = [];
      const nestedPaths: JsonPath[] = [];

      paths.forEach((path) => {
        const remainingPath = extractNestedPath(path, basePath);
        if (!remainingPath.includes('[*]')) {
          simplePaths.push(path);
        } else {
          nestedPaths.push(path);
        }
      });

      // Add simple paths to the main collection
      allSimplePaths.push(...simplePaths);

      // Handle nested paths
      if (nestedPaths.length > 0) {
        const nestedPathGroups = new Map<JsonPath, JsonPath[]>();

        nestedPaths.forEach((path) => {
          const relativePath = extractNestedPath(path, basePath);
          const nestedBasePath = extractArrayBasePath(relativePath);

          if (nestedBasePath) {
            if (!nestedPathGroups.has(nestedBasePath)) {
              nestedPathGroups.set(nestedBasePath, []);
            }
            nestedPathGroups.get(nestedBasePath)!.push(relativePath);
          }
        });

        nestedPathGroups.forEach((pathGroup) => {
          nestedConstraints.push({
            basePath,
            ...groupJsonPathsByArrayStructure(pathGroup),
          });
        });
      }
    }
  });

  const constraint: ArrayUniquenessConstraint = {};

  if (allSimplePaths.length > 0) {
    constraint.paths = allSimplePaths;
  }

  if (nestedConstraints.length > 0) {
    constraint.nestedConstraints = nestedConstraints;
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
