import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.associationExtension.forEach((entity) => {
      if (entity.baseEntityNamespaceName === namespace.namespaceName) {
        failures.push({
          validatorName: 'AssociationExtensionMustNotBeInSameNamespaceAsBase',
          category: 'error',
          message: `Association additions '${entity.metaEdName}' cannot be in the same namespace as its base entity.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
