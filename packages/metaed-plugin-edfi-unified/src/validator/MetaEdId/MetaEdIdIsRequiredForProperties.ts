import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { getAllProperties } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    if (property.namespace.isExtension) return;
    if (property.metaEdId) return;
    failures.push({
      validatorName: 'MetaEdIdIsRequiredForProperties',
      category: 'warning',
      message: `${property.typeHumanizedName} ${property.metaEdName} on ${property.parentEntity.typeHumanizedName} ${property.parentEntity.metaEdName} is missing a MetaEdId value.`,
      sourceMap: property.sourceMap.metaEdName,
      fileMap: null,
    });
  });
  return failures;
}
