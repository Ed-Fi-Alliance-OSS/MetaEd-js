import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';
import { DocumentPaths } from '../model/api-schema/DocumentPaths';
import { ReferenceJsonPaths } from '../model/api-schema/ReferenceJsonPaths';

/**
 * Returns the last part of a JsonPath
 */
function endOfPath(jsonPath: JsonPath): string {
  const endRegex = /[^.]+$/;
  const match = jsonPath.match(endRegex);
  return match == null ? '' : match[0];
}

/**
 * Collections are not included in queries, test for them with JsonPath notation
 */
function isNotCollectionPath(jsonPath: JsonPath): boolean {
  return !jsonPath.includes('[*]');
}

/**
 * Add a JsonPath to a QueryFieldMapping
 */
function addTo(queryFieldMapping: QueryFieldMapping, jsonPath: JsonPath) {
  const queryField = endOfPath(jsonPath);
  // Initialize array if not exists
  if (queryFieldMapping[queryField] == null) queryFieldMapping[queryField] = [];
  // Avoid duplicates
  if (!queryFieldMapping[queryField].includes(jsonPath)) {
    queryFieldMapping[queryField].push(jsonPath);
  }
}

/**
 * Extracts query fields for a given DocumentPathsMapping purely by string manipulation.
 */
function queryFieldMappingFrom(documentPathsMapping: DocumentPathsMapping): QueryFieldMapping {
  const result: QueryFieldMapping = {};
  Object.values(documentPathsMapping).forEach((documentPaths: DocumentPaths) => {
    // ScalarPath
    if (!documentPaths.isReference) {
      if (isNotCollectionPath(documentPaths.path)) {
        addTo(result, documentPaths.path);
      }
      return;
    }

    // DescriptorReferencePath
    if (documentPaths.isDescriptor) {
      if (isNotCollectionPath(documentPaths.path)) {
        addTo(result, documentPaths.path);
      }
      return;
    }

    // DocumentReferencePaths
    documentPaths.referenceJsonPaths.forEach((referenceJsonPaths: ReferenceJsonPaths) => {
      if (isNotCollectionPath(referenceJsonPaths.referenceJsonPath)) {
        addTo(result, referenceJsonPaths.referenceJsonPath);
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
      codeValue: ['$.codeValue' as JsonPath],
      namespace: ['$.namespace' as JsonPath],
    };
  });

  return {
    enhancerName: 'DocumentPathsMappingEnhancer',
    success: true,
  };
}
