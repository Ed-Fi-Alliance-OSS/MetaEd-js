// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, Namespace, EnhancerResult } from '@edfi/metaed-core';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'BaseDescriptorAggregateEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (!coreNamespace) return { enhancerName, success: false };

  const aggregate: Aggregate = {
    root: 'Descriptor',
    schema: 'edfi',
    allowPrimaryKeyUpdates: false,
    isExtension: false,
    entityTables: [
      {
        table: 'Descriptor',
        isA: null,
        isAbstract: true,
        isRequiredCollection: false,
        schema: coreNamespace.namespaceName.toLowerCase(),
        hasIsA: false,
        requiresSchema: false,
      },
    ],
  };

  (coreNamespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.push(aggregate);
  return {
    enhancerName,
    success: true,
  };
}
