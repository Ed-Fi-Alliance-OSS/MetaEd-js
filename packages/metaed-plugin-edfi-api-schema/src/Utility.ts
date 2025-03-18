import { EntityProperty, MetaEdPropertyPath, NoEntityProperty, TopLevelEntity } from '@edfi/metaed-core';
import * as inflection from 'inflection';
import { invariant } from 'ts-invariant';
import { EntityPropertyApiSchemaData } from './model/EntityPropertyApiSchemaData';
import { FlattenedIdentityProperty } from './model/FlattenedIdentityProperty';
import { EntityApiSchemaData } from './model/EntityApiSchemaData';
import { JsonPathsInfo } from './model/JsonPathsMapping';

/**
 * Simplified MetaEd top level reference checking, supporting
 * Association and Domain Entity
 */
export function isTopLevelReference(property: EntityProperty): boolean {
  return property.type === 'association' || property.type === 'domainEntity';
}

/**
 * A MetaEd property type check for a Descriptor reference
 */
export function isDescriptor(property: EntityProperty): boolean {
  return property.type === 'descriptor';
}

/**
 * Uncapitalizes the first character, and also leading acronyms
 *
 * Generally follows the behavior of ToCamelCase() in
 * https://github.com/Ed-Fi-Alliance-OSS/Ed-Fi-ODS/blob/main/Application/EdFi.Common/Extensions/StringExtensions.cs
 */
export function uncapitalize(text: string): string {
  // Match on a run of uppercase characters at the beginning of the string
  const leadingUppercaseBlockMatch: string[] | null = text.match(/^[A-Z]*/);

  // Case of no leading uppercase characters
  if (leadingUppercaseBlockMatch == null) return text;

  const [leadingUppercaseBlock] = leadingUppercaseBlockMatch;

  // Case of a single uppercase character
  if (leadingUppercaseBlock.length === 1) {
    return leadingUppercaseBlock.toLowerCase() + text.substring(1);
  }

  // Case of entirely an acronym with or without a trailing "s" (e.g. "URIs" -> "uris" not "urIs")
  if (
    text.length === leadingUppercaseBlock.length ||
    (text.length === leadingUppercaseBlock.length + 1 && text.endsWith('s'))
  ) {
    return text.toLowerCase();
  }

  // Case of acronym at start of longer string
  const acronymLength = leadingUppercaseBlock.length - 1;
  return text.substring(0, acronymLength).toLowerCase() + text.substring(acronymLength);
}

export function capitalize(text: string): string {
  if (text == null || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.substring(1);
}

const pluralEdgeCases = {
  accommodation: 'accommodations',
  Accommodation: 'Accommodations',
};

export function pluralize(text: string): string {
  if (text in pluralEdgeCases) {
    return pluralEdgeCases[text];
  }

  return inflection.pluralize(text);
}

export function singularize(text: string): string {
  return inflection.singularize(text);
}

export function dropPrefix(prefix: string, str: string) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  }
  return str;
}

/**
 * In the ODS/API, top level names on document bodies can be different for the same property, depending
 * on the names of other properties on the same entity.
 *
 * Select the correct top level name to avoid possible collisions between superclass and subclass properties.
 */
export function topLevelApiNameOnEntity(entity: TopLevelEntity, property: EntityProperty): string {
  const propertyApiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  // Avoid collision if this is a property on the subclass with a superclass conflict
  if (propertyApiSchemaData.namingCollisionWithSuperclassProperty !== NoEntityProperty) {
    return propertyApiSchemaData.apiMapping.decollisionedTopLevelName;
  }

  // Avoid collision if this is a property on the superclass with a subclass conflict that applies here.
  // (Note this doesn't handle the case where the property is pulled up but actually on an inline common/choice,
  // but that's hopefully not a valid model scenario anyway due to inline common/choice naming patterns.)
  if (
    propertyApiSchemaData.namingCollisionWithSubclassProperties.some(
      (subclassProperty) => subclassProperty.parentEntity === entity,
    )
  ) {
    return propertyApiSchemaData.apiMapping.decollisionedTopLevelName;
  }

  return propertyApiSchemaData.apiMapping.topLevelName;
}

/**
 * Prepend a prefix to a name , unless the prefix already exists
 */
export function prependPrefixWithCollapse(name: string, prefix: string): string {
  if (name.startsWith(prefix)) return name;
  return `${prefix}${name}`;
}

/**
 * Returns the full property name of the given property, taking into account shortenTo
 */
export function adjustedFullPropertyName(property: EntityProperty): string {
  // The rule where the role name is ignored if same as property name
  if (property.roleName === property.metaEdName && property.shortenTo === '') {
    return property.metaEdName;
  }

  // The rule where the role name is collapsed into the property name if the role name is a prefix
  if (property.metaEdName.startsWith(property.roleName) && property.shortenTo === '') {
    return property.metaEdName;
  }

  // If "shorten to" is specified, it overrides all role name rules and is simply the prefix
  const roleNamePrefix = property.shortenTo === '' ? property.roleName : property.shortenTo;
  return roleNamePrefix + property.metaEdName;
}

/**
 * Accumulates the role name prefixes, if any, for a chain of properties, collapsing the prefixes along the way
 */
function identicalRoleNamePatternPrefixReducer(accumulatedPrefix: string, currentProperty: EntityProperty): string {
  if (currentProperty.metaEdName === currentProperty.roleName && currentProperty.shortenTo === '') {
    return prependPrefixWithCollapse(currentProperty.roleName, accumulatedPrefix);
  }

  if (currentProperty.metaEdName === currentProperty.roleName && currentProperty.shortenTo !== '') {
    return prependPrefixWithCollapse(currentProperty.shortenTo, accumulatedPrefix);
  }

  return accumulatedPrefix;
}

/**
 * Determines if the given property chain from a FlattenedIdentityProperty has the identical
 * role name pattern, which affects name prefixing, and provides the prefix if it does.
 */
export function findIdenticalRoleNamePatternPrefix(flattenedIdentityProperty: FlattenedIdentityProperty): string {
  invariant(flattenedIdentityProperty.propertyChain.length > 0, 'propertyChain should not be empty');

  return flattenedIdentityProperty.propertyChain.reduce(identicalRoleNamePatternPrefixReducer, '');
}

/**
 * Searches the given path in the entity's mergeJsonPathsMapping.
 * Recursively searches the baseEntity if not found.
 */
export function findMergeJsonPathsMapping(entity: TopLevelEntity | null, path: MetaEdPropertyPath): JsonPathsInfo | null {
  if (!entity) {
    // Reached the top of the entity hierarchy without finding the path
    return null;
  }

  const { mergeJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;
  const result = mergeJsonPathsMapping[path];
  return result || findMergeJsonPathsMapping(entity.baseEntity, path);
}
