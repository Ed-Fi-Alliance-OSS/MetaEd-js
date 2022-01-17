import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { failInterchangeItemRedeclarations } from '../ValidatorShared/FailInterchangeItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.interchangeExtension.forEach((interchangeExtension) => {
      if (interchangeExtension.elements.length === 0) return;
      failInterchangeItemRedeclarations(
        'InterchangeExtensionMustNotRedeclareElements',
        'element',
        interchangeExtension,
        interchangeExtension.elements,
        failures,
      );
    });
  });
  return failures;
}
