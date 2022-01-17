import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.associationSubclass.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(
          entity.baseEntityName,
          entity.baseEntityNamespaceName,
          entity.namespace,
          'association',
        ) == null
      ) {
        failures.push({
          validatorName: 'AssociationSubclassIdentifierMustMatchAnAssociation',
          category: 'error',
          message: `Association ${entity.metaEdName} based on ${entity.baseEntityName} does not match any declared Association in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
