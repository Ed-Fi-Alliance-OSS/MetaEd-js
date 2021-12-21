import { MetaEdEnvironment, ValidationFailure, StringProperty, StringPropertySourceMap } from 'metaed-core';
import { asStringProperty } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.string.forEach((string) => {
    const stringProperty: StringProperty = asStringProperty(string);
    const minLength: number = Number.parseInt(stringProperty.minLength || '0', 10);
    const maxLength: number = Number.parseInt(stringProperty.maxLength || '0', 10);
    if (minLength <= maxLength) return;

    failures.push({
      validatorName: 'StringPropertyMinLengthMustNotBeGreaterThanMaxLength',
      category: 'error',
      message: `String Property ${string.metaEdName} has min length greater than max length.`,
      sourceMap: (string.sourceMap as StringPropertySourceMap).minLength,
      fileMap: null,
    });
  });

  return failures;
}
