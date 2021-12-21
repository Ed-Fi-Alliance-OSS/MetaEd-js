import { EnhancerResult, MetaEdEnvironment, Choice, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'ChoiceMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'choice') as Choice[]).forEach((entity) => {
      const handbookEntry = createDefaultHandbookEntry(entity, 'Choice', 'Composite Part', metaEd);
      handbookEntry.showIdentityColumn = false;
      handbookRepository.handbookEntries.push(handbookEntry);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
