import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, getAllEntitiesOfType } from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from '../model/ApiEntityMapping';
import {
  superclassFor,
  descriptorCollectedPropertiesFrom,
  flattenedIdentityPropertiesFrom,
  identityReferenceComponentsFrom,
  referenceGroupsFrom,
} from './ApiEntityMappingEnhancerBase';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Collects all of the API shape metadata for a MetaEd non-subclass entity.
 */
function buildApiEntityMapping(entity: TopLevelEntity): ApiEntityMapping {
  const identityProperties = [...entity.identityProperties].sort((a, b) =>
    a.fullPropertyName.localeCompare(b.fullPropertyName),
  );
  const properties = [...entity.properties].sort((a, b) => a.fullPropertyName.localeCompare(b.fullPropertyName));
  return {
    flattenedIdentityProperties: flattenedIdentityPropertiesFrom(identityProperties),
    identityReferenceComponents: identityReferenceComponentsFrom(identityProperties),
    referenceGroups: referenceGroupsFrom(properties),
    descriptorCollectedProperties: descriptorCollectedPropertiesFrom(entity),
    superclass: superclassFor(entity),
  };
}

/**
 * This enhancer uses the results of the ReferenceComponentEnhancer to build API
 * shape metadata for each MetaEd entity.
 *
 * Note, this enhancer is dependent on ApiPropertyMappingEnhancer
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association').forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping = buildApiEntityMapping(entity as TopLevelEntity);
  });

  // Descriptors have no API shape metadata
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping = NoApiEntityMapping;
  });

  return {
    enhancerName: 'ApiEntityMappingEnhancer',
    success: true,
  };
}
