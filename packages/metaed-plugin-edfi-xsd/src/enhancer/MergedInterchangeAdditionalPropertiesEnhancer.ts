import { MetaEdEnvironment, EnhancerResult, Namespace } from 'metaed-core';
import { edfiXsdRepositoryForNamespace } from './EnhancerHelper';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';

const enhancerName = 'MergedInterchangeAdditionalPropertiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) return;

    Array.from(edFiXsdEntityRepository.mergedInterchange.values()).forEach((mergedInterchange) => {
      mergedInterchange.interchangeName = `Interchange${mergedInterchange.metaEdName}`;
      mergedInterchange.schemaLocation = mergedInterchange.namespace.isExtension
        ? `${mergedInterchange.namespace.projectExtension}-Ed-Fi-Extended-Core.xsd`
        : 'Ed-Fi-Core.xsd';
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
