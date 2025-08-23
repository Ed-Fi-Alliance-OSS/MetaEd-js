// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, EntityProperty } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';
import { DocumentPaths, DocumentReferencePaths } from '../model/api-schema/DocumentPaths';
import { ReferenceJsonPaths } from '../model/api-schema/ReferenceJsonPaths';
import { PathType } from '../model/api-schema/PathType';
// Removed endOfPath function - no longer needed as we use semantic queryFieldName

/**
 * Collections are not included in queries, test for them with JsonPath notation
 */
function isNotCollectionPath(jsonPath: JsonPath): boolean {
  return !jsonPath.includes('[*]');
}

/**
 * Add a JsonPath to a QueryFieldMapping
 */
function addTo(
  queryFieldMapping: QueryFieldMapping,
  jsonPath: JsonPath,
  pathType: PathType,
  queryFieldName: string,
  sourceProperty?: EntityProperty,
) {
  // Initialize array if not exists
  if (queryFieldMapping[queryFieldName] == null) {
    queryFieldMapping[queryFieldName] = [{ path: jsonPath, type: pathType, sourceProperty }];
  }
  // Avoid duplicates
  if (queryFieldMapping[queryFieldName][0].path !== jsonPath) {
    queryFieldMapping[queryFieldName] = [{ path: jsonPath, type: pathType, sourceProperty }];
  }
}

/**
 * Extracts query fields for a given DocumentPathsMapping using semantic model information.
 */
function queryFieldMappingFrom(documentPathsMapping: DocumentPathsMapping): QueryFieldMapping {
  const result: QueryFieldMapping = {};
  Object.values(documentPathsMapping).forEach((documentPaths: DocumentPaths) => {
    // ScalarPath
    if (!documentPaths.isReference) {
      if (isNotCollectionPath(documentPaths.path)) {
        // Use the semantic queryFieldName from the ScalarPath
        addTo(result, documentPaths.path, documentPaths.type, documentPaths.queryFieldName, documentPaths.sourceProperty);
      }
      return;
    }

    // DescriptorReferencePath
    if (documentPaths.isDescriptor) {
      if (isNotCollectionPath(documentPaths.path)) {
        // Use the semantic queryFieldName from the DescriptorReferencePath
        addTo(result, documentPaths.path, documentPaths.type, documentPaths.queryFieldName, documentPaths.sourceProperty);
      }
      return;
    }

    // DocumentReferencePaths - use the semantic queryFieldName from ReferenceJsonPaths
    const referencePaths = documentPaths as DocumentReferencePaths;
    referencePaths.referenceJsonPaths.forEach((referenceJsonPaths: ReferenceJsonPaths) => {
      if (isNotCollectionPath(referenceJsonPaths.referenceJsonPath)) {
        // Use the semantic queryFieldName that was added to ReferenceJsonPaths
        const queryField = referenceJsonPaths.queryFieldName;

        // Initialize array if not exists
        if (result[queryField] == null) {
          result[queryField] = [
            {
              path: referenceJsonPaths.referenceJsonPath,
              type: referenceJsonPaths.type,
              sourceProperty: referencePaths.sourceProperty,
            },
          ];
        }
        // Avoid duplicates
        if (result[queryField][0].path !== referenceJsonPaths.referenceJsonPath) {
          result[queryField] = [
            {
              path: referenceJsonPaths.referenceJsonPath,
              type: referenceJsonPaths.type,
              sourceProperty: referencePaths.sourceProperty,
            },
          ];
        }
      }
    });
  });
  return result;
}

/**
 * Derives mapping of API query fields for a document from the document paths mapping
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      edfiApiSchemaData.queryFieldMapping = queryFieldMappingFrom(edfiApiSchemaData.documentPathsMapping);
    },
  );

  // Descriptors all have the same query fields
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    edfiApiSchemaData.queryFieldMapping = {
      codeValue: [{ path: '$.codeValue' as JsonPath, type: 'string' }],
      description: [{ path: '$.description' as JsonPath, type: 'string' }],
      effectiveBeginDate: [{ path: '$.effectiveBeginDate' as JsonPath, type: 'date' }],
      effectiveEndDate: [{ path: '$.effectiveEndDate' as JsonPath, type: 'date' }],
      namespace: [{ path: '$.namespace' as JsonPath, type: 'string' }],
      shortDescription: [{ path: '$.shortDescription' as JsonPath, type: 'string' }],
    };
  });

  return {
    enhancerName: 'QueryFieldMappingEnhancer',
    success: true,
  };
}
