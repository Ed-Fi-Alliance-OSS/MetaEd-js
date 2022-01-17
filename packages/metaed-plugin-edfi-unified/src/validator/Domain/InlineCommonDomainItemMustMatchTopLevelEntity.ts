import { DomainItem, MetaEdEnvironment, ValidationFailure, Namespace, Common } from '@edfi/metaed-core';
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
        if (domainItem.referencedType !== 'inlineCommon') return;
        const inlineCommon: Common | null = getEntityFromNamespaceChain(
          domainItem.metaEdName,
          domainItem.referencedNamespaceName,
          namespace,
          'common',
        ) as Common | null;

        if (inlineCommon == null || !inlineCommon.inlineInOds) {
          failures.push(
            getFailure(
              domainItem,
              'InlineCommonDomainItemMustMatchTopLevelEntity',
              `Inline Common Domain Item property '${domainItem.metaEdName}' does not match any declared Inline Common in namespace ${domainItem.referencedNamespaceName}.`,
            ),
          );
        }
      });
    });
  });

  return failures;
}
