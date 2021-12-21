import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.commonExtension.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(entity.metaEdName, entity.baseEntityNamespaceName, entity.namespace, 'common') == null
      ) {
        failures.push({
          validatorName: 'CommonExtensionIdentifierMustMatchACommon',
          category: 'error',
          message: `Common additions '${entity.metaEdName}' does not match any declared Common in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
