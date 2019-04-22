import { EnhancerResult, MetaEdEnvironment, SharedDecimalProperty, DecimalType, SharedDecimal } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'DecimalReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// decimalType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of DecimalType
function addReferringSimplePropertiesToDecimalType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedDecimal.forEach((property: SharedDecimalProperty) => {
    const referencedEntity: DecimalType | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'decimalType',
    ) as DecimalType | null;

    if (referencedEntity) {
      referencedEntity.referringSimpleProperties.push(property);
    }
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedDecimal.forEach((property: SharedDecimalProperty) => {
    const referencedEntity: SharedDecimal | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'sharedDecimal',
    ) as SharedDecimal | null;

    if (referencedEntity) {
      property.referencedEntity = referencedEntity;
      referencedEntity.inReferences.push(property);
      property.parentEntity.outReferences.push(property);
    }
  });

  addReferringSimplePropertiesToDecimalType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
