// @flow
import type { MetaEdEnvironment, EnhancerResult, TopLevelEntity, EntityProperty } from '../../../metaed-core/index';
import { getEntitiesOfType } from '../../../metaed-core/index';
import { EntityRepository } from '../../../metaed-core/src/model/EntityRepository';
import type { TopLevelEntityEdfiXsd } from '../model/TopLevelEntity';

// This enhancer covers both the original AssociationBaseInlineIdentityEnhancer and DomainEntityBaseInlineIdentityEnhancer

const enhancerName: string = 'AddInlineIdentityEnhancer';

function addInlineIdentities(topLevelEntity: TopLevelEntity, properties: Array<EntityProperty>, entity: EntityRepository) {
  properties.filter(p => p.type === 'inlineCommon' || p.type === 'common').forEach(commonProperty => {
    const common = entity.common.get(commonProperty.metaEdName);
    if (!(common && common.inlineInOds)) return;
    common.properties.filter(p => p.isPartOfIdentity).forEach(identityProperty => {
      const topLevelEntityEdfiXsd: TopLevelEntityEdfiXsd = ((topLevelEntity.data.edfiXsd: any): TopLevelEntityEdfiXsd);
      topLevelEntityEdfiXsd.xsd_IdentityProperties.push(identityProperty);
    });
    addInlineIdentities(topLevelEntity, common.properties, entity);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity,
    'association',
    'associationExtension',
    'associationSubclass',
    'domainEntity',
    'domainEntityExtension',
    'domainEntitySubclass').forEach(entity => {
      const topLevelEntity = ((entity: any): TopLevelEntity);
      addInlineIdentities(topLevelEntity, topLevelEntity.properties, metaEd.entity);
    });

  return {
    enhancerName,
    success: true,
  };
}
