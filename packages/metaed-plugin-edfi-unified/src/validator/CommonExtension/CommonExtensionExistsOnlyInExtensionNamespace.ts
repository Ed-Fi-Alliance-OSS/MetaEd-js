import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  Array.from(metaEd.namespace.values())
    .filter((n) => !n.isExtension)
    .forEach((namespace) => {
      namespace.entity.commonExtension.forEach((entity) => {
        failures.push({
          validatorName: 'CommonExtensionExistsOnlyInExtensionNamespace',
          category: 'error',
          message: `Common additions '${entity.metaEdName}' is not valid in core namespace '${entity.namespace.namespaceName}`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      });
    });

  return failures;
}
