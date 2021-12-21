import { MetaEdEnvironment, EnhancerResult, Subdomain, Domain } from 'metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from 'metaed-core';

const enhancerName = 'SubdomainParentEntityEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'subdomain') as Subdomain[]).forEach((childEntity) => {
    const parent: Domain | null = getEntityFromNamespaceChain(
      childEntity.parentMetaEdName,
      childEntity.namespace.namespaceName,
      childEntity.namespace,
      'domain',
    ) as Domain | null;

    if (parent) childEntity.parent = parent;
  });

  return {
    enhancerName,
    success: true,
  };
}
