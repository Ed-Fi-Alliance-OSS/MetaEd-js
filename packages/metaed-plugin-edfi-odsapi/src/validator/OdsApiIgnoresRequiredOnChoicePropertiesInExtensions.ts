import { MetaEdEnvironment, ValidationFailure, ChoiceProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.choice.forEach((property: ChoiceProperty) => {
    if (property.isRequired && property.namespace.isExtension) {
      failures.push({
        validatorName: 'OdsApiIgnoresRequiredOnChoicePropertiesInExtensions',
        category: 'warning',
        message: `Choice property ${property.metaEdName} is marked as required, but the ODS/API treats all choice properties as optional.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
