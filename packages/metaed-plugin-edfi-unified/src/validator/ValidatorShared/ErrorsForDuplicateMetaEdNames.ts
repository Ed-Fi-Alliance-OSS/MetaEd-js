// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ModelBase, TopLevelEntity, ValidationFailure } from '@edfi/metaed-core';
import { groupByMetaEdName } from '../../shared/GroupByMetaEdName';

export function generateValidationErrorsForDuplicates(
  metaEdEntity: ModelBase[],
  validatorName: string,
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  groupByMetaEdName(metaEdEntity).forEach((entities, metaEdName) => {
    if (entities.length > 1) {
      entities.forEach((entity) => {
        failures.push({
          validatorName,
          category: 'error',
          message: `${
            (entity as TopLevelEntity).typeHumanizedName
          } named ${metaEdName} is a duplicate declaration of that name.`,
          sourceMap: (entity as TopLevelEntity).sourceMap.metaEdName,
          fileMap: null,
        });
      });
    }
  });
  return failures;
}
