// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, DecimalType, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'DecimalMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: DecimalType): string[] {
  const results: string[] = [];
  if (entity.totalDigits) results.push(`total digits: ${entity.totalDigits}`);
  if (entity.decimalPlaces) results.push(`decimal places: ${entity.decimalPlaces}`);

  if (entity.minValue) results.push(`min value: ${entity.minValue}`);
  if (entity.maxValue) results.push(`max value: ${entity.maxValue}`);

  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'decimalType') as DecimalType[]).forEach((decimalType) => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(decimalType, 'Decimal', 'Number', metaEd),
        typeCharacteristics: getTypeCharacteristicsFor(decimalType),
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
