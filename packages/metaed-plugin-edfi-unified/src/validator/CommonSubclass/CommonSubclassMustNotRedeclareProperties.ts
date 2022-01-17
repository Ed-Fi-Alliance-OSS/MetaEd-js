import { Common, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.commonSubclass.forEach((commonSubclass) => {
      const extendedEntity: Common | null = getEntityFromNamespaceChain(
        commonSubclass.baseEntityName,
        commonSubclass.baseEntityNamespaceName,
        commonSubclass.namespace,
        'common',
      ) as Common | null;

      if (!extendedEntity) return;
      failExtensionPropertyRedeclarations(
        'CommonSubClassMustNotRedeclareProperties',
        commonSubclass,
        extendedEntity,
        failures,
      );
    });
  });
  return failures;
}
