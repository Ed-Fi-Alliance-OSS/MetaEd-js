// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { versionSatisfies, V3OrGreater } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure, AssociationExtension } from '@edfi/metaed-core';

// METAED-805
const validatorName = 'AbstractGeneralStudentProgramAssociationMustNotBeExtended';
const targetVersions: string = V3OrGreater;

const generalStudentProgramAssociationName = 'GeneralStudentProgramAssociation';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return [];

  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    namespace.entity.associationExtension.forEach((extensionEntity: AssociationExtension) => {
      if (extensionEntity.metaEdName !== generalStudentProgramAssociationName) return;

      failures.push({
        validatorName,
        category: 'error',
        message: `Abstract Association ${extensionEntity.metaEdName} additions is not valid.  Abstract entities cannot be extended.`,
        sourceMap: extensionEntity.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });

  return failures;
}
