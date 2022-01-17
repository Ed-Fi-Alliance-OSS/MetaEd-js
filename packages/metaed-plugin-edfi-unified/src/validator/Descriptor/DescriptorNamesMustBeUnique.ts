import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { generateValidationErrorsForDuplicates } from '../ValidatorShared/ErrorsForDuplicateMetaEdNames';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    failures.push(
      ...generateValidationErrorsForDuplicates(
        getEntitiesOfTypeForNamespaces([namespace], 'descriptor'),
        'DescriptorNamesMustBeUnique',
      ),
    );
  });

  return failures;
}
