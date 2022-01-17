import { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'InterchangeExtensionBaseClassEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'interchangeExtension') as InterchangeExtension[]).forEach((childEntity) => {
    const referencedEntity: Interchange | null = getEntityFromNamespaceChain(
      childEntity.baseEntityName,
      childEntity.baseEntityNamespaceName,
      childEntity.namespace,
      'interchange',
    ) as Interchange | null;

    if (referencedEntity) childEntity.baseEntity = referencedEntity;
  });

  return {
    enhancerName,
    success: true,
  };
}
