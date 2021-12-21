import { EnhancerResult, MetaEdEnvironment, Enumeration, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'EnumerationMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;

    (getEntitiesOfTypeForNamespaces([namespace], 'enumeration') as Enumeration[]).forEach((entity) => {
      handbookRepository.handbookEntries.push(createDefaultHandbookEntry(entity, 'Enumeration', 'Enumeration', metaEd));
    });

    (getEntitiesOfTypeForNamespaces([namespace], 'mapTypeEnumeration') as Enumeration[]).forEach((entity) => {
      handbookRepository.handbookEntries.push(createDefaultHandbookEntry(entity, 'Enumeration', 'Enumeration', metaEd));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
