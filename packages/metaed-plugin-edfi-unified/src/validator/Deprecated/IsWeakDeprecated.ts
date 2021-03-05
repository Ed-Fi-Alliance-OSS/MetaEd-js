import {
  AssociationProperty,
  DomainEntityProperty,
  MetaEdEnvironment,
  ValidationFailure,
  versionSatisfies,
} from 'metaed-core';

const targetDataStandardVersion: string = '>=3.3.0-a';

const validateArray = (propertiesArray: DomainEntityProperty[] | AssociationProperty[], failures: ValidationFailure[]) => {
  propertiesArray.forEach(property => {
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
};

export function validate(metaed: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!versionSatisfies(metaed.dataStandardVersion, targetDataStandardVersion)) return failures;

  validateArray(metaed.propertyIndex.domainEntity, failures);
  validateArray(metaed.propertyIndex.association, failures);

  return failures;
}
