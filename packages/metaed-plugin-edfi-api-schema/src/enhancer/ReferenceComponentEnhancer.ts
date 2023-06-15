// may be a candidate for future addition to metaed-plugin-edfi-unified-advanced
import { EnhancerResult, MetaEdEnvironment, ReferentialProperty, EntityProperty, getAllProperties } from '@edfi/metaed-core';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { newReferenceElement, ReferenceComponent, newReferenceGroup } from '../model/ReferenceComponent';

const enhancerName = 'ReferenceComponentEnhancer';

/**
 * Recursively build ReferenceComponents for a given property.
 */
function buildReferenceComponent(sourceProperty: EntityProperty): ReferenceComponent {
  if (sourceProperty.type === 'association' || sourceProperty.type === 'domainEntity') {
    const referenceComponents: ReferenceComponent[] = (
      sourceProperty as ReferentialProperty
    ).referencedEntity.identityProperties.map((identityProperty) => buildReferenceComponent(identityProperty));
    referenceComponents.sort((a, b) => a.sourceProperty.fullPropertyName.localeCompare(b.sourceProperty.fullPropertyName));
    return {
      ...newReferenceGroup(),
      sourceProperty,
      referenceComponents,
    };
  }
  return {
    ...newReferenceElement(),
    sourceProperty,
  };
}

/**
 * This enhancer builds a ReferenceComponent object graph for every property.
 * The ReferenceComponent is added directly to the property.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    (property.data.edfiApiSchema as EntityPropertyApiSchemaData).referenceComponent = buildReferenceComponent(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
