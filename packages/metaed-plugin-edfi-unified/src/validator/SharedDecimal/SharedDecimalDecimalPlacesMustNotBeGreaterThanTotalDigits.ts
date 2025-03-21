// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, SharedDecimalSourceMap, Namespace } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.sharedDecimal.forEach((entity) => {
      if (
        entity.decimalPlaces &&
        entity.totalDigits &&
        Number.parseInt(entity.decimalPlaces, 10) > Number.parseInt(entity.totalDigits, 10)
      ) {
        failures.push({
          validatorName: 'SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has decimal places greater than total digits.`,
          sourceMap: (entity.sourceMap as SharedDecimalSourceMap).decimalPlaces,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
