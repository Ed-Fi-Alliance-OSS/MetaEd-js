import { randomUUID } from 'node:crypto';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { ColumnDataTypes } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { createDefaultHandbookEntry } from './BaseSimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'CurrencyMetaEdHandbookEnhancer';
const currencyName = 'Currency';
const currencyDocumentation = 'U.S. currency in dollars and cents.';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, coreNamespace);
  if (handbookRepository == null) return { enhancerName, success: false };

  handbookRepository.handbookEntries.push(
    createDefaultHandbookEntry({
      entityUuid: randomUUID(),
      name: currencyName,
      definition: currencyDocumentation,
      columnDefinition: ColumnDataTypes.currency,
    }),
  );

  return {
    enhancerName,
    success: true,
  };
}
