import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    if (!namespace.isExtension) return;
    namespace.entity.common.forEach((common) => {
      if (!common.inlineInOds || !common.namespace.isExtension) return;
      failures.push({
        validatorName: 'InlineCommonExistsOnlyInCoreNamespace',
        category: 'error',
        message: `${common.typeHumanizedName} ${common.metaEdName} is not valid in extension namespace ${common.namespace.namespaceName}.`,
        sourceMap: common.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
