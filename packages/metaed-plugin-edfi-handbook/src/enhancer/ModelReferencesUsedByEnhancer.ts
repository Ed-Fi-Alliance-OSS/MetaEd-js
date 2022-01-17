import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';
import { HandbookEntry } from '../model/HandbookEntry';

const enhancerName = 'HandbookEntryModelReferencesEnhancer';

function handbookEntriesForAllNamespaces(metaEd: MetaEdEnvironment): HandbookEntry[] {
  const result: HandbookEntry[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
    if (handbookRepository == null) return;
    result.push(...handbookRepository.handbookEntries);
  });

  return result;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const handbookEntries: HandbookEntry[] = handbookEntriesForAllNamespaces(metaEd);

  handbookEntries.forEach((handbookEntry: HandbookEntry) => {
    handbookEntry.modelReferencesUsedByProperties = handbookEntries
      .filter(
        (entry) =>
          entry.modelReferencesContainsProperties != null &&
          entry.modelReferencesContainsProperties.filter(
            (containsProperty) => handbookEntry.uniqueIdentifier === containsProperty.referenceUniqueIdentifier,
          ).length,
      )
      .map((entry) => ({
        metaEdId: entry.metaEdId,
        referenceUniqueIdentifier: entry.uniqueIdentifier,
        name: entry.name,
        cardinality: entry.modelReferencesContainsProperties.filter(
          (containsProperty) => handbookEntry.uniqueIdentifier === containsProperty.referenceUniqueIdentifier,
        )[0].cardinality,
      }));
  });
  return {
    enhancerName,
    success: true,
  };
}
