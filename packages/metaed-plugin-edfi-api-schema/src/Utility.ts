// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath, NoEntityProperty, TopLevelEntity, CommonProperty } from '@edfi/metaed-core';
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
 * Checks if a property is a common extension override.
 */
export function isCommonExtensionOverride(property: EntityProperty): property is CommonProperty {
  return property.type === 'common' && (property as CommonProperty).isExtensionOverride;
}

/**
 * Checks if an entity is an extension (domainEntityExtension or associationExtension).
 */
export function isExtensionEntity(entity: TopLevelEntity): boolean {
  return entity.type === 'domainEntityExtension' || entity.type === 'associationExtension';
}

/**
 * Checks if JsonPathsInfo contains any extension-specific properties (with _ext in jsonPath).
 */
export function hasExtensionProperties(jsonPathsInfo: JsonPathsInfo): boolean {
  return jsonPathsInfo.jsonPathPropertyPairs.some(({ jsonPath }) => jsonPath.includes('._ext'));
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

export function deAcronym(text: string): string {
  if (text == null || typeof text !== 'string') return '';
  // Convert sequences of uppercase letters to upper camel case
  // If followed by lowercase letters, keep the last uppercase letter capitalized (e.g., "IDEAPart" -> "IdeaPart")
  // If not followed by lowercase letters, convert normally (e.g., "TPDM" -> "Tpdm")
  return text.replace(/[A-Z]+/g, (match, offset) => {
    // Check if this match is followed by lowercase letters
    const nextChar = text.charAt(offset + match.length);
    const isFollowedByLowercase = nextChar && /[a-z]/.test(nextChar);

    if (isFollowedByLowercase && match.length > 1) {
      // Keep the last letter capitalized as it starts the next word
      return match.charAt(0).toUpperCase() + match.slice(1, -1).toLowerCase() + match.slice(-1);
    }
    // Normal conversion: first letter uppercase, rest lowercase
    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
  });
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
 * Determines the canonical role name prefix for a property, honoring shortenTo overrides.
 */
export function canonicalRoleNamePrefix(property: EntityProperty): string {
  return property.shortenTo === '' ? property.roleName : property.shortenTo;
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
  const roleNamePrefix = canonicalRoleNamePrefix(property);
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

/**
 * Normalize entity metaEdName to include a "Descriptor" suffix on descriptor entities
 */
export function normalizeDescriptorName(entity: TopLevelEntity): string {
  return entity.type === 'descriptor' ? `${entity.metaEdName}Descriptor` : entity.metaEdName;
}

/**
 * Normalize a property path to include a "Descriptor" suffix only if it doesn't already end with "Descriptor"
 */
export function normalizeDescriptorPropertyPath(propertyPath: string, shouldAddDescriptor: boolean): string {
  if (!shouldAddDescriptor) {
    return propertyPath;
  }

  // If it already ends with "Descriptor", don't add another one
  if (propertyPath.endsWith('Descriptor')) {
    return propertyPath;
  }

  return `${propertyPath}Descriptor`;
}

/**
 * Returns a string that has the first character converted to upper-case.
 */
function toMixedCase(text: string): string {
  if (!text || text.length === 1) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.substring(1);
}

/**
 * Breaks the supplied text into individual words using mixed-casing conventions augmented by delimiters.
 * This overload accepts a custom casing function to process each term.
 *
 * @param compositeTerm The text to normalize
 * @param applyCasing Function to apply casing to each term
 * @param delimiters Additional delimiter characters to split on
 * @returns Normalized text with spaces between words
 */
export function normalizeCompositeTermForDisplayWithCasing(
  compositeTerm: string,
  applyCasing: (term: string) => string,
  ...delimiters: string[]
): string {
  const delimiterExpression = delimiters.length === 0 ? '' : `(?=[${delimiters.map((c) => `\\${c}`).join('')}])?`;

  // Regex pattern to match word boundaries in camelCase/PascalCase text:
  // - Multiple uppercase letters not followed by lowercase (acronyms like "HTTP")
  // - Uppercase letters followed by uppercase then lowercase (start of new word like "XMLParser")
  // - Optional uppercase letter followed by lowercase letters/numbers (words like "test" or "Test")
  // - Uppercase letter followed by lowercase/numbers (words like "A1")
  const pattern = new RegExp(
    `(?:[A-Z]{2,}(?![a-z])|[A-Z]+(?=[A-Z][a-z0-9])|[A-Z]?[a-z]+|[A-Z][a-z0-9]*)${delimiterExpression}`,
    'g',
  );

  const matches = compositeTerm.match(pattern) || [];
  const processedTerms: string[] = [];

  matches.forEach((match) => {
    processedTerms.push(applyCasing(match));
  });

  return processedTerms.join(' ');
}

/**
 * Breaks the supplied text into individual words using mixed-casing conventions augmented by delimiters.
 * This is the simple overload that applies mixed case to each term.
 */
export function normalizeCompositeTermForDisplay(compositeTerm: string, ...delimiters: string[]): string {
  return normalizeCompositeTermForDisplayWithCasing(compositeTerm, toMixedCase, ...delimiters);
}

/**
 * Returns a string that is converted to Uri-Segment format casing, by converting all composite
 * terms (that are not 2 letter abbreviations) to camel case (hyphenated text terms are processed individually).
 *
 * Code ported from https://github.com/Ed-Fi-Alliance-OSS/Ed-Fi-ODS/blob/main/Application/EdFi.Ods.Common/SchemaNameMapProvider.cs
 *
 * @param text The text to convert to URI segment format
 * @returns URI segment formatted string (lowercase with hyphens)
 */
export function createUriSegment(text: string): string {
  // Special case (preserve state-level upper-cased abbreviations)
  const STATE_ABBREVIATION_REGEX = /^[A-Z]{2}$/;
  if (STATE_ABBREVIATION_REGEX.test(text)) {
    return text;
  }

  return normalizeCompositeTermForDisplay(text, ' ', '-').replace(/ /g, '-').toLowerCase();
}
