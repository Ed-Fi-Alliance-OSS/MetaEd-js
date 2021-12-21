import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, EntityProperty, Namespace, Common } from 'metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from 'metaed-core';
import { TopLevelEntityEdfiXsd } from '../model/TopLevelEntity';

// This enhancer covers both the original AssociationBaseInlineIdentityEnhancer and DomainEntityBaseInlineIdentityEnhancer

const enhancerName = 'AddInlineIdentityEnhancer';

function addInlineIdentities(topLevelEntity: TopLevelEntity, properties: EntityProperty[], namespace: Namespace) {
  properties
    .filter((p) => p.type === 'inlineCommon')
    .forEach((commonProperty) => {
      const common: Common | null = getEntityFromNamespaceChain(
        commonProperty.metaEdName,
        commonProperty.referencedNamespaceName,
        namespace,
        'common',
      ) as Common | null;
      if (common == null || common.inlineInOds == null) return;
      common.properties
        .filter((p) => p.isPartOfIdentity)
        .forEach((identityProperty) => {
          const topLevelEntityEdfiXsd: TopLevelEntityEdfiXsd = topLevelEntity.data.edfiXsd as TopLevelEntityEdfiXsd;
          topLevelEntityEdfiXsd.xsdIdentityProperties.push(identityProperty);
        });
      addInlineIdentities(topLevelEntity, common.properties, namespace);
    });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'association',
    'associationExtension',
    'associationSubclass',
    'domainEntity',
    'domainEntityExtension',
    'domainEntitySubclass',
  ).forEach((entity) => {
    const topLevelEntity: TopLevelEntity = entity as TopLevelEntity;
    addInlineIdentities(topLevelEntity, topLevelEntity.properties, topLevelEntity.namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
