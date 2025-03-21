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
        entity.minValue &&
        entity.maxValue &&
        Number.parseInt(entity.minValue, 10) > Number.parseInt(entity.maxValue, 10)
      ) {
        failures.push({
          validatorName: 'SharedDecimalMinValueMustNotBeGreaterThanMaxValue',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has min value greater than max value.`,
          sourceMap: (entity.sourceMap as SharedDecimalSourceMap).minValue,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
