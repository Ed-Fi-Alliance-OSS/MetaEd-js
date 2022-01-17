import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.associationExtension.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(
          entity.metaEdName,
          entity.baseEntityNamespaceName,
          entity.namespace,
          'association',
          'associationSubclass',
        ) == null
      ) {
        failures.push({
          validatorName: 'AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass',
          category: 'error',
          message: `Association additions '${entity.metaEdName}' does not match any declared Association or Association Subclass in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
