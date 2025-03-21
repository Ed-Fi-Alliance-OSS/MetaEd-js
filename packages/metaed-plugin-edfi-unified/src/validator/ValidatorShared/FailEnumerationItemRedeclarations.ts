// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Descriptor, Enumeration, EnumerationItem, ValidationFailure } from '@edfi/metaed-core';
import { findDuplicates } from './FindDuplicates';

export function failEnumerationItemRedeclarations(
  validatorName: string,
  entity: Descriptor | Enumeration,
  enumerationItems: EnumerationItem[],
  failures: ValidationFailure[],
) {
  const shortDescriptions: string[] = enumerationItems.map((x) => x.shortDescription);
  const duplicates: string[] = findDuplicates(shortDescriptions);

  duplicates.forEach((duplicate) => {
    const enumerationItem = enumerationItems.find((x) => x.shortDescription === duplicate);
    if (enumerationItem == null) return;

    failures.push({
      validatorName,
      category: 'error',
      message: `${entity.typeHumanizedName} ${entity.metaEdName} redeclares item ${duplicate}.`,
      sourceMap: enumerationItem.sourceMap.shortDescription,
      fileMap: null,
    });
  });
}
