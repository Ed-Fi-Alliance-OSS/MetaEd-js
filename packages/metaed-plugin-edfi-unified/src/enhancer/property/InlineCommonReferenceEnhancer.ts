import { MetaEdEnvironment, EnhancerResult, Common } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'InlineCommonReferenceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.inlineCommon.forEach((property) => {
    const referencedEntity: Common | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'common',
    ) as Common | null;
    if (referencedEntity && referencedEntity.inlineInOds) {
      property.referencedEntity = referencedEntity;
      property.referencedEntityDeprecated = referencedEntity.isDeprecated;
      referencedEntity.inReferences.push(property);
      property.parentEntity.outReferences.push(property);
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
