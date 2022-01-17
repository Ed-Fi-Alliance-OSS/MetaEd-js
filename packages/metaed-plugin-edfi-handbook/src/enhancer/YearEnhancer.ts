import { EnhancerResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './XsdBuiltinTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'YearMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.year.forEach((property) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, property.namespace);
    if (handbookRepository == null) return;
    handbookRepository.handbookEntries.push(createDefaultHandbookEntry(property, 'Year', 'Year'));
  });

  return {
    enhancerName,
    success: true,
  };
}
