import { MetaEdEnvironment, EnhancerResult, EntityProperty, getAllEntitiesOfType, TopLevelEntity } from '@edfi/metaed-core';

import { ApiEntityMapping, NoApiEntityMapping } from '../model/ApiEntityMapping';
import {
  flattenIdentityPropertiesFrom,
  referenceGroupsFrom,
  descriptorCollectedApiPropertiesFrom,
  superclassFor,
} from './ApiEntityMappingEnhancerBase';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Returns properties sorted by name ascending, optionally with the given property removed
 */
function sortedPropertiesWithExclusion(properties: EntityProperty[], excludedProperty: EntityProperty | undefined) {
  return [...properties]
    .filter((p) => p !== excludedProperty)
    .sort((a, b) => a.fullPropertyName.localeCompare(b.fullPropertyName));
}

/**
 * Collects all of the API shape metadata for a MetaEd subclass entity.
 */
function buildApiEntityMappingForSubclass(entity: TopLevelEntity): ApiEntityMapping {
  if (entity.baseEntity == null) return NoApiEntityMapping;

  const subclassRenamedIdentityProperty: EntityProperty | undefined = entity.properties.find((p) => p.isIdentityRename);
  const baseClassRenamedProperty: EntityProperty | undefined =
    subclassRenamedIdentityProperty === undefined
      ? undefined
      : entity.baseEntity.properties.find((p) => p.metaEdName === subclassRenamedIdentityProperty.baseKeyName);

  const combinedIdentityProperties = sortedPropertiesWithExclusion(
    [...entity.identityProperties, ...entity.baseEntity.identityProperties],
    baseClassRenamedProperty,
  );
  const combinedProperties = sortedPropertiesWithExclusion(
    [...entity.properties, ...entity.baseEntity.properties],
    baseClassRenamedProperty,
  );

  return {
    flattenedIdentityProperties: flattenIdentityPropertiesFrom({
      identityProperties: combinedIdentityProperties,
      omitMergedAwayProperties: false,
    }),
    flattenedIdentityPropertiesOmittingMerges: flattenIdentityPropertiesFrom({
      identityProperties: combinedIdentityProperties,
      omitMergedAwayProperties: true,
    }),
    referenceGroups: referenceGroupsFrom(combinedProperties),
    descriptorCollectedApiProperties: descriptorCollectedApiPropertiesFrom(entity),
    superclass: superclassFor(entity),
  };
}

/**
 * This enhancer uses the results of the ReferenceComponentEnhancer to build API
 * shape metadata for each MetaEd subclass entity.
 *
 * Note, this enhancer is dependent on ApiPropertyMappingEnhancer
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass').forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping = buildApiEntityMappingForSubclass(
      entity as TopLevelEntity,
    );
  });

  return {
    enhancerName: 'SubclassApiEntityMappingEnhancer',
    success: true,
  };
}
