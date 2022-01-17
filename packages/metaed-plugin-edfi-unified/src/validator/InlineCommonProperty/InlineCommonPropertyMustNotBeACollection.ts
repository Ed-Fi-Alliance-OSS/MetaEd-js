import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.inlineCommon.forEach((property) => {
    if (property.isRequiredCollection || property.isOptionalCollection) {
      failures.push({
        validatorName: 'InlineCommonPropertyMustNotBeACollection',
        category: 'error',
        message: `Inline Common property '${property.metaEdName}' is not allowed to be a collection`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
