// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Interchange, ValidationFailure } from '@edfi/metaed-core';

export function failInterchangeExtensionPropertyRedeclarations(
  validatorName: string,
  interchangeItemType: 'elements' | 'identityTemplates',
  extensionEntity: Interchange,
  baseEntity: Interchange,
  failures: ValidationFailure[],
) {
  extensionEntity[interchangeItemType].forEach((extensionItem) => {
    baseEntity[interchangeItemType].forEach((baseItem) => {
      if (extensionItem.metaEdName !== baseItem.metaEdName) return;
      failures.push({
        validatorName,
        category: 'error',
        message: `Interchange additions ${extensionEntity.metaEdName} redeclares property ${extensionItem.metaEdName} of base Interchange.`,
        sourceMap: extensionItem.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
}
