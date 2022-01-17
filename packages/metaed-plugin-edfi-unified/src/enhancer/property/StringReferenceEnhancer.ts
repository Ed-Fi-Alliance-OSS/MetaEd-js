import { EnhancerResult, MetaEdEnvironment, SharedStringProperty, StringType, SharedString } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'StringReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// stringType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of StringType
function addReferringSimplePropertiesToStringType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedString.forEach((property: SharedStringProperty) => {
    const referencedEntity: StringType | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'stringType',
    ) as StringType | null;

    if (referencedEntity) {
      referencedEntity.referringSimpleProperties.push(property);
    }
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedString.forEach((property: SharedStringProperty) => {
    const referencedEntity: SharedString | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'sharedString',
    ) as SharedString | null;

    if (referencedEntity) {
      property.referencedEntity = referencedEntity;
      property.referencedEntityDeprecated = referencedEntity.isDeprecated;
      referencedEntity.inReferences.push(property);
      property.parentEntity.outReferences.push(property);
    }
  });

  addReferringSimplePropertiesToStringType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
