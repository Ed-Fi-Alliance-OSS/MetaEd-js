import { DecimalProperty, MetaEdEnvironment, ValidationFailure, DecimalPropertySourceMap } from 'metaed-core';
import { asDecimalProperty } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.decimal.forEach((decimal) => {
    const decimalProperty: DecimalProperty = asDecimalProperty(decimal);
    const minValue: number = Number.parseInt(decimalProperty.minValue || '0', 10);
    const maxValue: number = Number.parseInt(decimalProperty.maxValue || '0', 10);
    if (minValue <= maxValue) return;

    failures.push({
      validatorName: 'DecimalPropertyMinValueMustNotBeGreaterThanMaxValue',
      category: 'error',
      message: `${decimal.type} ${decimal.metaEdName} has min value greater than max value.`,
      sourceMap: (decimal.sourceMap as DecimalPropertySourceMap).minValue,
      fileMap: null,
    });
  });
  return failures;
}
