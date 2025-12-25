// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EntityProperty } from '@edfi/metaed-core';
import { adjustedFullPropertyName, canonicalRoleNamePrefix } from '../../Utility';
import type { RelationalTableNode } from '../../model/relational/RelationalTableNode';

/**
 * Determines whether the supplied property introduces a relational table.
 */
export function isRelationalTableProperty(property: EntityProperty): boolean {
  if (property.type === 'inlineCommon' || property.type === 'choice') return false;
  return property.isCollection || property.isOptionalCollection || property.isRequiredCollection;
}

/**
 * Appends the prefix to the collection if it is non-empty and not already present.
 */
function appendUniquePrefix(prefixes: string[], prefix: string): void {
  if (prefix !== '' && !prefixes.includes(prefix)) {
    prefixes.push(prefix);
  }
}

/**
 * Collects naming prefixes that should be applied to scalar columns based on the property chain.
 */
export function collectScalarPrefixes(propertyChain: EntityProperty[]): string[] {
  const prefixes: string[] = [];
  propertyChain.forEach((property) => {
    const candidate = canonicalRoleNamePrefix(property);
    const prefix = candidate === property.metaEdName ? '' : candidate;
    appendUniquePrefix(prefixes, prefix);
  });
  return prefixes;
}

/**
 * Collects naming prefixes that should be applied to reference columns based on the property chain.
 */
export function collectReferencePrefixes(propertyChain: EntityProperty[]): string[] {
  const prefixes: string[] = [];
  propertyChain.forEach((property) => {
    const prefix = canonicalRoleNamePrefix(property);
    appendUniquePrefix(prefixes, prefix);
  });
  return prefixes;
}

/**
 * Produces a prefix for inline properties while ignoring redundant MetaEd name matches.
 */
function inlinePrefix(property: EntityProperty): string {
  const candidate = canonicalRoleNamePrefix(property);
  if (candidate === property.metaEdName) return '';
  return candidate;
}

/**
 * Derives the suffix for a relational table base name by analyzing the property chain that introduces it.
 */
export function deriveRelationalTableSuffix(node: RelationalTableNode): string {
  const { property, propertyChain } = node;
  let suffix = adjustedFullPropertyName(property);

  // Find the closest table-defining ancestor in the chain so we can drop its name if the child repeats it
  // Example: Common Address -> AddressPeriod nested collection
  const parentIndex: number =
    propertyChain
      .slice(0, -1)
      .map((candidate, index) => ({ candidate, index }))
      .reverse()
      .find(({ candidate }) => isRelationalTableProperty(candidate))?.index ?? -1;

  // Trim parent suffix when the child repeats it to avoid redundant prefixes in the final name
  // Example: AddressAddressPeriod -> AddressPeriod
  if (parentIndex !== -1) {
    const parentProperty = propertyChain[parentIndex];
    const parentSuffix = adjustedFullPropertyName(parentProperty);
    if (suffix.startsWith(parentSuffix)) {
      const trimmed = suffix.slice(parentSuffix.length);
      if (trimmed !== '') {
        suffix = trimmed;
      }
    }
  }

  // Re-add naming context from intervening ancestors so inline/choice and collection prefixes still disambiguate names
  // Example: EducationContent.LearningResourceChoice inline common before DerivativeSourceEducationContentSource
  for (let index = propertyChain.length - 2; index > parentIndex; index -= 1) {
    const ancestor = propertyChain[index];

    // Inline/choice containers contribute role-based prefixes when they add context.
    if (ancestor.type === 'inlineCommon' || ancestor.type === 'choice') {
      const prefix = inlinePrefix(ancestor);
      if (prefix !== '' && !suffix.startsWith(prefix)) {
        suffix = `${prefix}${suffix}`;
      }
      // Table-defining ancestors contribute their adjusted names unless already present.
    } else if (isRelationalTableProperty(ancestor)) {
      const ancestorSuffix = adjustedFullPropertyName(ancestor);
      if (!suffix.startsWith(ancestorSuffix)) {
        suffix = `${ancestorSuffix}${suffix}`;
      }
    }
  }

  return suffix;
}
