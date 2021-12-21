import { MetaEdEnvironment, ValidationFailure, ModelBase } from 'metaed-core';
import { findFirstEntity } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.string.forEach((property) => {
    const referencedEntity: ModelBase | null = findFirstEntity(property.metaEdName, [property.namespace], 'sharedString');

    if (referencedEntity != null) {
      failures.push({
        validatorName: 'StringPropertyMustNotMatchASharedString',
        category: 'error',
        message: `String Property ${property.metaEdName} has the same name as a Shared String.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
