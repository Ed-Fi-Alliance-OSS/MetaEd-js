import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    if (!namespace.isExtension) return;
    namespace.entity.enumeration.forEach((enumeration) => {
      failures.push({
        validatorName: 'EnumerationExistsOnlyInCoreNamespace',
        category: 'warning',
        message: `${enumeration.typeHumanizedName} ${enumeration.metaEdName} will no longer be valid in extension namespace ${enumeration.namespace.projectExtension} in future releases.  Please convert to a Descriptor.`,
        sourceMap: enumeration.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
