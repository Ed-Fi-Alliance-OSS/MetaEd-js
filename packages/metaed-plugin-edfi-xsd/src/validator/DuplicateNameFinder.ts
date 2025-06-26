// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  ModelType,
  MetaEdEnvironment,
  Namespace,
  ModelBase,
  ValidationFailure,
  TopLevelEntity,
  allEntityModelTypesNoSimpleTypes,
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
            const entityWithDuplicateName: TopLevelEntity = entityInModelType as TopLevelEntity;
            failureCollector(failures, entityWithDuplicateName, dependencyNamespace);
          }
        });
      });
    });
  });
}
