// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  SharedInteger,
  SharedIntegerProperty,
  IntegerType,
} from 'metaed-core';

const enhancerName: string = 'IntegerReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// integerType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of IntegerType
function addReferringSimplePropertiesToIntegerType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedInteger.forEach((property: SharedIntegerProperty) => {
    const referencedEntity: ?IntegerType = metaEd.entity.integerType.get(property.referencedType);
    if (referencedEntity == null) return;

    referencedEntity.referringSimpleProperties.push(property);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedInteger.forEach((property: SharedIntegerProperty) => {
    const referencedEntity: ?SharedInteger = metaEd.entity.sharedInteger.get(property.referencedType);
    if (referencedEntity == null) return;

    property.referencedEntity = referencedEntity;
  });

  addReferringSimplePropertiesToIntegerType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
