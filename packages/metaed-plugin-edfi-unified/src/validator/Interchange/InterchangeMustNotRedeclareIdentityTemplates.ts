import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { failInterchangeItemRedeclarations } from '../ValidatorShared/FailInterchangeItemRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.interchange.forEach((interchange) => {
      if (interchange.identityTemplates.length === 0) return;
      failInterchangeItemRedeclarations(
        'InterchangeMustNotRedeclareIdentityName',
        'identity template',
        interchange,
        interchange.identityTemplates,
        failures,
      );
    });
  });
  return failures;
}
