import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPathsMapping } from '../model/JsonPathsMapping';
import { PropertyPath } from '../model/PathTypes';

/**
 * Copies a mapping of PropertyPaths to JsonPaths, filtering out PropertyPaths beyond a depth of one
 */
function documentPathsMappingFrom(allJsonPathsMapping: JsonPathsMapping): JsonPathsMapping {
  const result: JsonPathsMapping = {};

  Object.keys(allJsonPathsMapping).forEach((propertyPath: PropertyPath) => {
    if (!propertyPath.includes('.')) {
      result[propertyPath] = allJsonPathsMapping[propertyPath];
    }
  });

  return result;
}

/**
 * Derives a documentPathsMapping for each entity by taking the allJsonPathsMapping and omitting property paths
 * that follow references.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      edfiApiSchemaData.documentPathsMapping = documentPathsMappingFrom(edfiApiSchemaData.allJsonPathsMapping);
    },
  );

  return {
    enhancerName: 'DocumentPathsMappingEnhancer',
    success: true,
  };
}
