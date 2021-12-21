import { MetaEdEnvironment, ValidationFailure, SharedStringSourceMap, Namespace } from 'metaed-core';

// @ts-ignore
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.sharedString.forEach((entity) => {
      if (
        entity.minLength &&
        entity.maxLength &&
        Number.parseInt(entity.minLength, 10) > Number.parseInt(entity.maxLength, 10)
      ) {
        failures.push({
          validatorName: 'SharedStringMinLengthMustNotBeGreaterThanMaxLength',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has min length greater than max length.`,
          sourceMap: (entity.sourceMap as SharedStringSourceMap).minLength,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
