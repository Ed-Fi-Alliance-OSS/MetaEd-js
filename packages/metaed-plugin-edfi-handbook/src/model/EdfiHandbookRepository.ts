// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newPluginEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { HandbookEntry } from './HandbookEntry';

export interface EdfiHandbookRepository {
  handbookEntries: HandbookEntry[];
}
const enhancerName = 'EdfiHandbookRepositorySetupEnhancer';

export function newEdfiHandbookRepository(): EdfiHandbookRepository {
  return {
    handbookEntries: [],
  };
}

export function addEdfiHandbookRepositoryTo(metaEd: MetaEdEnvironment) {
  const namespaces: Map<Namespace, EdfiHandbookRepository> = new Map();
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespaces.set(namespace, newEdfiHandbookRepository());
  });

  const edfiHandbookPlugin = metaEd.plugin.get('edfiHandbook');
  if (edfiHandbookPlugin == null) {
    metaEd.plugin.set('edfiHandbook', { ...newPluginEnvironment(), shortName: 'edfiHandbook', namespace: namespaces });
  } else {
    edfiHandbookPlugin.namespace = namespaces;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdfiHandbookRepositoryTo(metaEd);
  return {
    enhancerName,
    success: true,
  };
}
