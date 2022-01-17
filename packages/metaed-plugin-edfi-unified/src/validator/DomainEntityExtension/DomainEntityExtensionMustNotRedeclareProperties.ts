import { MetaEdEnvironment, ValidationFailure, TopLevelEntity } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntityExtension.forEach((domainEntityExtension) => {
      const extendedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        domainEntityExtension.metaEdName,
        domainEntityExtension.baseEntityNamespaceName,
        domainEntityExtension.namespace,
        'domainEntity',
        'domainEntitySubclass',
      ) as TopLevelEntity | null;

      if (extendedEntity != null) {
        failExtensionPropertyRedeclarations(
          'DomainEntityExtensionMustNotRedeclareProperties',
          domainEntityExtension,
          extendedEntity,
          failures,
        );
      }
    });
  });
  return failures;
}
