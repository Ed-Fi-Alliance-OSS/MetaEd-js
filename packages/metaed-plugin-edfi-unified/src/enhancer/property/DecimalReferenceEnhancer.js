// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  SharedDecimal,
  SharedDecimalProperty,
  DecimalType,
} from 'metaed-core';

const enhancerName: string = 'DecimalReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// decimalType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of DecimalType
function addReferringSimplePropertiesToDecimalType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedDecimal.forEach((property: SharedDecimalProperty) => {
    const referencedEntity: ?DecimalType = metaEd.entity.decimalType.get(property.referencedType);
    if (referencedEntity == null) return;

    referencedEntity.referringSimpleProperties.push(property);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedDecimal.forEach((property: SharedDecimalProperty) => {
    const referencedEntity: ?SharedDecimal = metaEd.entity.sharedDecimal.get(property.referencedType);
    if (referencedEntity == null) return;

    property.referencedEntity = referencedEntity;
  });

  addReferringSimplePropertiesToDecimalType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
