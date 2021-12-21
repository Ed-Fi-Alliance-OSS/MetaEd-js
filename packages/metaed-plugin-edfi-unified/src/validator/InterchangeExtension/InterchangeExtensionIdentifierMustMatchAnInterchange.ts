import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.interchangeExtension.forEach((interchangeExtension) => {
      if (
        getEntityFromNamespaceChain(
          interchangeExtension.baseEntityName,
          interchangeExtension.baseEntityNamespaceName,
          namespace,
          'interchange',
        ) == null
      ) {
        failures.push({
          validatorName: 'InterchangeExtensionIdentifierMustMatchAnInterchange',
          category: 'error',
          message: `Interchange additions ${interchangeExtension.metaEdName} does not match any declared Interchange in namespace ${interchangeExtension.baseEntityNamespaceName}.`,
          sourceMap: interchangeExtension.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
