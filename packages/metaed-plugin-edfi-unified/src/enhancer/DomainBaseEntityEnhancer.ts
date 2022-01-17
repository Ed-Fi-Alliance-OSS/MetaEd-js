import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, Domain, Subdomain } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain, topLevelCoreEntityModelTypes } from '@edfi/metaed-core';

const enhancerName = 'DomainBaseEntityEnhancer';

type DomainBase = Domain | Subdomain;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domain', 'subdomain').forEach((entity) => {
    (entity as DomainBase).domainItems.forEach((domainItem) => {
      const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        domainItem.metaEdName,
        domainItem.referencedNamespaceName,
        domainItem.namespace,
        ...topLevelCoreEntityModelTypes,
      ) as TopLevelEntity | null;

      if (referencedEntity) {
        (entity as DomainBase).entities.push(referencedEntity);
        domainItem.referencedEntity = referencedEntity;
        domainItem.referencedEntityDeprecated = referencedEntity.isDeprecated;
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
