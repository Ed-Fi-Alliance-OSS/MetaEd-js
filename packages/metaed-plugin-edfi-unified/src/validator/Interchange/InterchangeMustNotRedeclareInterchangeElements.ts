// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { failInterchangeItemRedeclarations } from '../ValidatorShared/FailInterchangeItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.interchange.forEach((interchange) => {
      if (interchange.elements.length === 0) return;
      failInterchangeItemRedeclarations(
        'InterchangeMustNotRedeclareInterchangeElements',
        'interchange element',
        interchange,
        interchange.elements,
        failures,
      );
    });
  });
  return failures;
}
