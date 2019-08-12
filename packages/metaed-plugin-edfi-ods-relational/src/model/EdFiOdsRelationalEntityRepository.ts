import { newPluginEnvironment } from 'metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import { EnumerationRow } from './database/EnumerationRow';
import { SchoolYearEnumerationRow } from './database/SchoolYearEnumerationRow';
import { Table } from './database/Table';

export interface EdFiOdsRelationalEntityRepository {
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

  const edfiOdsPlugin = metaEd.plugin.get('edfiOds');
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
