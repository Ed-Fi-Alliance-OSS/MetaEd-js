// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, CommonExtension } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.commonExtension.forEach((commonExtension) => {
      const extendedEntity: CommonExtension | null = getEntityFromNamespaceChain(
        commonExtension.metaEdName,
        commonExtension.baseEntityNamespaceName,
        commonExtension.namespace,
        'common',
      ) as CommonExtension | null;

      if (extendedEntity) {
        failExtensionPropertyRedeclarations(
          'CommonExtensionMustNotRedeclareProperties',
          commonExtension,
          extendedEntity,
          failures,
        );
      }
    });
  });
  return failures;
}
