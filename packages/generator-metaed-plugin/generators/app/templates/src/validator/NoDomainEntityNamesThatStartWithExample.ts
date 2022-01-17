import { versionSatisfies, V3OrGreater, MetaEdEnvironment, ValidationFailure, DomainEntity } from '@edfi/metaed-core';

// Validator that disallows DomainEntities from having a name that starts with "Example"
// Validator is named after its kind of validation
// File is named the same as the validator
// Exactly one validator per file
const validatorName = 'NoDomainEntityNamesThatStartWithExample';

// Validator only runs for Data Standard 3.x+, using canned SemVer range from metaed-core
const targetVersions: string = V3OrGreater;

// standard validation function signature
export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  // no validation failures if not Data Standard 3.0+
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return [];

  const failures: Array<ValidationFailure> = [];

  metaEd.namespace.forEach(namespace => {
    namespace.entity.domainEntity.forEach((entity: DomainEntity) => {
      if (!entity.metaEdName.startsWith('Example')) return;

      failures.push({
        validatorName,
        category: 'error',
        message: `'${
          entity.metaEdName
        }' is not a valid Domain Entity name.  Domain Entity names cannot start with 'Example'.`,
        sourceMap: entity.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });

  return failures;
}
