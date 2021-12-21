import { MetaEdEnvironment, EnhancerResult } from 'metaed-core';
import { asStringType, NoSharedSimple } from 'metaed-core';

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
