import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './BaseSimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'PercentMetaEdHandbookEnhancer';
const percentName = 'Percent';
const percentDocumentation = 'A proportion in relation to the whole (as measured in parts per one hundred).';
const percentEdfiId = '80';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, coreNamespace);
  if (handbookRepository == null) return { enhancerName, success: false };

  handbookRepository.handbookEntries.push(createDefaultHandbookEntry(percentEdfiId, percentName, percentDocumentation));

  return {
    enhancerName,
    success: true,
  };
}
