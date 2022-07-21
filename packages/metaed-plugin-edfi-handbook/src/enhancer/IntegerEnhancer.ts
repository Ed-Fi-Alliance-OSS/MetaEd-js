import { EnhancerResult, MetaEdEnvironment, IntegerType, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'IntegerMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: IntegerType): string[] {
  const results: string[] = [];
  if (entity.minValue) results.push(`min value: ${entity.minValue}`);
  if (entity.maxValue) results.push(`max value: ${entity.maxValue}`);

  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'integerType') as IntegerType[]).forEach((integerType) => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(integerType, integerType.isShort ? 'Short' : 'Integer', 'Number', metaEd),
        typeCharacteristics: getTypeCharacteristicsFor(integerType),
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
