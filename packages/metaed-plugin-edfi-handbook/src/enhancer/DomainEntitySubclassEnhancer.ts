// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, DomainEntitySubclass, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName = 'DomainEntitySubclassMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'domainEntitySubclass') as DomainEntitySubclass[]).forEach((entity) => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(entity, 'Domain Entity Subclass', 'Subclass', metaEd),
        baseMetaEdType: entity.baseEntityName,
        baseEntityUniqueIdentifier: entity.baseEntity ? entity.baseEntityName + entity.baseEntity.entityUuid : '',
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
