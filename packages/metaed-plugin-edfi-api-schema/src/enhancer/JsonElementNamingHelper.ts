// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { PropertyModifier, propertyModifierConcat } from '../model/PropertyModifier';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';

/**
 * Adds a parent prefix to the PropertyModifier if the flattenedIdentityProperty has a reference property
 * with a role name in the next-to-last position in the property chain.
 */
export function parentPropertyModifier(
  flattenedIdentityProperty: FlattenedIdentityProperty,
  propertyModifier: PropertyModifier,
): PropertyModifier {
  if (flattenedIdentityProperty.propertyChain.length > 1) {
    const nextToLastChainProperty = flattenedIdentityProperty.propertyChain.at(-2);
    if (nextToLastChainProperty == null) return propertyModifier; // Should never happen given length check

    // Handle the shortenTo override
    const roleNamePrefix =
      nextToLastChainProperty.shortenTo === '' ? nextToLastChainProperty.roleName : nextToLastChainProperty.shortenTo;
    return propertyModifierConcat(propertyModifier, {
      optionalDueToParent: false,
      parentPrefixes: [roleNamePrefix],
    });
  }
  return propertyModifier;
}
