import { MetaEdEnvironment, ValidationFailure, getAllProperties, EntityProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    if (property.isRequired && property.type === 'choice') {
      failures.push({
        validatorName: 'OdsApiIgnoreRequiredChoiceProperty',
        category: 'warning',
        message: `${property.metaEdName} is required.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
