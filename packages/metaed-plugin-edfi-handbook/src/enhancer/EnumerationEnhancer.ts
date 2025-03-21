// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Enumeration, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'EnumerationMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;

    (getEntitiesOfTypeForNamespaces([namespace], 'enumeration') as Enumeration[]).forEach((entity) => {
      handbookRepository.handbookEntries.push(createDefaultHandbookEntry(entity, 'Enumeration', 'Enumeration', metaEd));
    });

    (getEntitiesOfTypeForNamespaces([namespace], 'mapTypeEnumeration') as Enumeration[]).forEach((entity) => {
      handbookRepository.handbookEntries.push(createDefaultHandbookEntry(entity, 'Enumeration', 'Enumeration', metaEd));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
