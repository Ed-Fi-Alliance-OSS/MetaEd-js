// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace, TopLevelEntity } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domainEntitySubclass.forEach((domainEntitySubclass) => {
      if (!domainEntitySubclass.identityProperties.some((x) => x.isIdentityRename)) return;
      const baseEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        domainEntitySubclass.baseEntityName,
        domainEntitySubclass.baseEntityNamespaceName,
        domainEntitySubclass.namespace,
        'domainEntity',
      ) as TopLevelEntity | null;
      if (baseEntity && baseEntity.identityProperties.length <= 1) return;

      failures.push({
        validatorName: 'DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity',
        category: 'error',
        message: `${domainEntitySubclass.typeHumanizedName} ${domainEntitySubclass.metaEdName} based on ${domainEntitySubclass.baseEntityName} is invalid for identity rename because parent entity ${domainEntitySubclass.baseEntityName} has more than one identity property.`,
        sourceMap: domainEntitySubclass.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
