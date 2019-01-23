import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { findDuplicates } from '../ValidatorShared/FindDuplicates';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.subdomain.forEach(subdomain => {
      const names = subdomain.domainItems.map(di => di.metaEdName);
      const duplicates: Array<string> = findDuplicates(names);

      duplicates.forEach(val => {
        const domainItem = subdomain.domainItems.find(d => d.metaEdName === val);
        if (domainItem !== undefined) {
          failures.push({
            validatorName: 'SubdomainMustNotDuplicateDomainItems',
            category: 'error',
            message: `Subdomain Entity Domain Item '${domainItem.metaEdName}' has a duplicate Domain Item.`,
            sourceMap: domainItem.sourceMap.type,
            fileMap: null,
          });
        }
      });
    });
  });

  return failures;
}
