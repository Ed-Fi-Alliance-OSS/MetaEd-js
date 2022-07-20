import { EnhancerResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { ColumnDataTypes } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { createDefaultHandbookEntry } from './XsdBuiltinTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'BooleanMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.boolean.forEach((property) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, property.namespace);
    if (handbookRepository == null) return;
    handbookRepository.handbookEntries.push(
      createDefaultHandbookEntry(property, 'Boolean', 'Boolean', ColumnDataTypes.boolean),
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
