// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DecimalProperty, MetaEdEnvironment, ValidationFailure, DecimalPropertySourceMap } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.decimal.forEach((decimal) => {
    const decimalProperty: DecimalProperty = decimal as DecimalProperty;
    const decimalPlaces: number = Number.parseInt(decimalProperty.decimalPlaces, 10);
    const totalDigits: number = Number.parseInt(decimalProperty.totalDigits, 10);
    if (decimalPlaces <= totalDigits) return;

    failures.push({
      validatorName: 'DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits',
      category: 'error',
      message: `${decimal.type} ${decimal.metaEdName} has decimal places greater than total digits.`,
      sourceMap: (decimal.sourceMap as DecimalPropertySourceMap).decimalPlaces,
      fileMap: null,
    });
  });
  return failures;
}
