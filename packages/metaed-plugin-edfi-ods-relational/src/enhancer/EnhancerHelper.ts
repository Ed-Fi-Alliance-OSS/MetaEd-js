import { MetaEdEnvironment, PluginEnvironment, Namespace, MetaEdPropertyPath } from '@edfi/metaed-core';
import { EdFiOdsRelationalEntityRepository } from '../model/EdFiOdsRelationalEntityRepository';
import { Table } from '../model/database/Table';
import { EnumerationRow } from '../model/database/EnumerationRow';
import { SchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';

export function pluginEnvironment(metaEd: MetaEdEnvironment): PluginEnvironment | undefined {
  return metaEd.plugin.get('edfiOdsRelational');
}

export function edfiOdsRepositoryForNamespace(
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): EdFiOdsRelationalEntityRepository | null {
  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd);
  // if plugin not there, something's very wrong
  if (plugin == null) return null;
  const edfiOdsRepository: EdFiOdsRelationalEntityRepository | undefined = plugin.namespace.get(namespace);
  // if repository for namespace not there, something's very wrong
  return edfiOdsRepository == null ? null : edfiOdsRepository;
}

export function tableEntities(metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, Table> {
  const repository: EdFiOdsRelationalEntityRepository | null = edfiOdsRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.table;
}

export function tableEntity(metaEd: MetaEdEnvironment, namespace: Namespace, tableId: string): Table | undefined {
  return tableEntities(metaEd, namespace).get(tableId);
}

export function rowEntities(
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): Map<string, EnumerationRow | SchoolYearEnumerationRow> {
  const repository: EdFiOdsRelationalEntityRepository | null = edfiOdsRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.row;
}

/**
 * Appends the given property's fullname to the current property path.
 */
export function appendToPropertyPath(currentPropertyPath, property): MetaEdPropertyPath {
  return (
    currentPropertyPath === '' ? property.fullPropertyName : `${currentPropertyPath}.${property.fullPropertyName}`
  ) as MetaEdPropertyPath;
}
