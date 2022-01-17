import { MetaEdEnvironment, ValidationFailure, ModelBase } from '@edfi/metaed-core';
import { findFirstEntity } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.decimal.forEach((property) => {
    const referencedEntity: ModelBase | null = findFirstEntity(property.metaEdName, [property.namespace], 'sharedInteger');

    if (referencedEntity != null) {
      failures.push({
        validatorName: 'DecimalPropertyMustNotMatchASharedInteger',
        category: 'error',
        message: `Decimal Property ${property.metaEdName} has the same name as a Shared Integer.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
