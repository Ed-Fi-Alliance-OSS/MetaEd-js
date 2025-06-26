// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ShortProperty, ShortPropertySourceMap, MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.short.forEach((short) => {
    const shortProperty: ShortProperty = short as ShortProperty;
    const minValue: number = Number.parseInt(shortProperty.minValue || '0', 10);
    const maxValue: number = Number.parseInt(shortProperty.maxValue || '0', 10);
    if (minValue <= maxValue) return;

    failures.push({
      validatorName: 'ShortPropertyMinValueMustNotBeGreaterThanMaxValue',
      category: 'error',
      message: `Short Property ${short.metaEdName} has min value greater than max value.`,
      sourceMap: (short.sourceMap as ShortPropertySourceMap).minValue,
      fileMap: null,
    });
  });

  return failures;
}
