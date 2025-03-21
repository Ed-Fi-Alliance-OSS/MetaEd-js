// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, Domain, Subdomain } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain, topLevelCoreEntityModelTypes } from '@edfi/metaed-core';

const enhancerName = 'DomainBaseEntityEnhancer';

type DomainBase = Domain | Subdomain;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domain', 'subdomain').forEach((entity) => {
    (entity as DomainBase).domainItems.forEach((domainItem) => {
      const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        domainItem.metaEdName,
        domainItem.referencedNamespaceName,
        domainItem.namespace,
        ...topLevelCoreEntityModelTypes,
      ) as TopLevelEntity | null;

      if (referencedEntity) {
        (entity as DomainBase).entities.push(referencedEntity);
        domainItem.referencedEntity = referencedEntity;
        domainItem.referencedEntityDeprecated = referencedEntity.isDeprecated;
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
