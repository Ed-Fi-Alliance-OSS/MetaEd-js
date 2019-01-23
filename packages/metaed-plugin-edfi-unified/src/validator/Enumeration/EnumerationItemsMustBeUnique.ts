import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { failEnumerationItemRedeclarations } from '../ValidatorShared/FailEnumerationItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.enumeration.forEach(enumeration => {
      if (enumeration.enumerationItems.length > 1) {
        failEnumerationItemRedeclarations(
          'EnumerationItemsMustBeUnique',
          enumeration,
          enumeration.enumerationItems,
          failures,
        );
      }
    });
  });

  return failures;
}
