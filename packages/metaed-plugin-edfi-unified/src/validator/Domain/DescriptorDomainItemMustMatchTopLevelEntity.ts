import { DomainItem, MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

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
    namespace.entity.domain.forEach(domain => {
      domain.domainItems.forEach(domainItem => {
        if (domainItem.referencedType !== 'descriptor') return;
        if (
          getEntityFromNamespaceChain(domainItem.metaEdName, domainItem.referencedNamespaceName, namespace, 'descriptor') ==
          null
        ) {
          failures.push(
            getFailure(
              domainItem,
              'DescriptorDomainItemMustMatchTopLevelEntity',
              `Descriptor Domain Item property '${
                domainItem.metaEdName
              }' does not match any declared Descriptor in namespace ${domainItem.referencedNamespaceName}.`,
            ),
          );
        }
      });
    });
  });

  return failures;
}
