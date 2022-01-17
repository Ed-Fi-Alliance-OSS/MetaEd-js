import { MetaEdEnvironment, ValidationFailure, SharedIntegerSourceMap, Namespace } from '@edfi/metaed-core';

// @ts-ignore
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.sharedInteger.forEach((entity) => {
      if (
        entity.minValue &&
        entity.maxValue &&
        Number.parseInt(entity.minValue, 10) > Number.parseInt(entity.maxValue, 10)
      ) {
        failures.push({
          validatorName: 'SharedIntegerMinValueMustNotBeGreaterThanMaxValue',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has min value greater than max value.`,
          sourceMap: (entity.sourceMap as SharedIntegerSourceMap).minValue,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
