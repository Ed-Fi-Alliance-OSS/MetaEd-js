import { MetaEdEnvironment, EnhancerResult, AssociationSubclass, TopLevelEntity } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'AssociationSubclassBaseClassEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationSubclass') as AssociationSubclass[]).forEach((childEntity) => {
    const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
      childEntity.baseEntityName,
      childEntity.baseEntityNamespaceName,
      childEntity.namespace,
      'association',
      'associationSubclass',
    ) as TopLevelEntity | null;

    if (referencedEntity) {
      childEntity.baseEntity = referencedEntity;
      referencedEntity.subclassedBy.push(childEntity);
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
