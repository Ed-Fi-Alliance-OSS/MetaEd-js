import { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'EnumerationReferenceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.enumeration.forEach(property => {
    const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'enumeration',
    ) as TopLevelEntity | null;
    if (referencedEntity) {
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
