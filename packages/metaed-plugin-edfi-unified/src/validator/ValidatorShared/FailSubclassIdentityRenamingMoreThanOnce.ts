// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, EntityProperty, ValidationFailure } from '@edfi/metaed-core';

export function failSubclassIdentityRenamingMoreThanOnce(
  validatorName: string,
  subclassEntity: TopLevelEntity,
  failures: ValidationFailure[],
) {
  const identityRenames: EntityProperty[] = subclassEntity.properties.filter((x) => x.isIdentityRename === true);
  if (identityRenames.length <= 1) return;

  const baseKeyNames: string = identityRenames.map((x) => x.baseKeyName).join(', ');
  identityRenames.forEach((identityRename) => {
    failures.push({
      validatorName,
      category: 'error',
      message: `${subclassEntity.typeHumanizedName} ${subclassEntity.metaEdName} based on ${subclassEntity.baseEntityName} tries to rename properties ${baseKeyNames}. Only one identity rename is allowed for a given ${subclassEntity.typeHumanizedName}.`,
      sourceMap: identityRename.sourceMap.baseKeyName,
      fileMap: null,
    });
  });
}
