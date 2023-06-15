import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { CollectedProperty } from '../model/CollectedProperty';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { defaultPropertyModifier } from '../model/PropertyModifier';
import { collectProperties } from './BasePropertyCollectingEnhancer';

/**
 * Accumulates properties that belong under an entity in the API body.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'common').forEach((entity) => {
    const collectedProperties: CollectedProperty[] = [];
    (entity as TopLevelEntity).properties.forEach((property) => {
      collectProperties(collectedProperties, property, defaultPropertyModifier);
    });
    (entity.data.edfiApiSchema as EntityApiSchemaData).collectedProperties = collectedProperties;
  });

  return {
    enhancerName: 'PropertyCollectingEnhancer',
    success: true,
  };
}
