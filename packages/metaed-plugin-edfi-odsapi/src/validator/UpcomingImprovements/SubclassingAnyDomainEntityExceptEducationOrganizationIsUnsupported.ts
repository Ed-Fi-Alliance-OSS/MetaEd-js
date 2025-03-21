// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// 3.1.X.12 - METAED-701
// METAED-761 - disabled the following validators:
//    SubclassingAssessmentFamilyIsUnsupported - 3.1.X.7 - METAED-701 - ODS-1324
//    SubclassingAssessmentIsUnsupported - 3.1.X.6 - METAED-701 - ODS-1324
//    SubclassingLearningObjectiveIsUnsupported - 3.1.X.8 - METAED-701 - ODS-1324
//    SubclassingPostSecondaryEventIsUnsupported - 3.1.X.9 - METAED-701 - ODS-1324
//    SubclassingStudentAcademicRecordIsUnsupported - 3.1.X.10 - METAED-701 - ODS-1324
//    SubclassingStudentIsUnsupported - 3.1.X.11 - METAED-701 - ODS-1324 - ODS-1183
//    SubclassingParentIsUnsupported - 3.1.X.13 - METAED-701 - ODS-1183
//    SubclassingStaffIsUnsupported - 3.1.X.14 - METAED-701 - ODS-1183
import { MetaEdEnvironment, ValidationFailure, DomainEntitySubclass } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  (getAllEntitiesOfType(metaEd, 'domainEntitySubclass') as DomainEntitySubclass[]).forEach(
    (domainEntitySubclass: DomainEntitySubclass) => {
      if (!domainEntitySubclass.baseEntity) return;
      if (!domainEntitySubclass.namespace.isExtension) return;
      if (domainEntitySubclass.baseEntityName !== 'EducationOrganization') {
        failures.push({
          validatorName: 'SubclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported',
          category: 'error',
          message: `${domainEntitySubclass.typeHumanizedName} ${domainEntitySubclass.metaEdName} is not an EducationOrganization subclass.  EducationOrganization subclasses are the only Domain Entity subclasses currently supported by the ODS/API.`,
          sourceMap: domainEntitySubclass.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    },
  );

  return failures;
}
