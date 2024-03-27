import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  MetaEdPropertyFullName,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Accumulates the identity fullnames for a non-subclass entity that maps to an API resource.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association').forEach((entity) => {
    const identityFullnames: MetaEdPropertyFullName[] = [];

    (entity as TopLevelEntity).properties.forEach((property) => {
      if (property.isPartOfIdentity)
        identityFullnames.push(
          `${property.fullPropertyName}${property.type === 'descriptor' ? 'Descriptor' : ''}` as MetaEdPropertyFullName,
        );
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).identityFullnames = identityFullnames;
  });

  return {
    enhancerName: 'IdentityFullnameEnhancer',
    success: true,
  };
}
