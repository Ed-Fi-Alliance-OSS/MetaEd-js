import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { CollectedProperty } from '../model/CollectedProperty';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { defaultPropertyModifier } from '../model/PropertyModifier';
import { collectAllProperties, collectApiProperties } from './BasePropertyCollectingEnhancer';

/**
 * Accumulates properties that belong under an subclass entity in the API body. Subclasses include the properties
 * of their superclass, with the exception of any superclass properties that have been renamed.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass').forEach((entity) => {
    const collectedApiProperties: CollectedProperty[] = [];
    const allProperties: CollectedProperty[] = [];

    const subclass: TopLevelEntity = entity as TopLevelEntity;

    let renamedPropertyMetaEdName: string | null = null;
    subclass.properties.forEach((property) => {
      collectApiProperties(collectedApiProperties, property, defaultPropertyModifier, []);
      collectAllProperties(allProperties, property);

      // Looking for an identity rename to exclude the superclass property - MetaEd only allows
      // one rename property per subclass, so assuming only one is fine.
      if (property.isIdentityRename) renamedPropertyMetaEdName = property.baseKeyName;
    });

    if (subclass.baseEntity != null) {
      subclass.baseEntity.properties
        .filter((p) => p.metaEdName !== renamedPropertyMetaEdName)
        .forEach((property) => {
          collectApiProperties(collectedApiProperties, property, defaultPropertyModifier, []);
          collectAllProperties(allProperties, property);
        });
    }

    (entity.data.edfiApiSchema as EntityApiSchemaData).collectedApiProperties = collectedApiProperties;
    (entity.data.edfiApiSchema as EntityApiSchemaData).allProperties = allProperties;
  });

  return {
    enhancerName: 'SubclassPropertyCollectingEnhancer',
    success: true,
  };
}
