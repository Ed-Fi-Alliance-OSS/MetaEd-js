import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { failSubclassIdentityRenamingMoreThanOnce } from '../ValidatorShared/FailSubclassIdentityRenamingMoreThanOnce';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntitySubclass.forEach((domainEntitySubclass) => {
      failSubclassIdentityRenamingMoreThanOnce(
        'DomainEntitySubclassIdenitityRenameMustExistNoMoreThanOnce',
        domainEntitySubclass,
        failures,
      );
    });
  });
  return failures;
}
