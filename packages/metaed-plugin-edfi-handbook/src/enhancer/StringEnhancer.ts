import { EnhancerResult, MetaEdEnvironment, StringType, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'StringMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: StringType): string[] {
  const results: string[] = [];
  if (entity.minLength) results.push(`min length: ${entity.minLength}`);
  if (entity.maxLength) results.push(`max length: ${entity.maxLength}`);
  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'stringType') as StringType[]).forEach((entity) => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(entity, 'String', 'String', metaEd),
        typeCharacteristics: getTypeCharacteristicsFor(entity),
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
