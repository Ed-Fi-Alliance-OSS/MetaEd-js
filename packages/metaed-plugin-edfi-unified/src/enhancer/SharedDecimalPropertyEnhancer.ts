import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { asDecimalType, NoSharedSimple } from '@edfi/metaed-core';

const enhancerName = 'SharedDecimalPropertyEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedDecimal.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;

    const referencedEntity = asDecimalType(property.referencedEntity);
    property.totalDigits = referencedEntity.totalDigits;
    property.decimalPlaces = referencedEntity.decimalPlaces;
    property.minValue = referencedEntity.minValue;
    property.maxValue = referencedEntity.maxValue;
  });

  return {
    enhancerName,
    success: true,
  };
}
