// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, EntityProperty, getAllProperties } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    if (!property.isIdentityRename) return;
    if (property.parentEntity.baseEntity == null) return;
    const baseProperty: EntityProperty | undefined = property.parentEntity.baseEntity.properties.find(
      (p) => p.metaEdName === property.baseKeyName,
    );
    if (baseProperty == null) {
      failures.push({
        validatorName: 'IdentityRenameTypeMustMatchBaseProperty',
        category: 'error',
        message: `'renames identity property' is invalid for property ${property.metaEdName} on ${property.parentEntity.typeHumanizedName} ${property.parentEntity.metaEdName}. 'renames identity property' must match name of property on the base entity.`,
        sourceMap: property.sourceMap.baseKeyName,
        fileMap: null,
      });
      return;
    }
    if (baseProperty.type !== property.type) {
      failures.push({
        validatorName: 'IdentityRenameTypeMustMatchBaseProperty',
        category: 'error',
        message: `'renames identity property' is invalid for property ${property.metaEdName} on ${property.parentEntity.typeHumanizedName} ${property.parentEntity.metaEdName}. 'renames identity property' must match type of property on the base entity.`,
        sourceMap: property.sourceMap.baseKeyName,
        fileMap: null,
      });
    }
  });

  return failures;
}
