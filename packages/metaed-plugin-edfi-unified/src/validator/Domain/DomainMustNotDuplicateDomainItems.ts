import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { findDuplicates } from '../ValidatorShared/FindDuplicates';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domain.forEach((domain) => {
      const names = domain.domainItems.map((di) => di.metaEdName);
      const duplicates: string[] = findDuplicates(names);

      duplicates.forEach((val) => {
        const domainItem = domain.domainItems.find((d) => d.metaEdName === val);
        if (domainItem !== undefined) {
          failures.push({
            validatorName: 'DomainMustNotDuplicateDomainItems',
            category: 'error',
            message: `Domain Entity Domain Item '${domainItem.metaEdName}' has a duplicate Domain Item.`,
            sourceMap: domainItem.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      });
    });
  });

  return failures;
}
