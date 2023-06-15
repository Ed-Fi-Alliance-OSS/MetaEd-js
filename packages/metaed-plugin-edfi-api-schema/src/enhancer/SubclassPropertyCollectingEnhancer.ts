import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { CollectedProperty } from '../model/CollectedProperty';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { defaultPropertyModifier } from '../model/PropertyModifier';
import { collectProperties } from './BasePropertyCollectingEnhancer';

/**
 * Accumulates properties that belong under an subclass entity in the API body. Subclasses include the properties
 * of their superclass, with the exception of any superclass properties that have been renamed.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass').forEach((entity) => {
    const collectedProperties: CollectedProperty[] = [];
    const subclass: TopLevelEntity = entity as TopLevelEntity;

    let renamedPropertyMetaEdName: string | null = null;
    subclass.properties.forEach((property) => {
      collectProperties(collectedProperties, property, defaultPropertyModifier);
      // Looking for an identity rename to exclude the superclass property - MetaEd only allows
      // one rename property per subclass, so assuming only one is fine.
      if (property.isIdentityRename) renamedPropertyMetaEdName = property.baseKeyName;
    });

    if (subclass.baseEntity != null) {
      subclass.baseEntity.properties
        .filter((p) => p.metaEdName !== renamedPropertyMetaEdName)
        .forEach((property) => {
          collectProperties(collectedProperties, property, defaultPropertyModifier);
        });
    }

    (entity.data.edfiApiSchema as EntityApiSchemaData).collectedProperties = collectedProperties;
  });

  return {
    enhancerName: 'SubclassPropertyCollectingEnhancer',
    success: true,
  };
}
