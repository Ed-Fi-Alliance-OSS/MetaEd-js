// @flow
import {
  asTopLevelEntity,
  getEntitiesOfType,
  newReferentialProperty,
  NoTopLevelEntity,
} from 'metaed-core';
import type {
  EnhancerResult,
  MetaEdEnvironment,
  ModelType,
  PropertyType,
  ReferentialProperty,
  TopLevelEntity,
} from 'metaed-core';
import { addEntityPropertyEdfiOdsTo } from '../model/property/EntityProperty';

const enhancerName: string = 'TopLevelEntityBaseReferenceEnhancer';

export function propertyTypeFor(entity: TopLevelEntity): PropertyType {
  const propertyType: { [ModelType]: () => PropertyType } = {
    associationExtension: () => 'association',
    associationSubclass: () => 'association',
    domainEntityExtension: () => 'domainEntity',
    domainEntitySubclass: () => 'domainEntity',
    association: () => 'association',
    domainEntity: () => 'domainEntity',
  };

  return propertyType[entity.type]();
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(
    metaEd.entity,
    'associationExtension',
    'associationSubclass',
    'domainEntityExtension',
    'domainEntitySubclass',
  ).map(x => asTopLevelEntity(x)).forEach((entity: TopLevelEntity) => {
    if (entity.data.edfiOds.ods_Properties.some(x => x.isIdentityRename)) return;

    const referenceToBase: ReferentialProperty = Object.assign(newReferentialProperty(), {
      metaEdName: entity.baseEntity ? entity.baseEntity.metaEdName : '',
      documentation: entity.baseEntity ? entity.baseEntity.documentation : '',
      type: entity.baseEntity ? propertyTypeFor(entity.baseEntity) : 'unknown',
      isPartOfIdentity: true,
      parentEntity: entity,
      referencedEntity: entity.baseEntity ? entity.baseEntity : NoTopLevelEntity,
      namespaceInfo: entity.namespaceInfo,
      data: {
        edfiOds: {
          ods_DeleteCascadePrimaryKey: true,
          ods_CausesCyclicUpdateCascade: false,
        },
      },
    });
    addEntityPropertyEdfiOdsTo(referenceToBase);
    entity.data.edfiOds.ods_Properties.push(referenceToBase);
    entity.data.edfiOds.ods_IdentityProperties.push(referenceToBase);
  });

  return {
    enhancerName,
    success: true,
  };
}
