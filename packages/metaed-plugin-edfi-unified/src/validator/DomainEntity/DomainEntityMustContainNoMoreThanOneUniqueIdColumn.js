// @flow
import type { EntityProperty, MetaEdEnvironment, ValidationFailure } from 'metaed-core';

const hasDuplicateUniqueIds = (properties: Array<EntityProperty>) =>
  properties.reduce(
    (count: number, property: EntityProperty) => (property.metaEdName === 'UniqueId' ? count + 1 : count),
    0,
  ) > 1;

// eslint-disable-next-line no-unused-vars
export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.entity.domainEntity.forEach(domainEntity => {
    if (!domainEntity.namespaceInfo.isExtension && hasDuplicateUniqueIds(domainEntity.properties)) {
      failures.push({
        validatorName: 'DomainEntityMustContainNoMoreThanOneUniqueIdColumn',
        category: 'error',
        message: `Domain Entity ${
          domainEntity.metaEdName
        } has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.`,
        sourceMap: domainEntity.sourceMap.type,
        fileMap: null,
      });
    }
  });

  return failures;
}
