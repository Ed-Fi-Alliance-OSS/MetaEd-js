import { DecimalProperty, MetaEdEnvironment, ValidationFailure, DecimalPropertySourceMap } from 'metaed-core';
import { asDecimalProperty } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.propertyIndex.decimal.forEach(decimal => {
    const decimalProperty: DecimalProperty = asDecimalProperty(decimal);
    const decimalPlaces: number = Number.parseInt(decimalProperty.decimalPlaces, 10);
    const totalDigits: number = Number.parseInt(decimalProperty.totalDigits, 10);
    if (decimalPlaces <= totalDigits) return;

    failures.push({
      validatorName: 'DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits',
      category: 'error',
      message: `${decimal.type} ${decimal.metaEdName} has decimal places greater than total digits.`,
      sourceMap: (decimal.sourceMap as DecimalPropertySourceMap).decimalPlaces,
      fileMap: null,
    });
  });
  return failures;
}
