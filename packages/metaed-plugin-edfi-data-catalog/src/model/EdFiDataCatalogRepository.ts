// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newPluginEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { CatalogEntry } from './CatalogEntry';

export interface EdFiDataCatalogRepository {
  handbookEntries: CatalogEntry[];
}
const enhancerName = 'EdFiDataCatalogRepositorySetupEnhancer';

export function newEdFiDataCatalogRepository(): EdFiDataCatalogRepository {
  return {
    handbookEntries: [],
  };
}

export function addEdFiDataCatalogRepositoryTo(metaEd: MetaEdEnvironment) {
  const namespaces: Map<Namespace, EdFiDataCatalogRepository> = new Map();
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespaces.set(namespace, newEdFiDataCatalogRepository());
  });

  const edfiHandbookPlugin = metaEd.plugin.get('edfiDataCatalog');
  if (edfiHandbookPlugin == null) {
    metaEd.plugin.set('edfiDataCatalog', { ...newPluginEnvironment(), shortName: 'edfiDataCatalog', namespace: namespaces });
  } else {
    edfiHandbookPlugin.namespace = namespaces;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdFiDataCatalogRepositoryTo(metaEd);
  return {
    enhancerName,
    success: true,
  };
}
