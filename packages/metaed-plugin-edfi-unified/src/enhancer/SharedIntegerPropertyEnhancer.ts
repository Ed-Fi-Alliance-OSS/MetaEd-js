import { MetaEdEnvironment, EnhancerResult } from 'metaed-core';
import { asIntegerType, NoSharedSimple } from 'metaed-core';

const enhancerName = 'SharedIntegerPropertyEnhancer';

function copyRestrictions(property) {
  const referencedEntity = asIntegerType(property.referencedEntity);
  property.minValue = referencedEntity.minValue;
  property.maxValue = referencedEntity.maxValue;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedInteger.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;
    copyRestrictions(property);
  });

  metaEd.propertyIndex.sharedShort.forEach((property) => {
    if (property.referencedEntity === NoSharedSimple) return;
    copyRestrictions(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
