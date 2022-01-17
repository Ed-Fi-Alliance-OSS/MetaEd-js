import { MetaEdEnvironment, ValidationFailure, Interchange, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failInterchangeExtensionPropertyRedeclarations } from '../ValidatorShared/FailInterchangeExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.interchangeExtension.forEach((interchangeExtension) => {
      const extendedEntity: Interchange | null = getEntityFromNamespaceChain(
        interchangeExtension.baseEntityName,
        interchangeExtension.baseEntityNamespaceName,
        namespace,
        'interchange',
      ) as Interchange | null;

      if (extendedEntity == null) return;

      failInterchangeExtensionPropertyRedeclarations(
        'InterchangeExtensionMustNotRedeclareBaseInterchangeElements',
        'elements',
        interchangeExtension,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
