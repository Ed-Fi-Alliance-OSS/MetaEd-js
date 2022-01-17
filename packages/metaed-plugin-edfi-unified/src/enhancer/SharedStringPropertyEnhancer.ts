import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { asStringType, NoSharedSimple } from '@edfi/metaed-core';

const enhancerName = 'SharedStringPropertyEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedString.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;

    const referencedEntity = asStringType(property.referencedEntity);
    property.minLength = referencedEntity.minLength;
    property.maxLength = referencedEntity.maxLength;
  });

  return {
    enhancerName,
    success: true,
  };
}
