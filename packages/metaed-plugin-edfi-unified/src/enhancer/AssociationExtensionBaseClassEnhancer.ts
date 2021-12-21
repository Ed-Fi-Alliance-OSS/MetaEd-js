import { MetaEdEnvironment, EnhancerResult, AssociationExtension, TopLevelEntity } from 'metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'AssociationExtensionBaseClassEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationExtension') as AssociationExtension[]).forEach((childEntity) => {
    const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
      childEntity.baseEntityName,
      childEntity.baseEntityNamespaceName,
      childEntity.namespace,
      'association',
      'associationSubclass',
    ) as TopLevelEntity | null;

    if (referencedEntity) {
      childEntity.baseEntity = referencedEntity;
      referencedEntity.extendedBy.push(childEntity);
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
