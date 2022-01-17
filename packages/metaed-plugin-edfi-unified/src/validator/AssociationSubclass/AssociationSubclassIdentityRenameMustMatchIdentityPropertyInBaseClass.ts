import { Association, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty } from '../ValidatorShared/FailSubclassIdentityRenameNotMatchingBaseClassIdentityProperty';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.associationSubclass.forEach((associationSubclass) => {
      const extendedEntity: Association | null = getEntityFromNamespaceChain(
        associationSubclass.baseEntityName,
        associationSubclass.baseEntityNamespaceName,
        associationSubclass.namespace,
        'association',
      ) as Association | null;

      failSubclassIdentityRenameNotMatchingBaseClassIdentityProperty(
        'AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass',
        associationSubclass,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
