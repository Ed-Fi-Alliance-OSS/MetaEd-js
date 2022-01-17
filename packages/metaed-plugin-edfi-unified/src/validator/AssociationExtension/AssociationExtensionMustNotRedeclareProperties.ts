import { MetaEdEnvironment, ValidationFailure, TopLevelEntity } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';
import { failExtensionPropertyRedeclarations } from '../ValidatorShared/FailExtensionPropertyRedeclarations';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace) => {
    namespace.entity.associationExtension.forEach((associationExtension) => {
      const extendedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        associationExtension.metaEdName,
        associationExtension.baseEntityNamespaceName,
        associationExtension.namespace,
        'association',
        'associationSubclass',
      ) as TopLevelEntity | null;

      if (extendedEntity != null) {
        failExtensionPropertyRedeclarations(
          'AssociationExtensionMustNotRedeclareProperties',
          associationExtension,
          extendedEntity,
          failures,
        );
      }
    });
  });
  return failures;
}
