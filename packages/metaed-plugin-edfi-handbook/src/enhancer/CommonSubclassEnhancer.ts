import { EnhancerResult, MetaEdEnvironment, CommonSubclass, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName = 'CommonSubclassMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'commonSubclass') as CommonSubclass[]).forEach((entity) => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(entity, 'Common Subclass', 'Composite Part', metaEd),
        baseMetaEdType: entity.baseEntityName,
        baseEntityUniqueIdentifier: entity.baseEntity ? entity.baseEntityName + entity.baseEntity.metaEdId : '',
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
