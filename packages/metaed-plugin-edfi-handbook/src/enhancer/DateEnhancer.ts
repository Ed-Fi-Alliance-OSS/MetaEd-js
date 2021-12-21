import { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { createDefaultHandbookEntry } from './XsdBuiltinTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'DateMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.date.forEach((property) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, property.namespace);
    if (handbookRepository == null) return;
    handbookRepository.handbookEntries.push(createDefaultHandbookEntry(property, 'Date', 'Date'));
  });

  return {
    enhancerName,
    success: true,
  };
}
