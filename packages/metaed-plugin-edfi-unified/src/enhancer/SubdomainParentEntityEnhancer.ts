// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Subdomain, Domain } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'SubdomainParentEntityEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'subdomain') as Subdomain[]).forEach((childEntity) => {
    const parent: Domain | null = getEntityFromNamespaceChain(
      childEntity.parentMetaEdName,
      childEntity.namespace.namespaceName,
      childEntity.namespace,
      'domain',
    ) as Domain | null;

    if (parent) childEntity.parent = parent;
  });

  return {
    enhancerName,
    success: true,
  };
}
