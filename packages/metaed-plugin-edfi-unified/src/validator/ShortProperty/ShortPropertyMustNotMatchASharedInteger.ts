import { MetaEdEnvironment, ValidationFailure, ModelBase } from '@edfi/metaed-core';
import { findFirstEntity } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.short.forEach((property) => {
    const referencedEntity: ModelBase | null = findFirstEntity(property.metaEdName, [property.namespace], 'sharedInteger');

    if (referencedEntity != null) {
      failures.push({
        validatorName: 'ShortPropertyMustNotMatchASharedInteger',
        category: 'error',
        message: `Short Property ${property.metaEdName} has the same name as a Shared Integer.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
