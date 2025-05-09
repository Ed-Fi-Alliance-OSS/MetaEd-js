// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Association, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty } from '../ValidatorShared/FailSubclassIdentityRenameNotMatchingBaseClassIdentityProperty';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.associationSubclass.forEach((associationSubclass) => {
      const extendedEntity: Association | null = getEntityFromNamespaceChain(
        associationSubclass.baseEntityName,
        associationSubclass.baseEntityNamespaceName,
        associationSubclass.namespace,
        'association',
      ) as Association | null;

      failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty(
        'AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass',
        associationSubclass,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
