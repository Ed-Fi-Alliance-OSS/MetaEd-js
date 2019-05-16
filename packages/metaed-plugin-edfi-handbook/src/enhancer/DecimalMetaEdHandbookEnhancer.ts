import { EnhancerResult, MetaEdEnvironment, DecimalType, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeMetaEdHandbookEnhancerBase';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'DecimalMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: DecimalType): string[] {
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
    (getEntitiesOfTypeForNamespaces([namespace], 'decimalType') as DecimalType[]).forEach(entity => {
      handbookRepository.handbookEntries.push(
        Object.assign(createDefaultHandbookEntry(entity, 'Decimal Type', metaEd), {
          typeCharacteristics: getTypeCharacteristicsFor(entity),
        }),
      );
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
