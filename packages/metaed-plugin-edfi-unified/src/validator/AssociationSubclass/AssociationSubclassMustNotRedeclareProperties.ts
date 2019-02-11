import { Association, MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.associationSubclass.forEach(associationSubclass => {
      const extendedEntity: Association | null = getEntityFromNamespaceChain(
        associationSubclass.baseEntityName,
        associationSubclass.baseEntityNamespaceName,
        associationSubclass.namespace,
        'association',
      ) as Association | null;

      if (!extendedEntity) return;
      failExtensionPropertyRedeclarations(
        'AssociationSubClassMustNotRedeclareProperties',
        associationSubclass,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
