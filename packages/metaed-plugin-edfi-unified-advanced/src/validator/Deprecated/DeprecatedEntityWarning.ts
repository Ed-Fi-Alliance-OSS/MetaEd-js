// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  getAllEntitiesForNamespaces,
  ValidationFailure,
  ModelBase,
  TopLevelEntity,
} from '@edfi/metaed-core';

// type guard claiming type is TopLevelEntity if sourceMap present - could be other types with sourceMap but that's okay here
function hasSourceMap(entity: ModelBase): entity is TopLevelEntity {
  return (entity as TopLevelEntity).sourceMap !== undefined;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity: ModelBase) => {
    if (entity.isDeprecated) {
      // ignore data standard entity deprecations unless in alliance mode
      if (!entity.namespace.isExtension && !metaEd.allianceMode) return;
      failures.push({
        validatorName: 'DeprecatedEntityWarning',
        category: 'warning',
        message: `${entity.metaEdName} is deprecated.`,
        sourceMap: hasSourceMap(entity) ? entity.sourceMap.metaEdName : null,
        fileMap: null,
      });
    }
  });

  return failures;
}
