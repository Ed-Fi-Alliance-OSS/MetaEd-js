import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { failInterchangeItemRedeclarations } from '../ValidatorShared/FailInterchangeItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.interchange.forEach((interchange) => {
      if (interchange.elements.length === 0) return;
      failInterchangeItemRedeclarations(
        'InterchangeMustNotRedeclareInterchangeElements',
        'interchange element',
        interchange,
        interchange.elements,
        failures,
      );
    });
  });
  return failures;
}
