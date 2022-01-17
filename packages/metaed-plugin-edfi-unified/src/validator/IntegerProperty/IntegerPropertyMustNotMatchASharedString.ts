import { MetaEdEnvironment, ValidationFailure, ModelBase } from '@edfi/metaed-core';
import { findFirstEntity } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.integer.forEach((property) => {
    const referencedEntity: ModelBase | null = findFirstEntity(property.metaEdName, [property.namespace], 'sharedString');

    if (referencedEntity != null) {
      failures.push({
        validatorName: 'IntegerPropertyMustNotMatchASharedString',
        category: 'error',
        message: `${property.type} ${property.metaEdName} has the same name as a Shared String.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
