// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, StringProperty, StringPropertySourceMap } from '@edfi/metaed-core';
import { asStringProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.string.forEach((string) => {
    const stringProperty: StringProperty = asStringProperty(string);
    const minLength: number = Number.parseInt(stringProperty.minLength || '0', 10);
    const maxLength: number = Number.parseInt(stringProperty.maxLength || '0', 10);
    if (minLength <= maxLength) return;

    failures.push({
      validatorName: 'StringPropertyMinLengthMustNotBeGreaterThanMaxLength',
      category: 'error',
      message: `String Property ${string.metaEdName} has min length greater than max length.`,
      sourceMap: (string.sourceMap as StringPropertySourceMap).minLength,
      fileMap: null,
    });
  });

  return failures;
}
