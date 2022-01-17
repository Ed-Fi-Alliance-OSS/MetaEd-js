import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domainEntityExtension.forEach((entity) => {
      if (
        getEntityFromNamespaceChain(
          entity.metaEdName,
          entity.baseEntityNamespaceName,
          entity.namespace,
          'domainEntity',
          'domainEntitySubclass',
        ) == null
      ) {
        failures.push({
          validatorName: 'DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass',
          category: 'error',
          message: `Domain Entity additions '${entity.metaEdName}' does not match any declared Domain Entity or Domain Entity Subclass in namespace ${entity.baseEntityNamespaceName}.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
