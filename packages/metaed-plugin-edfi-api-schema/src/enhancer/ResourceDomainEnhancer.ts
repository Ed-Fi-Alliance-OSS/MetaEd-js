// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  EnhancerResult,
  MetaEdEnvironment,
  Domain,
  Subdomain,
  DomainItem,
  getAllEntitiesOfType,
  NoTopLevelEntity,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { DomainName } from '../model/api-schema/DomainName';

const enhancerName = 'ResourceDomainEnhancer';

/**
 * Collects domain membership information for entities and descriptors by iterating through
 * all domains and subdomains across namespaces, examining their domain items, and adding
 * the domain names to each referenced entity's domains array.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Get all domains and subdomains across all namespaces
  const allDomains: (Domain | Subdomain)[] = getAllEntitiesOfType(metaEd, 'domain', 'subdomain') as (Domain | Subdomain)[];

  // Iterate through all domains and their domain items
  allDomains.forEach((domain: Domain | Subdomain): void => {
    domain.domainItems.forEach((domainItem: DomainItem): void => {
      // Skip if the referenced entity is not available (DS <6 has this issue)
      if (domainItem.referencedEntity === NoTopLevelEntity) return;

      // Get the edfiApiSchema data section for the referenced entity
      const entityApiSchemaData: EntityApiSchemaData | undefined = domainItem.referencedEntity.data
        .edfiApiSchema as EntityApiSchemaData;

      // Add the domain name if it's not already in the list (subdomains can cause duplicates)
      const domainName: DomainName = domain.metaEdName as DomainName;
      if (!entityApiSchemaData.domains.includes(domainName)) {
        entityApiSchemaData.domains.push(domainName);
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
