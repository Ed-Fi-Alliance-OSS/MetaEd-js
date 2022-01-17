import { MetaEdEnvironment, ValidationFailure, CommonExtension } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.commonExtension.forEach((commonExtension) => {
      const extendedEntity: CommonExtension | null = getEntityFromNamespaceChain(
        commonExtension.metaEdName,
        commonExtension.baseEntityNamespaceName,
        commonExtension.namespace,
        'common',
      ) as CommonExtension | null;

      if (extendedEntity) {
        failExtensionPropertyRedeclarations(
          'CommonExtensionMustNotRedeclareProperties',
          commonExtension,
          extendedEntity,
          failures,
        );
      }
    });
  });
  return failures;
}
