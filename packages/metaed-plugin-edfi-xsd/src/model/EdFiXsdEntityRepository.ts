// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newPluginEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { MergedInterchange } from './MergedInterchange';

export interface EdFiXsdEntityRepository {
  mergedInterchange: Map<string, MergedInterchange>;
  hasDuplicateEntityNameInDependencyNamespace: boolean;
}

const enhancerName = 'EdFiXsdEntityRepositorySetupEnhancer';

export function newEdFiXsdEntityRepository(): EdFiXsdEntityRepository {
  return {
    mergedInterchange: new Map(),
    hasDuplicateEntityNameInDependencyNamespace: false,
  };
}

export function addEdFiXsdEntityRepositoryTo(metaEd: MetaEdEnvironment) {
  const namespaces: Map<Namespace, EdFiXsdEntityRepository> = new Map();
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespaces.set(namespace, newEdFiXsdEntityRepository());
  });

  const edfiXsdPlugin = metaEd.plugin.get('edfiXsd');
  if (edfiXsdPlugin == null) {
    metaEd.plugin.set('edfiXsd', { ...newPluginEnvironment(), namespace: namespaces });
  } else {
    edfiXsdPlugin.namespace = namespaces;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdFiXsdEntityRepositoryTo(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
