import { EntityProperty, InlineCommonProperty, ChoiceProperty } from '@edfi/metaed-core';
import { CollectedProperty } from '../model/CollectedProperty';
import { PropertyModifier, defaultPropertyModifier } from '../model/PropertyModifier';

/**
 * Recursively collects properties in the currentCollection accumulator by following entities
 * referenced by the currentProperty. Also tracks property naming and cardinality modifiers as
 * it follows the chain.
 *
 * InlineCommon and Choice MetaEd entities have no meaning when collecting properties. Instead,
 * references to them act as bags of properties to be pulled up, possibly adding a prefix to the
 * property name in the process.
 *
 * Example 1: If a reference property is optional, all properties in the chain below it must be collected
 * as optional regardless of their actual cardinality.
 * Example 2: If a reference property has a role name, all properties in the chain below it inherit that
 * naming prefix.
 */
export function collectApiProperties(
  currentCollection: CollectedProperty[],
  currentProperty: EntityProperty,
  propertyModifier: PropertyModifier,
  propertyChain: EntityProperty[] = [],
) {
  propertyChain.push(currentProperty);
  // InlineCommon and Choice are never objects in the API document. Instead pull up their property collections.
  if (currentProperty.type === 'inlineCommon' || currentProperty.type === 'choice') {
    const optionalDueToParent =
      currentProperty.isOptional ||
      currentProperty.isOptionalCollection ||
      propertyModifier.optionalDueToParent ||
      currentProperty.type === 'choice';
    const parentPrefixes =
      currentProperty.roleName === currentProperty.metaEdName
        ? [...propertyModifier.parentPrefixes]
        : [...propertyModifier.parentPrefixes, currentProperty.roleName];
    // propertyChain.push(currentProperty);
    (currentProperty as InlineCommonProperty | ChoiceProperty).referencedEntity.properties.forEach((property) => {
      // propertyChain.push(currentProperty);
      collectApiProperties(currentCollection, property, { optionalDueToParent, parentPrefixes }, propertyChain);
    });
  } else {
    const tempPropertyChain: EntityProperty[] = [...propertyChain];
    currentCollection.push({ property: currentProperty, propertyModifier, propertyChain: tempPropertyChain });
    propertyChain.length = 0;
  }
}

/**
 * Adds the property to the collection, setting the PropertyModifier to the default
 */
export function collectAllProperties(currentCollection: CollectedProperty[], currentProperty: EntityProperty) {
  currentCollection.push({ property: currentProperty, propertyModifier: defaultPropertyModifier, propertyChain: [] });
}
