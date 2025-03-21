// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntityExtension.forEach((entity) => {
      if (entity.baseEntityNamespaceName === namespace.namespaceName) {
        failures.push({
          validatorName: 'DomainEntityExtensionMustNotBeInSameNamespaceAsBase',
          category: 'error',
          message: `Domain Entity additions '${entity.metaEdName}' cannot be in the same namespace as its base entity.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
