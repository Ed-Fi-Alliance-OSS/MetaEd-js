import { DomainItem, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

function getFailure(domainItem: DomainItem, name: string, failureMessage: string): ValidationFailure {
  return {
    validatorName: name,
    category: 'error',
    message: failureMessage,
    sourceMap: domainItem.sourceMap.metaEdName,
    fileMap: null,
  };
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domain.forEach((domain) => {
      domain.domainItems.forEach((domainItem) => {
        if (domainItem.referencedType !== 'association') return;
        if (
          getEntityFromNamespaceChain(
            domainItem.metaEdName,
            domainItem.referencedNamespaceName,
            namespace,
            'association',
            'associationSubclass',
          ) == null
        ) {
          failures.push(
            getFailure(
              domainItem,
              'AssociationDomainItemMustMatchTopLevelEntity',
              `Association Domain Item property '${domainItem.metaEdName}' does not match any declared Association or Association Subclass in namespace ${domainItem.referencedNamespaceName}.`,
            ),
          );
        }
      });
    });
  });

  return failures;
}
