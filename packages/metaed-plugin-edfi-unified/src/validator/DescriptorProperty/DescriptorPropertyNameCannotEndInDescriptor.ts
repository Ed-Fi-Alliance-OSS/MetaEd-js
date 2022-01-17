import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.descriptor.forEach((descriptorProperty) => {
    if (descriptorProperty.metaEdName.endsWith('Descriptor')) {
      failures.push({
        validatorName: 'DescriptorPropertyNameCannotEndInDescriptor',
        category: 'error',
        message: `Descriptor property ${descriptorProperty.metaEdName} name is invalid.  Descriptor names cannot be suffixed with 'Descriptor'.`,
        sourceMap: descriptorProperty.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
