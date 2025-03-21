// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { generateValidationErrorsForDuplicates } from '../ValidatorShared/ErrorsForDuplicateMetaEdNames';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    failures.push(
      ...generateValidationErrorsForDuplicates(
        getEntitiesOfTypeForNamespaces([namespace], 'domainEntityExtension'),
        'DomainEntityExtensionNamesMustBeUnique',
      ),
    );
  });

  return failures;
}
