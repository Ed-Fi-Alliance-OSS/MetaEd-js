import { EntityProperty } from '@edfi/metaed-core';
import { uncapitalize, pluralize, capitalize } from '../Utility';
import { EntityPropertyApiSchemaData } from './EntityPropertyApiSchemaData';

/**
 * A possible modifier to the API body element shape of a property, based on a factor external
 * to the property itself.
 */
export type PropertyModifier = {
  /**
   * If a parent is optional, everything below is also, regardless of actual property
   * cardinality.
   */
  optionalDueToParent: boolean;
  /**
   * API body elements corresponding to properties can get name prefixes from parents
   * of the property.
   */
  parentPrefixes: string[];
};

/**
 * The default modifier that specifies no modifications
 */
export const defaultPropertyModifier: PropertyModifier = {
  optionalDueToParent: false,
  parentPrefixes: [],
};

/**
 * Returns the property name prefixed by possible parent modifiers.
 */
export function prefixedName(apiMappingName: string, property: EntityProperty, propertyModifier: PropertyModifier): string {
  const prefix: string = propertyModifier.parentPrefixes.join('');
  if (prefix.length === 0) return apiMappingName;

  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  if (apiMapping.isReferenceCollection || property.type === 'descriptor')
    return `${uncapitalize(prefix)}${capitalize(apiMappingName)}`;

  return `${uncapitalize(prefix)}${pluralize(property.fullPropertyName)}`;
}

/**
 * Returns a new PropertyModifier that is the concatenation of two. Used for Commons and sub-Commons,
 * where there is a chain of parent modifiers that cannot be completely pre-computed
 * (without a different design, like pre-computing all possible paths).
 */
export function propertyModifierConcat(p1: PropertyModifier, p2: PropertyModifier): PropertyModifier {
  return {
    optionalDueToParent: p1.optionalDueToParent || p2.optionalDueToParent,
    parentPrefixes: [...p1.parentPrefixes, ...p2.parentPrefixes],
  };
}
