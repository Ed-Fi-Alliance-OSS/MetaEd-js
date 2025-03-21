// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Subdomain, Domain } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'DomainSubdomainEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'subdomain').forEach((subdomain) => {
    const parentDomain: Domain | null = getEntityFromNamespaceChain(
      (subdomain as Subdomain).parentMetaEdName,
      subdomain.namespace.namespaceName,
      subdomain.namespace,
      'domain',
    ) as Domain | null;

    if (parentDomain) parentDomain.subdomains.push(subdomain as Subdomain);
  });

  getAllEntitiesOfType(metaEd, 'domain').forEach((domain) => {
    (domain as Domain).subdomains.sort((a, b) => a.position - b.position);
  });

  return {
    enhancerName,
    success: true,
  };
}
