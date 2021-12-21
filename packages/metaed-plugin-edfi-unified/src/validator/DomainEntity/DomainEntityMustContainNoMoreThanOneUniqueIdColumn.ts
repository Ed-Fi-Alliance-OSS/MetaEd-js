import { EntityProperty, MetaEdEnvironment, ValidationFailure } from 'metaed-core';

const hasDuplicateUniqueIds = (properties: EntityProperty[]) =>
  properties.reduce(
    (count: number, property: EntityProperty) => (property.metaEdName === 'UniqueId' ? count + 1 : count),
    0,
  ) > 1;

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    if (namespace.isExtension) return;
    namespace.entity.domainEntity.forEach((domainEntity) => {
      if (hasDuplicateUniqueIds(domainEntity.properties)) {
        failures.push({
          validatorName: 'DomainEntityMustContainNoMoreThanOneUniqueIdColumn',
          category: 'error',
          message: `Domain Entity ${domainEntity.metaEdName} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.`,
          sourceMap: domainEntity.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
