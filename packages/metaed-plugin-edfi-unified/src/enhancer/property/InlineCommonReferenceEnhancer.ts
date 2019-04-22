import { MetaEdEnvironment, EnhancerResult, Common } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'InlineCommonReferenceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.inlineCommon.forEach(property => {
    const referencedEntity: Common | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'common',
    ) as Common | null;
    if (referencedEntity && referencedEntity.inlineInOds) {
      property.referencedEntity = referencedEntity;
      referencedEntity.inReferences.push(property);
      property.parentEntity.outReferences.push(property);
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
