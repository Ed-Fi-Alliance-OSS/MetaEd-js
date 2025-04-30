// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { PropertyModifier, propertyModifierConcat } from '../model/PropertyModifier';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';

/**
 * Adds a parent prefix to the PropertyModifier if the flattenedIdentityProperty has an initial reference property
 * with a role name.
 */
export function parentPropertyModifier(
  flattenedIdentityProperty: FlattenedIdentityProperty,
  propertyModifier: PropertyModifier,
): PropertyModifier {
  if (flattenedIdentityProperty.propertyChain.length > 1 && flattenedIdentityProperty.propertyChain[0].roleName !== '') {
    const propertyContributingPrefix = flattenedIdentityProperty.propertyChain[0];
    // Handle the shortenTo override
    const roleNamePrefix =
      propertyContributingPrefix.shortenTo === ''
        ? propertyContributingPrefix.roleName
        : propertyContributingPrefix.shortenTo;
    return propertyModifierConcat(propertyModifier, {
      optionalDueToParent: false,
      parentPrefixes: [roleNamePrefix],
    });
  }
  return propertyModifier;
}
