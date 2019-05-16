import { MetaEdEnvironment, ValidationFailure, ModelBase } from 'metaed-core';
import { findFirstEntity } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.integer.forEach(property => {
    const referencedEntity: ModelBase | null = findFirstEntity(
      property.metaEdName,
      [property.namespace, ...property.namespace.dependencies],
      'sharedDecimal',
    );

    if (referencedEntity != null) {
      failures.push({
        validatorName: 'IntegerPropertyMustNotMatchASharedDecimal',
        category: 'error',
        message: `${property.type} ${property.metaEdName} has the same name as a Shared Decimal.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
