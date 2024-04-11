import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, MetaEdPropertyFullName } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { JsonPathsInfo } from '../model/JsonPathsMapping';

/**
 * Accumulates the identityJsonPaths for the parts of identity for an entity, putting them in lexical order.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      // Using Set to remove duplicates
      const result: Set<JsonPath> = new Set();

      const { identityFullnames, allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

      identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
        const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];
        // Add them all
        matchingJsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => result.add(jppp.jsonPath));
      });

      (entity.data.edfiApiSchema as EntityApiSchemaData).identityJsonPaths = [...result].sort();
    },
  );

  // Descriptors have no identity paths
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((descriptor) => {
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).identityJsonPaths = [];
  });

  return {
    enhancerName: 'IdentityJsonPathsEnhancer',
    success: true,
  };
}
