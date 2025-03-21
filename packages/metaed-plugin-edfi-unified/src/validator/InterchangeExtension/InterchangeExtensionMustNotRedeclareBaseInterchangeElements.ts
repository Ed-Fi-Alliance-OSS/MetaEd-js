// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Interchange, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failInterchangeExtensionPropertyRedeclarations } from '../ValidatorShared/FailInterchangeExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.interchangeExtension.forEach((interchangeExtension) => {
      const extendedEntity: Interchange | null = getEntityFromNamespaceChain(
        interchangeExtension.baseEntityName,
        interchangeExtension.baseEntityNamespaceName,
        namespace,
        'interchange',
      ) as Interchange | null;

      if (extendedEntity == null) return;

      failInterchangeExtensionPropertyRedeclarations(
        'InterchangeExtensionMustNotRedeclareBaseInterchangeElements',
        'elements',
        interchangeExtension,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
