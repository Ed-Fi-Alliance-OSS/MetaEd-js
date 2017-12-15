// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  SharedString,
  SharedStringProperty,
  StringType,
} from 'metaed-core';

const enhancerName: string = 'StringReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// stringType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of StringType
function addReferringSimplePropertiesToStringType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedString.forEach((property: SharedStringProperty) => {
    const referencedEntity: ?StringType = metaEd.entity.stringType.get(property.referencedType);
    if (referencedEntity == null) return;

    referencedEntity.referringSimpleProperties.push(property);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedString.forEach((property: SharedStringProperty) => {
    const referencedEntity: ?SharedString = metaEd.entity.sharedString.get(property.referencedType);
    if (referencedEntity == null) return;

    property.referencedEntity = referencedEntity;
  });

  addReferringSimplePropertiesToStringType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
