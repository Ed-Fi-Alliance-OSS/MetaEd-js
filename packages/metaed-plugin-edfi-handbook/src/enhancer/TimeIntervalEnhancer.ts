import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { createDefaultHandbookEntry } from './BaseSimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'TimeIntervalMetaEdHandbookEnhancer';
const timeIntervalName = 'TimeInterval';
const timeIntervalDocumentation = 'A period of time with fixed, well-defined limits.';
const timeIntervalEdfiId = '110';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, coreNamespace);
  if (handbookRepository == null) return { enhancerName, success: false };

  handbookRepository.handbookEntries.push(
    createDefaultHandbookEntry(timeIntervalEdfiId, timeIntervalName, timeIntervalDocumentation),
  );

  return {
    enhancerName,
    success: true,
  };
}
