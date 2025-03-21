// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { failEnumerationItemRedeclarations } from '../ValidatorShared/FailEnumerationItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.enumeration.forEach((enumeration) => {
      if (enumeration.enumerationItems.length > 1) {
        failEnumerationItemRedeclarations(
          'EnumerationItemsMustBeUnique',
          enumeration,
          enumeration.enumerationItems,
          failures,
        );
      }
    });
  });

  return failures;
}
