// 3.1.X.12 - METAED-701 - METAED-761
import { MetaEdEnvironment, ValidationFailure, SemVer, AssociationSubclass } from '@edfi/metaed-core';
import { versionSatisfies, V2Only, getAllEntitiesOfType } from '@edfi/metaed-core';

const validatorName = 'SubclassingAnyAssociationExceptStudentProgramAssociationIsUnsupportedV2';
const targetVersions: SemVer = V2Only;

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return failures;

  (getAllEntitiesOfType(metaEd, 'associationSubclass') as AssociationSubclass[]).forEach(
    (associationSubclass: AssociationSubclass) => {
      if (!associationSubclass.baseEntity) return;
      if (!associationSubclass.namespace.isExtension) return;
      if (associationSubclass.baseEntityName !== 'StudentProgramAssociation') {
        failures.push({
          validatorName,
          category: 'error',
          message: `${associationSubclass.typeHumanizedName} ${associationSubclass.metaEdName} is not a StudentProgramAssociation subclass.  StudentProgramAssociation subclasses are the only Association subclasses currently supported by the ODS/API.`,
          sourceMap: associationSubclass.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    },
  );

  return failures;
}
