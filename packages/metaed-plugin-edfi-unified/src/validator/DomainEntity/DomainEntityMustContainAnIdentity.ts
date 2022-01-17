import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntity.forEach((domainEntity) => {
      if (domainEntity.identityProperties.length === 0) {
        failures.push({
          validatorName: 'DomainEntityMustContainAnIdentity',
          category: 'error',
          message: `Domain Entity ${domainEntity.metaEdName} does not have an identity specified.`,
          sourceMap: domainEntity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
