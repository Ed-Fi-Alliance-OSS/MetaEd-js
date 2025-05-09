// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// 3.1.X.12 - METAED-701 - METAED-761
import { MetaEdEnvironment, ValidationFailure, SemVer, AssociationSubclass } from '@edfi/metaed-core';
import { versionSatisfies, V3OrGreater, getAllEntitiesOfType } from '@edfi/metaed-core';

const validatorName = 'SubclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported';
const targetVersions: SemVer = V3OrGreater;

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return failures;

  (getAllEntitiesOfType(metaEd, 'associationSubclass') as AssociationSubclass[]).forEach(
    (associationSubclass: AssociationSubclass) => {
      if (!associationSubclass.baseEntity) return;
      if (!associationSubclass.namespace.isExtension) return;
      if (associationSubclass.baseEntityName !== 'GeneralStudentProgramAssociation') {
        failures.push({
          validatorName,
          category: 'error',
          message: `${associationSubclass.typeHumanizedName} ${associationSubclass.metaEdName} is not a GeneralStudentProgramAssociation subclass.  GeneralStudentProgramAssociation subclasses are the only Association subclasses currently supported by the ODS/API.`,
          sourceMap: associationSubclass.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    },
  );

  return failures;
}
