// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// METAED-1052
import { MetaEdEnvironment, ValidationFailure, TopLevelEntity } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  (getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass') as TopLevelEntity[]).forEach(
    (entitySubclass: TopLevelEntity) => {
      if (!entitySubclass.baseEntity) return;
      if (!entitySubclass.namespace.isExtension) return;
      failures.push({
        validatorName: 'SubclassingAnythingInExtensionsIsUnsupported',
        category: 'error',
        message: `Subclasses are currently unsupported by the ODS/API in extension projects.`,
        sourceMap: entitySubclass.sourceMap.metaEdName,
        fileMap: null,
      });
    },
  );

  return failures;
}
