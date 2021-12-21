import { DomainEntity, MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domainEntitySubclass.forEach((domainEntitySubclass) => {
      const extendedEntity: DomainEntity | null = getEntityFromNamespaceChain(
        domainEntitySubclass.baseEntityName,
        domainEntitySubclass.baseEntityNamespaceName,
        domainEntitySubclass.namespace,
        'domainEntity',
      ) as DomainEntity | null;

      if (extendedEntity == null) return;
      failExtensionPropertyRedeclarations(
        'DomainEntitySubClassMustNotRedeclareProperties',
        domainEntitySubclass,
        extendedEntity,
        failures,
      );
    });
  });

  return failures;
}
