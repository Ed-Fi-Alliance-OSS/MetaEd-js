import { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'AssociationReferenceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.association.forEach(property => {
    const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'association',
      'associationSubclass',
    ) as TopLevelEntity | null;

    if (referencedEntity) {
      property.referencedEntity = referencedEntity;
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
