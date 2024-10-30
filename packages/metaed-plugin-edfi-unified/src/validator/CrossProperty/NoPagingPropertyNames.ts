import { EntityProperty, getAllProperties, MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    const reservedKeywords = ['offset', 'limit', 'totalcount'];

    if (reservedKeywords.includes(property.metaEdName.toLowerCase())) {
      failures.push({
        validatorName: 'NoPagingPropertyNames',
        category: 'error',
        message: `${property.metaEdName} is reserved for paging queries. Reserved keywords are Offset, Limit and TotalCount`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
