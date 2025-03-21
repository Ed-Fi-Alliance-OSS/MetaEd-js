// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, SharedStringSourceMap, Namespace } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.sharedString.forEach((entity) => {
      if (
        entity.minLength &&
        entity.maxLength &&
        Number.parseInt(entity.minLength, 10) > Number.parseInt(entity.maxLength, 10)
      ) {
        failures.push({
          validatorName: 'SharedStringMinLengthMustNotBeGreaterThanMaxLength',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has min length greater than max length.`,
          sourceMap: (entity.sourceMap as SharedStringSourceMap).minLength,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
