import { MetaEdEnvironment, ValidationFailure, ModelBase } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];

  metaEd.propertyIndex.domainEntity.forEach(property => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'domainEntity',
      'domainEntitySubclass',
    );

    if (referencedEntity == null) {
      failures.push({
        validatorName: 'DomainEntityPropertyMustMatchADomainEntity',
        category: 'error',
        message: `Domain entity property '${
          property.metaEdName
        }' does not match any declared Domain Entity or Domain Entity Subclass in namespace ${
          property.referencedNamespaceName
        }.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
