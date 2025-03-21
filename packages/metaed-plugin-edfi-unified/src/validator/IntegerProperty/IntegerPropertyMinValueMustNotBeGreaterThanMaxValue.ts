// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { IntegerProperty, IntegerPropertySourceMap, MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { asIntegerProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.integer.forEach((integer) => {
    const integerProperty: IntegerProperty = asIntegerProperty(integer);
    const minValue: number = Number.parseInt(integerProperty.minValue || '0', 10);
    const maxValue: number = Number.parseInt(integerProperty.maxValue || '0', 10);
    if (minValue <= maxValue) return;

    failures.push({
      validatorName: 'IntegerPropertyMinValueMustNotBeGreaterThanMaxValue',
      category: 'error',
      message: `${integer.type} ${integer.metaEdName} has min value greater than max value.`,
      sourceMap: (integer.sourceMap as IntegerPropertySourceMap).minValue,
      fileMap: null,
    });
  });
  return failures;
}
