import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.commonSubclass.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(entity.baseEntityName, entity.baseEntityNamespaceName, entity.namespace, 'common') ==
        null
      ) {
        failures.push({
          validatorName: 'CommonSubclassIdentifierMustMatchAnCommon',
          category: 'error',
          message: `Common ${entity.metaEdName} based on ${entity.baseEntityName} does not match any declared Common in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
