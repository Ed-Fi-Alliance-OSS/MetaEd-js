import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';

/**
 * Accumulates the booleanJsonPaths and numericJsonPaths for an entity for use in type coercion
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      // Using Set to remove duplicates
      const booleanResult: Set<JsonPath> = new Set();
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
          } else if (numericTypes.includes(jppp.sourceProperty.type)) {
            numericResult.add(jppp.jsonPath);
          }
        });
      });

      (entity.data.edfiApiSchema as EntityApiSchemaData).booleanJsonPaths = [...booleanResult].sort();
      (entity.data.edfiApiSchema as EntityApiSchemaData).numericJsonPaths = [...numericResult].sort();
    },
  );

  // Descriptors have no boolean or numeric properties
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    edfiApiSchemaData.booleanJsonPaths = [];
    edfiApiSchemaData.numericJsonPaths = [];
  });

  return {
    enhancerName: 'BooleanNumericJsonPathsEnhancer',
    success: true,
  };
}
