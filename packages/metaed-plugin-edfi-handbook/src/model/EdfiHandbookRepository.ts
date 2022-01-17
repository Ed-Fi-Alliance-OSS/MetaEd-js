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
