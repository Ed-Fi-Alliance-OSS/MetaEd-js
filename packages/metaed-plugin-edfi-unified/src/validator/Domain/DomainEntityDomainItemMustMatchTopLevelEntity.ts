import { DomainItem, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

function getFailure(domainItem: DomainItem, name: string, failureMessage: string): ValidationFailure {
  return {
    validatorName: name,
    category: 'error',
    message: failureMessage,
    sourceMap: domainItem.sourceMap.referencedType,
    fileMap: null,
  };
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domain.forEach((domain) => {
      domain.domainItems.forEach((domainItem) => {
        if (domainItem.referencedType !== 'domainEntity') return;
        if (
          getEntityFromNamespaceChain(
            domainItem.metaEdName,
            domainItem.referencedNamespaceName,
            namespace,
            'domainEntity',
            'domainEntitySubclass',
          ) == null
        ) {
          failures.push(
            getFailure(
              domainItem,
              'DomainEntityDomainItemMustMatchTopLevelEntity',
              `Domain Entity Domain Item property '${domainItem.metaEdName}' does not match any declared Domain Entity or Domain Entity Subclass in namespace ${domainItem.referencedNamespaceName}.`,
            ),
          );
        }
      });
    });
  });

  return failures;
}
