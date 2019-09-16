import { EnhancerResult, MetaEdEnvironment, AssociationSubclass, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName = 'AssociationSubclassMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'associationSubclass') as AssociationSubclass[]).forEach(entity => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(entity, '', metaEd),
        entityType: entity.metaEdName,
        baseEntityType: entity.baseEntityName,
        baseEntityUniqueIdentifier: entity.baseEntity ? entity.baseEntityName + entity.baseEntity.metaEdId : '',
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
