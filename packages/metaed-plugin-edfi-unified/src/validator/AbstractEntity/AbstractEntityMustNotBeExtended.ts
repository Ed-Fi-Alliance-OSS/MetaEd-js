// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  getEntityFromNamespaceChain,
  DomainEntity,
  MetaEdEnvironment,
  ValidationFailure,
  DomainEntityExtension,
  TopLevelEntity,
} from '@edfi/metaed-core';

// METAED-805
const validatorName = 'AbstractEntityMustNotBeExtended';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntityExtension.forEach((extensionEntity: DomainEntityExtension) => {
      const baseEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        extensionEntity.metaEdName,
        extensionEntity.baseEntityNamespaceName,
        namespace,
        'domainEntity',
      ) as TopLevelEntity | null;

      if (baseEntity == null || !(baseEntity as DomainEntity).isAbstract) return;

      failures.push({
        validatorName,
        category: 'error',
        message: `${baseEntity.typeHumanizedName} ${baseEntity.metaEdName} additions is not valid.  Abstract entities cannot be extended.`,
        sourceMap: extensionEntity.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });

  return failures;
}
