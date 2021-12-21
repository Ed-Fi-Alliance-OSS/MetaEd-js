import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntity.forEach((domainEntity) => {
      if (domainEntity.isAbstract && domainEntity.identityProperties.length === 0) {
        failures.push({
          validatorName: 'AbstractEntityMustContainAnIdentity',
          category: 'error',
          message: `Abstract Entity ${domainEntity.metaEdName} does not have an identity specified.`,
          sourceMap: domainEntity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
