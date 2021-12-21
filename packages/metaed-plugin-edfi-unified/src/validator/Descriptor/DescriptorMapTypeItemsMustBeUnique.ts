import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { failEnumerationItemRedeclarations } from '../ValidatorShared/FailEnumerationItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.descriptor.forEach((descriptor) => {
      if (descriptor.mapTypeEnumeration.enumerationItems.length > 1) {
        failEnumerationItemRedeclarations(
          'DescriptorMapTypeItemsMustBeUnique',
          descriptor,
          descriptor.mapTypeEnumeration.enumerationItems,
          failures,
        );
      }
    });
  });

  return failures;
}
