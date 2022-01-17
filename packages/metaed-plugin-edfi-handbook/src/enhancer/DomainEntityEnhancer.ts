import { EnhancerResult, MetaEdEnvironment, DomainEntity, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'DomainEntityMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'domainEntity') as DomainEntity[]).forEach((entity) => {
      handbookRepository.handbookEntries.push(createDefaultHandbookEntry(entity, 'Domain Entity', 'Class', metaEd));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
