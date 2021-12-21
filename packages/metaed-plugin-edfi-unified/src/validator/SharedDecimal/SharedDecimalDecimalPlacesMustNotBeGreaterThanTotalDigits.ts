import { MetaEdEnvironment, ValidationFailure, SharedDecimalSourceMap, Namespace } from 'metaed-core';

// @ts-ignore
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.sharedDecimal.forEach((entity) => {
      if (
        entity.decimalPlaces &&
        entity.totalDigits &&
        Number.parseInt(entity.decimalPlaces, 10) > Number.parseInt(entity.totalDigits, 10)
      ) {
        failures.push({
          validatorName: 'SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits',
          category: 'error',
          message: `${entity.typeHumanizedName} ${entity.metaEdName} has decimal places greater than total digits.`,
          sourceMap: (entity.sourceMap as SharedDecimalSourceMap).decimalPlaces,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
