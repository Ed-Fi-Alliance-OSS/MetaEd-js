// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Interchange, InterchangeItem, ValidationFailure } from '@edfi/metaed-core';
import { findDuplicates } from './FindDuplicates';

export function failInterchangeItemRedeclarations(
  validatorName: string,
  duplicateItemName: string,
  entity: Interchange,
  interchangeItems: InterchangeItem[],
  failures: ValidationFailure[],
) {
  const itemNames: string[] = interchangeItems.map((x) => x.metaEdName);
  const duplicates: string[] = findDuplicates(itemNames);

  duplicates.forEach((duplicate) => {
    const interchangeItem: InterchangeItem | void = interchangeItems.find((x) => x.metaEdName === duplicate);
    if (!interchangeItem) return;

    failures.push({
      validatorName,
      category: 'error',
      message: `Interchange ${entity.metaEdName} redeclares ${duplicateItemName} ${duplicate}.`,
      sourceMap: interchangeItem.sourceMap.metaEdName,
      fileMap: null,
    });
  });
}
