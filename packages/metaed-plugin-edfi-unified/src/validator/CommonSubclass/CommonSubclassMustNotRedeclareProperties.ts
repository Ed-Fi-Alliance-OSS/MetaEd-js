// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Common, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.commonSubclass.forEach((commonSubclass) => {
      const extendedEntity: Common | null = getEntityFromNamespaceChain(
        commonSubclass.baseEntityName,
        commonSubclass.baseEntityNamespaceName,
        commonSubclass.namespace,
        'common',
      ) as Common | null;

      if (!extendedEntity) return;
      failExtensionPropertyRedeclarations(
        'CommonSubClassMustNotRedeclareProperties',
        commonSubclass,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
