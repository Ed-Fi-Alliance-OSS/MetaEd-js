// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.commonSubclass.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(entity.baseEntityName, entity.baseEntityNamespaceName, entity.namespace, 'common') ==
        null
      ) {
        failures.push({
          validatorName: 'CommonSubclassIdentifierMustMatchAnCommon',
          category: 'error',
          message: `Common ${entity.metaEdName} based on ${entity.baseEntityName} does not match any declared Common in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
