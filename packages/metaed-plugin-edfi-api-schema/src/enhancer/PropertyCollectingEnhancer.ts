import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { CollectedProperty } from '../model/CollectedProperty';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { defaultPropertyModifier } from '../model/PropertyModifier';
import { collectAllProperties, collectApiProperties } from './BasePropertyCollectingEnhancer';

/**
 * Accumulates properties that belong under an entity in the API body.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'domainEntitySubclass',
    'domainEntityExtension',
    'association',
    'associationSubclass',
    'associationExtension',
    'common',
    'commonSubclass',
    'commonExtension',
    'choice',
  ).forEach((entity) => {
    const collectedApiProperties: CollectedProperty[] = [];
    const allProperties: CollectedProperty[] = [];

    (entity as TopLevelEntity).properties.forEach((property) => {
      collectApiProperties(collectedApiProperties, property, defaultPropertyModifier);
      collectAllProperties(allProperties, property);
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).collectedApiProperties = collectedApiProperties;
    (entity.data.edfiApiSchema as EntityApiSchemaData).allProperties = allProperties;
  });

  return {
    enhancerName: 'PropertyCollectingEnhancer',
    success: true,
  };
}
