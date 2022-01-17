import { Subdomain, SubdomainSourceMap, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.subdomain.forEach((subdomain: Subdomain) => {
      if (
        getEntityFromNamespaceChain(subdomain.parentMetaEdName, subdomain.namespace.namespaceName, namespace, 'domain') ==
        null
      ) {
        failures.push({
          validatorName: 'SubdomainParentDomainNameMustMatchADomain',
          category: 'error',
          message: `Subdomain parent domain name '${subdomain.parentMetaEdName}' does not match any declared Domain in namespace ${subdomain.namespace.namespaceName}.`,
          sourceMap: (subdomain.sourceMap as SubdomainSourceMap).parentMetaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
