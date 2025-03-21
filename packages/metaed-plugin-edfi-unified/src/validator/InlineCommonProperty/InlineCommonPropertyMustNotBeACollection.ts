// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.inlineCommon.forEach((property) => {
    if (property.isRequiredCollection || property.isOptionalCollection) {
      failures.push({
        validatorName: 'InlineCommonPropertyMustNotBeACollection',
        category: 'error',
        message: `Inline Common property '${property.metaEdName}' is not allowed to be a collection`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
