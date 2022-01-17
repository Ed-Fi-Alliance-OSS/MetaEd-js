import { EnhancerResult, MetaEdEnvironment, SharedShortProperty, IntegerType, SharedInteger } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'ShortReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// integerType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of IntegerType
function addReferringSimplePropertiesToShortType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedShort.forEach((property: SharedShortProperty) => {
    const referencedEntity: IntegerType | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'integerType',
    ) as IntegerType | null;

    if (referencedEntity) {
      referencedEntity.referringSimpleProperties.push(property);
    }
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedShort.forEach((property: SharedShortProperty) => {
    const referencedEntity: SharedInteger | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'sharedInteger',
    ) as SharedInteger | null;

    if (referencedEntity) {
      property.referencedEntity = referencedEntity;
      property.referencedEntityDeprecated = referencedEntity.isDeprecated;
      referencedEntity.inReferences.push(property);
      property.parentEntity.outReferences.push(property);
    }
  });

  addReferringSimplePropertiesToShortType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
