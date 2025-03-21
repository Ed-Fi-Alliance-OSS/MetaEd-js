// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, EntityProperty, ValidationFailure } from '@edfi/metaed-core';

export function failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty(
  validatorName: string,
  subclassEntity: TopLevelEntity,
  baseEntity: TopLevelEntity | null,
  failures: ValidationFailure[],
) {
  const identityRenames: EntityProperty[] = subclassEntity.properties.filter((x) => x.isIdentityRename);

  identityRenames.forEach((renamedProperty) => {
    if (baseEntity && baseEntity.identityProperties.some((x) => x.metaEdName === renamedProperty.baseKeyName)) return;

    const baseKeyNames: string = identityRenames.map((x) => x.baseKeyName).join(', ');
    failures.push({
      validatorName,
      category: 'error',
      message: `${subclassEntity.typeHumanizedName} ${subclassEntity.metaEdName} based on ${subclassEntity.baseEntityName} tries to rename ${baseKeyNames} which is not part of the identity.`,
      sourceMap: renamedProperty.sourceMap.baseKeyName,
      fileMap: null,
    });
  });
}
