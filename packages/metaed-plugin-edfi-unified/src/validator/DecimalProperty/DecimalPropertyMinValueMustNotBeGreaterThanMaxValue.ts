// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DecimalProperty, MetaEdEnvironment, ValidationFailure, DecimalPropertySourceMap } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.decimal.forEach((decimal) => {
    const decimalProperty: DecimalProperty = decimal as DecimalProperty;
    const minValue: number = Number.parseInt(decimalProperty.minValue || '0', 10);
    const maxValue: number = Number.parseInt(decimalProperty.maxValue || '0', 10);
    if (minValue <= maxValue) return;

    failures.push({
      validatorName: 'DecimalPropertyMinValueMustNotBeGreaterThanMaxValue',
      category: 'error',
      message: `${decimal.type} ${decimal.metaEdName} has min value greater than max value.`,
      sourceMap: (decimal.sourceMap as DecimalPropertySourceMap).minValue,
      fileMap: null,
    });
  });
  return failures;
}
