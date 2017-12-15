// @flow
import type {
  EnhancerResult,
  IntegerType,
  MetaEdEnvironment,
  SharedInteger,
  SharedShortProperty,
} from 'metaed-core';

const enhancerName: string = 'ShortReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// integerType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of IntegerType
function addReferringSimplePropertiesToShortType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedShort.forEach((property: SharedShortProperty) => {
    const referencedEntity: ?IntegerType = metaEd.entity.integerType.get(property.referencedType);
    if (referencedEntity == null) return;

    referencedEntity.referringSimpleProperties.push(property);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedShort.forEach((property: SharedShortProperty) => {
    const referencedEntity: ?SharedInteger = metaEd.entity.sharedInteger.get(property.referencedType);
    if (referencedEntity == null) return;

    property.referencedEntity = referencedEntity;
  });

  addReferringSimplePropertiesToShortType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
