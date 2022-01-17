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
