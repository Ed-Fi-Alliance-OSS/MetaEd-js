import { MetaEdEnvironment, EnhancerResult, DomainEntitySubclass, TopLevelEntity } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'DomainEntitySubclassBaseClassEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntitySubclass') as DomainEntitySubclass[]).forEach((childEntity) => {
    const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
      childEntity.baseEntityName,
      childEntity.baseEntityNamespaceName,
      childEntity.namespace,
      'domainEntity',
      'domainEntitySubclass',
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
