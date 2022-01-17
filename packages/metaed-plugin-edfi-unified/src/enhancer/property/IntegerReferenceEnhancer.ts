import { EnhancerResult, MetaEdEnvironment, SharedIntegerProperty, IntegerType, SharedInteger } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'IntegerReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// integerType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of IntegerType
function addReferringSimplePropertiesToIntegerType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedInteger.forEach((property: SharedIntegerProperty) => {
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
  metaEd.propertyIndex.sharedInteger.forEach((property: SharedIntegerProperty) => {
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

  addReferringSimplePropertiesToIntegerType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
