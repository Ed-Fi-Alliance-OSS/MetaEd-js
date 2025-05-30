// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domainEntityExtension.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(
          entity.metaEdName,
          entity.baseEntityNamespaceName,
          entity.namespace,
          'domainEntity',
          'domainEntitySubclass',
        ) == null
      ) {
        failures.push({
          validatorName: 'DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass',
          category: 'error',
          message: `Domain Entity additions '${entity.metaEdName}' does not match any declared Domain Entity or Domain Entity Subclass in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
