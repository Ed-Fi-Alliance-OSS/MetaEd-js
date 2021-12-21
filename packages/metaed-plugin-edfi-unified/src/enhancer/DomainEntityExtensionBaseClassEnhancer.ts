import { MetaEdEnvironment, EnhancerResult, DomainEntityExtension, TopLevelEntity } from 'metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'DomainEntityExtensionBaseClassEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntityExtension') as DomainEntityExtension[]).forEach((childEntity) => {
    const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
      childEntity.baseEntityName,
      childEntity.baseEntityNamespaceName,
      childEntity.namespace,
      'domainEntity',
      'domainEntitySubclass',
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
