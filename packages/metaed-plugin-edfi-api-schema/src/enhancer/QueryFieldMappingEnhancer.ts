import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, EntityProperty } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';
import { DocumentPaths } from '../model/api-schema/DocumentPaths';
import { ReferenceJsonPaths } from '../model/api-schema/ReferenceJsonPaths';
import { PathType } from '../model/api-schema/PathType';

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
function addTo(
  queryFieldMapping: QueryFieldMapping,
  jsonPath: JsonPath,
  pathType: PathType,
  sourceProperty?: EntityProperty,
) {
  const queryField = endOfPath(jsonPath);

  // Initialize array if not exists
  if (queryFieldMapping[queryField] == null) {
    queryFieldMapping[queryField] = [{ path: jsonPath, type: pathType, sourceProperty }];
  }
  // Avoid duplicates
  if (queryFieldMapping[queryField][0].path !== jsonPath) {
    queryFieldMapping[queryField] = [{ path: jsonPath, type: pathType, sourceProperty }];
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
        addTo(result, documentPaths.path, documentPaths.type, documentPaths.sourceProperty);
      }
      return;
    }

    // DescriptorReferencePath
    if (documentPaths.isDescriptor) {
      if (isNotCollectionPath(documentPaths.path)) {
        addTo(result, documentPaths.path, documentPaths.type, documentPaths.sourceProperty);
      }
      return;
    }

    // DocumentReferencePaths
    documentPaths.referenceJsonPaths.forEach((referenceJsonPaths: ReferenceJsonPaths) => {
      if (isNotCollectionPath(referenceJsonPaths.referenceJsonPath)) {
        addTo(result, referenceJsonPaths.referenceJsonPath, referenceJsonPaths.type, documentPaths.sourceProperty);
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
      namespace: [{ path: '$.namespace' as JsonPath, type: 'string' }],
      shortDescription: [{ path: '$.shortDescription' as JsonPath, type: 'string' }],
      description: [{ path: '$.description' as JsonPath, type: 'string' }],
    };
  });

  return {
    enhancerName: 'DocumentPathsMappingEnhancer',
    success: true,
  };
}
