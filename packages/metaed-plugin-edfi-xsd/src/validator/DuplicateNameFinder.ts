import {
  ModelType,
  MetaEdEnvironment,
  Namespace,
  ModelBase,
  ValidationFailure,
  TopLevelEntity,
  allEntityModelTypesNoSimpleTypes,
  asTopLevelEntity,
} from '@edfi/metaed-core';

export type FailureCollector = (
  failures: ValidationFailure[],
  entityWithDuplicateName: TopLevelEntity,
  dependencyNamespace: Namespace,
) => void;

export function duplicateNameFinder(
  metaEd: MetaEdEnvironment,
  failures: ValidationFailure[],
  failureCollector: FailureCollector,
) {
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.dependencies.forEach((dependencyNamespace: Namespace) => {
      allEntityModelTypesNoSimpleTypes.forEach((modelType: ModelType) => {
        const entitiesInModelType: ModelBase[] = Array.from(namespace.entity[modelType].values());
        entitiesInModelType.forEach((entityInModelType: ModelBase) => {
          if (dependencyNamespace.entity[modelType].has(entityInModelType.metaEdName)) {
            const entityWithDuplicateName: TopLevelEntity = asTopLevelEntity(entityInModelType);
            failureCollector(failures, entityWithDuplicateName, dependencyNamespace);
          }
        });
      });
    });
  });
}
