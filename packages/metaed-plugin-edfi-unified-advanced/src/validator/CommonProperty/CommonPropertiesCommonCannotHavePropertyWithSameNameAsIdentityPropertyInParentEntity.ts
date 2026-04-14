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
        if (identityProperty.fullPropertyName === referencedProperty.fullPropertyName) {
          failures.push({
            validatorName: 'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
            category: 'error',
            message: `This Common has a property '${referencedProperty.metaEdName}' with the same name as an identity property on this entity, which is not allowed. Options include renaming, role naming, or changing identity status.`,
            sourceMap: commonProperty.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      });
    });
  });

  return failures;
}
