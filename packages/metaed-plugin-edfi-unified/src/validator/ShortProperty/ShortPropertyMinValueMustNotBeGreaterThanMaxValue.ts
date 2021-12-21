import { ShortProperty, ShortPropertySourceMap, MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { asShortProperty } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.short.forEach((short) => {
    const shortProperty: ShortProperty = asShortProperty(short);
    const minValue: number = Number.parseInt(shortProperty.minValue || '0', 10);
    const maxValue: number = Number.parseInt(shortProperty.maxValue || '0', 10);
    if (minValue <= maxValue) return;

    failures.push({
      validatorName: 'ShortPropertyMinValueMustNotBeGreaterThanMaxValue',
      category: 'error',
      message: `Short Property ${short.metaEdName} has min value greater than max value.`,
      sourceMap: (short.sourceMap as ShortPropertySourceMap).minValue,
      fileMap: null,
    });
  });

  return failures;
}
