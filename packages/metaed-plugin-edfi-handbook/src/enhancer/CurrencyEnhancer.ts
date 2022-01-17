import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './BaseSimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'CurrencyMetaEdHandbookEnhancer';
const currencyName = 'Currency';
const currencyDocumentation = 'U.S. currency in dollars and cents.';
const currencyEdfiId = '36';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, coreNamespace);
  if (handbookRepository == null) return { enhancerName, success: false };

  handbookRepository.handbookEntries.push(createDefaultHandbookEntry(currencyEdfiId, currencyName, currencyDocumentation));

  return {
    enhancerName,
    success: true,
  };
}
