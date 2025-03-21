// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { edfiXsdRepositoryForNamespace } from './EnhancerHelper';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';

const enhancerName = 'MergedInterchangeAdditionalPropertiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) return;

    Array.from(edFiXsdEntityRepository.mergedInterchange.values()).forEach((mergedInterchange) => {
      mergedInterchange.interchangeName = `Interchange${mergedInterchange.metaEdName}`;
      mergedInterchange.schemaLocation = mergedInterchange.namespace.isExtension
        ? `${mergedInterchange.namespace.projectExtension}-Ed-Fi-Extended-Core.xsd`
        : 'Ed-Fi-Core.xsd';
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
