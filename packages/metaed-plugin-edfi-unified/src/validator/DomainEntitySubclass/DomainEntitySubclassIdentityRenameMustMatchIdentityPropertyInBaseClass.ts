import { DomainEntity, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty } from '../ValidatorShared/FailSubclassIdentityRenameNotMatchingBaseClassIdentityProperty';

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

      failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty(
        'DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass',
        domainEntitySubclass,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
