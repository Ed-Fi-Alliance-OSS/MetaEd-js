import { MetaEdEnvironment, ValidationFailure, SharedDecimalSourceMap, Namespace } from 'metaed-core';

// @ts-ignore
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.sharedDecimal.forEach((entity) => {
      if (
        entity.minValue &&
        entity.maxValue &&
        Number.parseInt(entity.minValue, 10) > Number.parseInt(entity.maxValue, 10)
      ) {
        failures.push({
          validatorName: 'SharedDecimalMinValueMustNotBeGreaterThanMaxValue',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has min value greater than max value.`,
          sourceMap: (entity.sourceMap as SharedDecimalSourceMap).minValue,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
