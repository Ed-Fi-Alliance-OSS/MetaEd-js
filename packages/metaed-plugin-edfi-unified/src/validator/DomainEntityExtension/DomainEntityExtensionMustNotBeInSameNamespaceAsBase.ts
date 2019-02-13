import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.namespace.forEach(namespace => {
    namespace.entity.domainEntityExtension.forEach(entity => {
      if (entity.baseEntityNamespaceName === namespace.namespaceName) {
        failures.push({
          validatorName: 'DomainEntityExtensionMustNotBeInSameNamespaceAsBase',
          category: 'error',
          message: `Domain Entity additions '${entity.metaEdName}' cannot be in the same namespace as its base entity.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
