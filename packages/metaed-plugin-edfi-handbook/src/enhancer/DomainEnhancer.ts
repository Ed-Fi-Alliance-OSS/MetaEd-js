// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';
import { HandbookEntry } from '../model/HandbookEntry';

const enhancerName = 'DomainMetaEdHandbookEnhancer';

function getEntityDomains(entity: HandbookEntry, namespace: Namespace): string[] {
  const domains: Set<string> = new Set<string>();

  namespace.entity.domain.forEach((domain) => {
    if (domain.entities.find((e) => e.entityUuid === entity.entityUuid)) {
      domains.add(domain.metaEdName);
    }

    // When an entity is assigned to a subdomain, we also want to include the parent domain
    // TODO: Remove this once DATASTD-2451 is resolved
    domain.subdomains.forEach((subdomain) => {
      if (subdomain.entities.find((e) => e.entityUuid === entity.entityUuid)) {
        domains.add(domain.metaEdName);
      }
    });
  });

  return [...domains];
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;

    handbookRepository.handbookEntries.forEach((handbookEntry) => {
      handbookEntry.domains = getEntityDomains(handbookEntry, namespace);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
