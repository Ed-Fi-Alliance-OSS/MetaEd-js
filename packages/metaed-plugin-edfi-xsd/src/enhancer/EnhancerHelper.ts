import { MetaEdEnvironment, PluginEnvironment, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';

export function pluginEnvironment(metaEd: MetaEdEnvironment): PluginEnvironment | undefined {
  return metaEd.plugin.get('edfiXsd') as PluginEnvironment | undefined;
}

export function edfiXsdRepositoryForNamespace(
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): EdFiXsdEntityRepository | null {
  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd);
  // if plugin not there, something's very wrong
  if (plugin == null) return null;
  const edfiXsdRepository: EdFiXsdEntityRepository | null = plugin.namespace.get(namespace);
  // if repository for namespace not there, something's very wrong
  return edfiXsdRepository == null ? null : edfiXsdRepository;
}
