// @flow
import type { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { failInterchangeItemRedeclarations } from '../ValidatorShared/FailInterchangeItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.interchangeExtension.forEach(interchangeExtension => {
      if (interchangeExtension.identityTemplates.length === 0) return;
      failInterchangeItemRedeclarations(
        'InterchangeExtensionMustNotRedeclareIdentityName',
        'identity template',
        interchangeExtension,
        interchangeExtension.identityTemplates,
        failures,
      );
    });
  });
  return failures;
}
