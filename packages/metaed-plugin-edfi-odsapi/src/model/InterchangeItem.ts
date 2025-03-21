// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, InterchangeItem, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from '@edfi/metaed-plugin-edfi-xsd';

export interface InterchangeItemEdfiOdsApi extends InterchangeItem {
  globalDependencyOrder: number;
}

const enhancerName = 'InterchangeItemSetupEnhancer';

export function addInterchangeItemEdfiOdsApiTo(interchangeItem: InterchangeItem) {
  if (interchangeItem.data.edfiOdsApi == null) interchangeItem.data.edfiOdsApi = {};

  Object.assign(interchangeItem.data.edfiOdsApi, {
    globalDependencyOrder: 0,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const edfiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edfiXsdEntityRepository == null) return;

    edfiXsdEntityRepository.mergedInterchange.forEach((mergedInterchange: MergedInterchange) => {
      mergedInterchange.elements.forEach((interchangeItem: InterchangeItem) => {
        addInterchangeItemEdfiOdsApiTo(interchangeItem);
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
