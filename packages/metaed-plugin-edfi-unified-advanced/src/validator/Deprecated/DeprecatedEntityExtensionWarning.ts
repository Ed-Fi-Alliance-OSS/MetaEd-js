// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, getAllEntitiesOfType, ValidationFailure, ModelBase, TopLevelEntity } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllEntitiesOfType(metaEd, 'associationExtension', 'commonExtension', 'domainEntityExtension').forEach(
    (entity: ModelBase) => {
      const { baseEntity } = entity as TopLevelEntity;
      if (baseEntity !== null && baseEntity.isDeprecated) {
        failures.push({
          validatorName: 'DeprecatedEntityExtensionWarning',
          category: 'warning',
          message: `${entity.metaEdName} is an extension of deprecated entity ${baseEntity.metaEdName}.`,
          sourceMap: (entity as TopLevelEntity).sourceMap.metaEdName,
          fileMap: null,
        });
      }
    },
  );
  return failures;
}
