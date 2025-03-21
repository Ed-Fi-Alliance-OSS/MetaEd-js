// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newPluginEnvironment } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EnumerationRow } from './database/EnumerationRow';
import { SchoolYearEnumerationRow } from './database/SchoolYearEnumerationRow';
import { Table } from './database/Table';

export interface EdFiOdsRelationalEntityRepository {
  /** A mapping from tableId to Table object for all tables in the repository */
  table: Map<string, Table>;
  row: Map<string, EnumerationRow | SchoolYearEnumerationRow>;
}

const enhancerName = 'EdFiOdsRelationalEntityRepositorySetupEnhancer';

export function newEdFiOdsRelationalEntityRepository(): EdFiOdsRelationalEntityRepository {
  return {
    table: new Map(),
    row: new Map(),
  };
}

export function addEdFiOdsRelationalEntityRepositoryTo(metaEd: MetaEdEnvironment) {
  const namespaces: Map<Namespace, EdFiOdsRelationalEntityRepository> = new Map();
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespaces.set(namespace, newEdFiOdsRelationalEntityRepository());
  });

  const edfiOdsPlugin = metaEd.plugin.get('edfiOdsRelational');
  if (edfiOdsPlugin == null) {
    metaEd.plugin.set('edfiOdsRelational', {
      ...newPluginEnvironment(),
      shortName: 'edfiOdsRelational',
      namespace: namespaces,
    });
  } else {
    edfiOdsPlugin.namespace = namespaces;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdFiOdsRelationalEntityRepositoryTo(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
