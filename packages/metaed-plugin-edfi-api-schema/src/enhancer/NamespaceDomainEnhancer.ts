// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { DomainName } from '../model/api-schema/DomainName';

const enhancerName = 'NamespaceDomainEnhancer';

/**
 * Collects all domain names within each namespace and adds them to the namespace's
 * edfiApiSchema data. This enhancer iterates through each namespace's domain entities
 * and aggregates their metaEdNames into an array for inclusion in the API schema.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace): void => {
    const namespaceApiSchemaData: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;

    // Collect all domain names from the namespace's domain entities
    const domainNames: DomainName[] = Array.from(namespace.entity.domain.values()).map(
      (domain) => domain.metaEdName as DomainName,
    );

    namespaceApiSchemaData.domains = domainNames;
  });

  return {
    enhancerName,
    success: true,
  };
}
