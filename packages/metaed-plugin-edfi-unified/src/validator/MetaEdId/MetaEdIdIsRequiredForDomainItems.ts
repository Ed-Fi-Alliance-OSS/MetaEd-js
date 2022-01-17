import { Domain, Subdomain, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces, asDomainBase } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    getEntitiesOfTypeForNamespaces([namespace], 'domain', 'subdomain').forEach((entity) => {
      const domain: Domain | Subdomain = asDomainBase(entity);
      if (domain.domainItems.length === 0) return;
      domain.domainItems.forEach((domainItem) => {
        if (domainItem.metaEdId) return;
        failures.push({
          validatorName: 'MetaEdIdIsRequiredForDomainItems',
          category: 'warning',
          message: `${domainItem.typeHumanizedName} ${domainItem.metaEdName} is missing a MetaEdId value.`,
          sourceMap: domainItem.sourceMap.referencedType,
          fileMap: null,
        });
      });
    });
  });
  return failures;
}
