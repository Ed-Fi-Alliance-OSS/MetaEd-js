import { EnhancerResult, MetaEdEnvironment, Descriptor, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'DescriptorMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'descriptor') as Descriptor[]).forEach(entity => {
      handbookRepository.handbookEntries.push(createDefaultHandbookEntry(entity, 'Descriptor', 'Descriptor', metaEd));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
