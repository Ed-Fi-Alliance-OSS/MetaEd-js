import {
  EnhancerResult,
  ModelType,
  MetaEdEnvironment,
  Namespace,
  ModelBase,
  allEntityModelTypesNoSimpleTypes,
} from '@edfi/metaed-core';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';
import { edfiXsdRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'HasDuplicateEntityNameInDependencyNamespaceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.dependencies.forEach((dependencyNamespace: Namespace) => {
      allEntityModelTypesNoSimpleTypes.forEach((modelType: ModelType) => {
        const entitiesInModelType: ModelBase[] = Array.from(namespace.entity[modelType].values());
        entitiesInModelType.forEach((entityInModelType: ModelBase) => {
          if (dependencyNamespace.entity[modelType].has(entityInModelType.metaEdName)) {
            const edfiXsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
            if (edfiXsdRepository != null) {
              edfiXsdRepository.hasDuplicateEntityNameInDependencyNamespace = true;
            }
          }
        });
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
