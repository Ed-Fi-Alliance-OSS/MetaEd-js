import { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeItem, Namespace, TopLevelEntity } from 'metaed-core';
import { getEntityFromNamespaceChain, getAllEntitiesOfType, asInterchange } from 'metaed-core';

const enhancerName = 'InterchangeBaseItemEnhancer';

function assignReference(namespace: Namespace, item: InterchangeItem) {
  const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
    item.metaEdName,
    item.referencedNamespaceName,
    namespace,
    ...item.referencedType,
  ) as TopLevelEntity | null;

  if (referencedEntity) {
    item.referencedEntity = referencedEntity;
    item.referencedEntityDeprecated = referencedEntity.isDeprecated;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'interchange', 'interchangeExtension') as Interchange[]).forEach((interchangeBase) => {
    const interchange: Interchange = asInterchange(interchangeBase);
    interchange.elements.forEach((item) => assignReference(interchange.namespace, item));
    interchange.identityTemplates.forEach((item) => assignReference(interchange.namespace, item));
  });

  return {
    enhancerName,
    success: true,
  };
}
