import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Creates EqualityConstraints from entity merge directives using EntityJsonPaths to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const { entityJsonPaths, equalityConstraints } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // find properties on entity with merge directives
      // read them
      // look up paths in entityJsonPaths
      // results go in equalityConstraints, one per jsonpath
    },
  );

  return {
    enhancerName: 'EqualityConstraintEnhancer',
    success: true,
  };
}
