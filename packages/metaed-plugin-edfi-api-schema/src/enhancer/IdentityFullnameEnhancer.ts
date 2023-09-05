import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PropertyFullName } from '../model/api-schema/PropertyFullName';

/**
 * Accumulates the identity fullnames for a non-subclass entity that maps to an API resource.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association').forEach((entity) => {
    const identityFullnames: PropertyFullName[] = [];

    (entity as TopLevelEntity).properties.forEach((property) => {
      if (property.isPartOfIdentity) identityFullnames.push(property.fullPropertyName as PropertyFullName);
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).identityFullnames = identityFullnames;
  });

  return {
    enhancerName: 'IdentityFullnameEnhancer',
    success: true,
  };
}
