import { MetaEdEnvironment, ValidationFailure, versionSatisfies } from 'metaed-core';

const targetVersion: string = '>=3.3.0-a';

export function validate(metaed: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!versionSatisfies(metaed.dataStandardVersion, targetVersion)) return failures;

  metaed.propertyIndex.domainEntity.forEach(property => {
    if (property.isWeak) {
      failures.push({
        validatorName: 'IsWeakDeprecated',
        category: 'error',
        message: "The 'is weak' keyword has been deprecated, as it is not compatible with data standard versions > 3.2.x",
        sourceMap: property.sourceMap.isWeak,
        fileMap: null,
      });
    }
  });

  metaed.propertyIndex.association.forEach(property => {
    if (property.isWeak) {
      failures.push({
        validatorName: 'IsWeakDeprecated',
        category: 'error',
        message: "The 'is weak' keyword has been deprecated, as it is not compatible with data standard versions > 3.2.x",
        sourceMap: property.sourceMap.isWeak,
        fileMap: null,
      });
    }
  });

  return failures;
}
