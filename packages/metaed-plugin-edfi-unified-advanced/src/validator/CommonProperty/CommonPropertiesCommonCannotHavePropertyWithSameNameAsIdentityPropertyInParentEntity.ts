// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, CommonProperty } from '@edfi/metaed-core';
import { versionSatisfies, V6OrGreater } from '@edfi/metaed-core';

const targetVersions: string = V6OrGreater;

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return failures;
  metaEd.propertyIndex.common.forEach((commonProperty: CommonProperty) => {
    const { parentEntity, referencedEntity } = commonProperty;

    parentEntity.identityProperties.forEach((identityProperty) => {
      referencedEntity.properties.forEach((referencedProperty) => {
        // Match on metaEdName
        if (identityProperty.metaEdName === referencedProperty.metaEdName) {
          const message =
            `The Common entity '${commonProperty.metaEdName}' referenced in '${parentEntity.metaEdName}' ` +
            `cannot declare a property '${referencedProperty.metaEdName}' with the same name as identity property ` +
            `'${identityProperty.metaEdName}' in this entity.`;
          failures.push({
            validatorName: 'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
            category: 'error',
            message,
            sourceMap: commonProperty.sourceMap.metaEdName,
            fileMap: null,
          });
          failures.push({
            validatorName: 'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
            category: 'error',
            message,
            sourceMap: identityProperty.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      });
    });
  });

  return failures;
}
