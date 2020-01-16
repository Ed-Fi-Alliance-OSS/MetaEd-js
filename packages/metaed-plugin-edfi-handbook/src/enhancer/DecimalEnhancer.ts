import { EnhancerResult, MetaEdEnvironment, SharedDecimal, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'DecimalMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: SharedDecimal): string[] {
  const results: string[] = [];
  if (entity.totalDigits) results.push(`total digits: ${entity.totalDigits}`);
  if (entity.decimalPlaces) results.push(`decimal places: ${entity.decimalPlaces}`);

  if (entity.minValue) results.push(`min value: ${entity.minValue}`);
  if (entity.maxValue) results.push(`max value: ${entity.maxValue}`);

  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    (getEntitiesOfTypeForNamespaces([namespace], 'sharedDecimal') as SharedDecimal[]).forEach(entity => {
      handbookRepository.handbookEntries.push({
        ...createDefaultHandbookEntry(entity, 'Decimal', 'Number', metaEd),
        typeCharacteristics: getTypeCharacteristicsFor(entity),
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
