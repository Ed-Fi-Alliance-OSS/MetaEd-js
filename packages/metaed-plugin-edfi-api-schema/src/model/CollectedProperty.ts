import { EntityProperty } from '@edfi/metaed-core';
import { PropertyModifier } from './PropertyModifier';

/**
 * A property along with a possible modifier inherited from the parent of the property
 */
export type CollectedProperty = {
  property: EntityProperty;
  propertyModifier: PropertyModifier;
};
